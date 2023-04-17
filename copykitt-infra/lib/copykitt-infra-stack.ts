import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as dotenv from "dotenv";

// 初始化dotenv
dotenv.config();
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CopykittInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // 部署base layer
    const layer = new lambda.LayerVersion(this, "BaseLayer", {
      code: lambda.Code.fromAsset("lambda_base_layer/layer.zip"),
      compatibleRuntimes:[lambda.Runtime.PYTHON_3_9],
    });
    // 将api 打包进入lambda
    const apiLambda = new lambda.Function(this, "ApiFunction", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code:lambda.Code.fromAsset("../app/"),
      handler: "copykitt_api.handler",
      layers: [layer],
      environment: {
        // 调取OPENAI_API_KEY 从env环境中
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "", // 设置空字符串防止OPENAI_API_KEY调取失败
      }
    });
    // 创建gateway api 对象
    const copyKittApi = new apiGateway.RestApi(this, "RestApi", {
      restApiName:"CopyKitt Tutorial API",
    })
    // 调用gateway api 对象，添加到integration 代理， 使得请求被转发
    copyKittApi.root.addProxy({
      defaultIntegration: new apiGateway.LambdaIntegration(apiLambda),
    });
  }
}

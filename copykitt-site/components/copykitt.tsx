import React from "react";
import Form from "./form";
import Results from "./results";
import Image from "next/image";
import logo from "../public/copykittLogo.svg";

const CopyKitt: React.FC = () => {
  const CHARACTER_LIMIT: number = 32;
  const ENDPOINT: string =
    "https://fdgb1jgo7k.execute-api.us-east-1.amazonaws.com/prod/generate_snippet_and_keywords";
  // 保存表单出入的信息
  const [prompt, setPrompt] = React.useState("");
  const [snippet, setSnippet] = React.useState("");
  const [keywords, setKeywords] = React.useState([]);
  const [hasResult, setHasResult] = React.useState(false);  // 设置是否有结果的判断状态
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = () => {
    console.log("Submitting: " + prompt);
    setIsLoading(true);
    // 从fastAPI 的 hooks里调取数据，这里ENDPOINT 就是保存在lambda 里的已经被打包的copykitt_api.py文件中的 generate_snippet_and_keywords
    fetch(`${ENDPOINT}?prompt=${prompt}`)
      .then((res) => res.json())
      .then(onResult);
  };
  // 当onsubmit出发后返回结data时，保存结果再setSnippet和setKeywords中，并出发setHasResult和isLoading, 设置hasResult为True.进而在下面 if (hasResult)处时进行判断和展示
  const onResult = (data: any) => {
    setSnippet(data.snippet);
    setKeywords(data.keywords);
    setHasResult(true);
    setIsLoading(false);
  };

  const onReset = () => {
    setPrompt("");
    setHasResult(false);
    setIsLoading(false);
  };
  // 初始被展示结果，为空
  let displayedElement = null;
  // 当“是否有结果”状态返回True, 说明网页发送请求后，从fastAPI 返回了结果。那么这里就需要展示结果， 展示结果的页面样式保存在results.tsx中
  if (hasResult) {
    displayedElement = (
      // 该Results 是从components/results.tsx里引入，为的是展示结果时是按照results.tsx定义的样式
      // 结果传入results.tsx中，进行展示
      <Results
        snippet={snippet}
        keywords={keywords}
        onBack={onReset}
        prompt={prompt}
      />
    );
  } else {  // 当空置状态时，显示表格，等待用户填写，一旦填写, 触发onSubmit, 并且将信息保存到setPrompt, 和 prompt
    displayedElement = (
      // 该Form 是从components/form.tsx里引入，为的是按照form.tsx定义的样式定义表格样式并实现表格共嫩
      // 这几个变量里保存的信息和函数都会被传从到form.tsx中进行处理
      <Form
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={onSubmit}
        isLoading={isLoading}
        characterLimit={CHARACTER_LIMIT}
      />
    );
  }

  const gradientTextStyle =
    "text-white text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-light w-fit mx-auto";

  return (
    <div className="h-screen flex">
      <div className="max-w-md m-auto p-2">
        <div className="bg-slate-800 p-6 rounded-md text-white">
          <div className="text-center my-6">
            <Image src={logo} width={42} height={42} />
            <h1 className={gradientTextStyle + " text-3xl font-light"}>
              CopyKitt
            </h1>
            <div className={gradientTextStyle}>Your AI branding assistant</div>
          </div>

          {displayedElement}
        </div>
      </div>
    </div>
  );
};

export default CopyKitt;

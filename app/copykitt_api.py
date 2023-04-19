from fastapi import FastAPI, HTTPException
from copykitt import  generate_branding_snippet, generate_keywords
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# 运行该命令，调出fastAPI 的调试界面
# uvicorn copykitt_api:app --reload

### 将该fastAPI的app打包进Mangum中，方便aws lambda调用
# 这个handler将会reroute 每一个function的route, 比如 @app.get("/generate_snippet")， 重新进行路由定向
handler = Mangum(app)
MAX_INPUT_LENGTH = 32
# 这里设置后，允许后面浏览器提取fastAI 返回的信息
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#封装snippet api
@app.get("/generate_snippet")
async def generate_snippet_api(prompt: str):
    # 这里将copykitt的gpt function 引入， snippet功能
    validate_input_length(prompt)
    snippet = generate_branding_snippet(prompt)
    return {"snippet": snippet, "keywords": []}

#封装keywords api
@app.get("/generate_keywords")
async def generate_snippet_api(prompt: str):
    # gpt keywords功能
    validate_input_length(prompt)
    keywords = generate_keywords(prompt)
    return {"snippet": None, "keywords": keywords}

# 合并函数，同时产生snippet 和 keywords
@app.get("/generate_snippet_and_keywords")
async def generate_snippet_api(prompt: str):
    validate_input_length(prompt)
    snippet = generate_branding_snippet(prompt)
    keywords = generate_keywords(prompt)
    return {"snippet": snippet, "keywords": keywords}

def validate_input_length(prompt: str):
    if len(prompt) >= MAX_INPUT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Input length is too long. Must be under {MAX_INPUT_LENGTH} characters.",
        )
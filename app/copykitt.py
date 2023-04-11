import os
from typing import List

import openai
import argparse
import re

MAX_INPUT_LENGTH = 32
def main():
    print('---')
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", type=str, required=True)
    args = parser.parse_args()
    user_input = args.input
    print(f"User input:{user_input}")
    if validate_length(user_input):
        generate_branding_snippet(user_input)
        generate_keywords(user_input)
    else:
        raise ValueError(
            f"Input length is too long. Must be under {MAX_INPUT_LENGTH}. Submitted input is {user_input}"
        )

# 判断输入是否超过固定长度
def validate_length(prompt: str) -> bool:
    return len(prompt) <= MAX_INPUT_LENGTH

# 生成品牌关键词， 类似generate_branding_snippet, 关键是命令行enriched_prompt里把产生处branding_snippet换成了branding keywords
def generate_keywords(prompt:str) -> List[str]:
    openai.api_key = os.getenv("OPENAI_API_KEY")
    enriched_prompt = f"Generate related branding keywords for {prompt}: "
    print(enriched_prompt)
    response = openai.Completion.create(model="text-curie-001", prompt=enriched_prompt, temperature=0, max_tokens=32) # davinci-instruct-beta-v3
    keywords_text: str = response["choices"][0]["text"]
    keywords_text = keywords_text.strip()
    # 将词按 , 换行 分号和- 分隔开保存在List中，且每一项都是str
    keywords_array = re.split(",|\n|;|-", keywords_text)
    # remove the write spaces, with lowercase
    keywords_array = [k.lower().strip() for k in keywords_array]
    # remove empty elements
    keywords_array = [k for k in keywords_array if len(k) > 0]
    print(f"Keywords:{keywords_array}")
    return keywords_array

# 产生品牌推广片段
def generate_branding_snippet(prompt:str) -> str:
    # Load your API key from an environment variable or secret management service
    openai.api_key = os.getenv("OPENAI_API_KEY")
    #### 将传入的关键词prompt 进行加工，产生出一个命令语句，比如prompt=”car", 在这里回变成让GPT产生一个branding snippet(片段标语)
    # gpt 会根据命令的提示，加上传入的词语，来产生结果
    enriched_prompt = f"Generate upbeat branding snippet for {prompt}: "
    print(enriched_prompt)
    ##### 调取openai gpt3 的引擎， 将上述命令语句传入gpt3, 生成的gpt的回答保存在respons里
    # 使用davinci-instruct-beta-v3 引擎可以产生内容
    # temperature: randomness and thus the creativity;  0 means the responses will be very straightforward, 1 means the responses can vary wildly
    response = openai.Completion.create(model="text-curie-001", prompt=enriched_prompt, temperature=0, max_tokens=32) # davinci-instruct-beta-v3
    # 调取gpt给出的结果 变量名后加冒号“:” var: type = value  这是 Python 3.5 中引入的 Type Annotation，是一种注解，用来提示变量的类型
    branding_text: str = response["choices"][0]["text"]
    # 去掉空白
    branding_text = branding_text.strip()
    # 给被截断的句子后面加"..."省略号
    last_char = branding_text[-1]
    # 因为上面设置了gpt 返回的最大长度是32 (max_tokens=32), 所以为了防止放回的句子被切断，所以如果判断被切断了，需要在后面加入省略号，否则句子是病句。
    if last_char not in {".", "!", "?"}:
        branding_text += "..."
    print(f"Snippet:{branding_text}")
    return  branding_text

if __name__ == "__main__":
    main()
interface FormProps {
  prompt: string;
  setPrompt: any;
  onSubmit: any;
  isLoading: boolean;
  characterLimit: number;
}
// 使用React 框架构建
// 通过FormProps接口，保存传入的user输入信息，保存在props里
// 这里的props保存在前面copykitt.tsx中用户填写的信息，包括 prompt={prompt} setPrompt={setPrompt} onSubmit={onSubmit} isLoading={isLoading} characterLimit={CHARACTER_LIMIT}
// 该文件的目的是创建 固定的样式来显示，并处理信息
const Form: React.FC<FormProps> = (props) => {
  const isPromptValid = props.prompt.length < props.characterLimit;
  const updatePromptValue = (text: string) => {
    if (text.length <= props.characterLimit) {
      props.setPrompt(text);
    }
  };

  let statusColor = "text-slate-500";
  let statusText = null;
  if (!isPromptValid) {
    statusColor = "text-red-400";
    statusText = `Input must be less than ${props.characterLimit} characters.`;
  }

  return (
    <>
      <div className="mb-6 text-slate-400">
        <p>
          Tell me what your brand is about and I will generate copy and keywords
          for you.
        </p>
      </div>

      <input
        className="p-2 w-full rounded-md focus:outline-teal-400 focus:outline text-slate-700"
        type="text"
        placeholder="coffee"
        value={props.prompt}
        onChange={(e) => updatePromptValue(e.currentTarget.value)}
      ></input>
      <div className={statusColor + " flex justify-between my-2 mb-6 text-sm"}>
        <div>{statusText}</div>
        <div>
          {props.prompt.length}/{props.characterLimit}
        </div>
      </div>

      <button //表格中保存的信息进行提交，出发onSubmit, 这个onSubmit是copykitt.tsx种定义的函数，用于提交时触发，从而使得结果被发送
        className="bg-gradient-to-r from-teal-400 
        to-blue-500 disabled:opacity-50 w-full p-2 rounded-md text-lg"
        onClick={props.onSubmit}
        disabled={props.isLoading || !isPromptValid}
      >
        Submit
      </button>
    </>
  );
};
// 提供对外引入接口
export default Form;

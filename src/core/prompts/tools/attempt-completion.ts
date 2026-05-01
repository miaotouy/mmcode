import { ToolArgs } from "./types"

export function getAttemptCompletionDescription(args?: ToolArgs): string {
	return `## attempt_completion
描述: 每次工具使用后，用户会回复使用结果——成功或失败及其原因。收到结果确认任务完成后，用此工具向用户展示工作成果。如果用户不满意，可以给反馈，你可以据此改进重试。
重要提示: 确认之前的工具使用已成功之前，**不能**用此工具，否则会导致代码损坏和系统故障。用之前必须确认已收到用户对之前所有工具使用的成功结果。没收到就**不要**用。
参数:
- result: (必填) 任务结果。结果应该是最终形式的，不需要用户进一步输入。不要以问题或"还需要帮忙吗"结尾。
用法:
<attempt_completion>
<result>
最终结果描述
</result>
</attempt_completion>

示例: 请求尝试完成并显示结果
<attempt_completion>
<result>
已完成 CSS 更新
</result>
</attempt_completion>`
}

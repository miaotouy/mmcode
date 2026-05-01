export function getAskFollowupQuestionDescription(): string {
	return `## ask_followup_question
描述: 向用户提问以收集完成任务所需的额外信息。需要澄清或更多细节才能推进时使用。

参数:
- question: (必填) 针对所需信息的清晰具体的问题
- follow_up: (可选) 2-4 个建议答案的列表，每个放在自己的 <suggest> 标签里。建议必须是完整、可操作的答案，不含占位符。可选加 mode 属性切换模式（code/architect 等）

用法:
<ask_followup_question>
<question>你的问题</question>
<follow_up>
<suggest>第一个建议</suggest>
<suggest mode="code">带模式切换的操作</suggest>
</follow_up>
</ask_followup_question>

示例:
<ask_followup_question>
<question>frontend-config.json 文件路径在哪？</question>
<follow_up>
<suggest>./src/frontend-config.json</suggest>
<suggest>./config/frontend-config.json</suggest>
<suggest>./frontend-config.json</suggest>
</follow_up>
</ask_followup_question>`
}

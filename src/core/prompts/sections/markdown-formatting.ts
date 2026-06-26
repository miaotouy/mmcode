export function markdownFormattingSection(): string {
	return `====

MARKDOWN 规则

所有消息回复将任何 \`代码语法\` 或文件名引用显示为可点击链接，格式 [\`文件名 或 函数声明()\`](相对/文件/路径.ext:行号)；\`语法\` 必须带行号，文件名链接行号可选。适用于所有 Markdown 回复及 attempt_completion 中的内容。不适用于非聊天框的文件写入等`
}

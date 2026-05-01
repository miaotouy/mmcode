/**
 * Generates the fetch_instructions tool description.
 * @param enableMcpServerCreation - Whether to include MCP server creation task.
 *                                  Defaults to true when undefined.
 */
export function getFetchInstructionsDescription(enableMcpServerCreation?: boolean): string {
	const tasks =
		enableMcpServerCreation !== false
			? `  create_mcp_server
  create_mode`
			: `  create_mode`

	const example =
		enableMcpServerCreation !== false
			? `示例: 获取创建 MCP 服务的说明

<fetch_instructions>
<task>create_mcp_server</task>
</fetch_instructions>`
			: `示例: 获取创建模式的说明

<fetch_instructions>
<task>create_mode</task>
</fetch_instructions>`

	return `## fetch_instructions
描述: 请求获取执行任务的说明
参数:
- task: (必填) 要获取说明的任务。可选值:
${tasks}

${example}`
}

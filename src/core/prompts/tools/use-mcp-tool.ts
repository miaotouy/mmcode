import { ToolArgs } from "./types"

export function getUseMcpToolDescription(args: ToolArgs): string | undefined {
	if (!args.mcpHub) {
		return undefined
	}
	return `## use_mcp_tool
描述: 使用已连接 MCP 服务提供的工具。每个 MCP 服务可以提供多个不同功能的工具。工具有定义的输入模式，指定必需和可选参数。
参数:
- server_name: (必填) 提供工具的 MCP 服务名称
- tool_name: (必填) 要执行的工具名称
- arguments: (必填) 包含工具输入参数的 JSON 对象，遵循工具的输入模式
用法:
<use_mcp_tool>
<server_name>服务名称</server_name>
<tool_name>工具名称</tool_name>
<arguments>
{
  "param1": "value1",
  "param2": "value2"
}
</arguments>
</use_mcp_tool>

示例: 请求使用 MCP 工具

<use_mcp_tool>
<server_name>weather-server</server_name>
<tool_name>get_forecast</tool_name>
<arguments>
{
  "city": "San Francisco",
  "days": 5
}
</arguments>
</use_mcp_tool>`
}

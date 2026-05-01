import { ToolArgs } from "./types"
import { McpHub } from "../../../services/mcp/McpHub"

/**
 * Helper function to check if any MCP server has resources available
 */
function hasAnyMcpResources(mcpHub: McpHub): boolean {
	const servers = mcpHub.getServers()
	return servers.some((server) => server.resources && server.resources.length > 0)
}

export function getAccessMcpResourceDescription(args: ToolArgs): string | undefined {
	if (!args.mcpHub || !hasAnyMcpResources(args.mcpHub)) {
		return undefined
	}
	return `## access_mcp_resource
描述: 请求访问已连接 MCP 服务提供的资源。资源是可用作上下文的数据源，比如文件、API 响应或系统信息。
参数:
- server_name: (必填) 提供资源的 MCP 服务名称
- uri: (必填) 要访问的资源 URI
用法:
<access_mcp_resource>
<server_name>服务名称</server_name>
<uri>资源 URI</uri>
</access_mcp_resource>

示例: 请求访问 MCP 资源

<access_mcp_resource>
<server_name>weather-server</server_name>
<uri>weather://san-francisco/current</uri>
</access_mcp_resource>`
}

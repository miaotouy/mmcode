import { DiffStrategy } from "../../../shared/tools"
import { McpHub } from "../../../services/mcp/McpHub"

export async function getMcpServersSection(
	mcpHub?: McpHub,
	diffStrategy?: DiffStrategy,
	enableMcpServerCreation?: boolean,
	includeToolDescriptions: boolean = true,
): Promise<string> {
	if (!mcpHub) {
		return ""
	}

	const connectedServers =
		mcpHub.getServers().length > 0
			? `${mcpHub
					.getServers()
					.filter((server) => server.status === "connected")
					.map((server) => {
						// Only include tool descriptions when using XML protocol
						const tools = includeToolDescriptions
							? server.tools
									?.filter((tool) => tool.enabledForPrompt !== false)
									?.map((tool) => {
										const schemaStr = tool.inputSchema
											? `    输入模式:
		${JSON.stringify(tool.inputSchema, null, 2).split("\n").join("\n    ")}`
											: ""

										return `- ${tool.name}: ${tool.description}\n${schemaStr}`
									})
									.join("\n\n")
							: undefined

						const templates = server.resourceTemplates
							?.map((template) => `- ${template.uriTemplate} (${template.name}): ${template.description}`)
							.join("\n")

						const resources = server.resources
							?.map((resource) => `- ${resource.uri} (${resource.name}): ${resource.description}`)
							.join("\n")

						const config = JSON.parse(server.config)

						return (
							`## ${server.name}${config.command ? ` (\`${config.command}${config.args && Array.isArray(config.args) ? ` ${config.args.join(" ")}` : ""}\`)` : ""}` +
							(server.instructions ? `\n\n### 指令\n${server.instructions}` : "") +
							(tools ? `\n\n### 可用工具\n${tools}` : "") +
							(templates ? `\n\n### 资源模板\n${templates}` : "") +
							(resources ? `\n\n### 直接资源\n${resources}` : "")
						)
					})
					.join("\n\n")}`
			: "（当前没有已连接的 MCP 服务）"

	// Different instructions based on protocol
	const toolAccessInstructions = includeToolDescriptions
		? `当服务连接后，你可以用 \`use_mcp_tool\` 工具使用服务的工具，用 \`access_mcp_resource\` 工具访问服务的资源。`
		: `当服务连接后，每个服务的工具以命名模式 \`mcp_{服务名称}_{工具名称}\` 作为原生工具提供。例如名为 'weather' 的服务中的 'get_forecast' 工具会以 \`mcp_weather_get_forecast\` 的形式出现。你还可以用 \`access_mcp_resource\` 工具访问服务资源。`

	const baseSection = `MCP 服务

模型上下文协议（MCP）可实现系统与 MCP 服务之间的通信，这些服务提供额外工具和资源来扩展你的能力。MCP 服务可以是以下两种类型之一:

1. 本地（基于 Stdio）服务: 在用户机器上本地运行，通过标准输入/输出通信
2. 远程（基于 SSE）服务: 在远程机器上运行，通过 HTTP/HTTPS 的服务器推送事件（SSE）通信

# 已连接的 MCP 服务

${toolAccessInstructions}

${connectedServers}`

	if (!enableMcpServerCreation) {
		return baseSection
	}

	return (
		baseSection +
		`
## 创建 MCP 服务

用户可能会要求你"添加一个工具"来实现某些功能，也就是创建一个提供可能连接到外部 API 的工具和资源的 MCP 服务。如果是这样，用 fetch_instructions 工具获取详细说明:
<fetch_instructions>
<task>create_mcp_server</task>
</fetch_instructions>`
	)
}

import { ToolProtocol, TOOL_PROTOCOL, isNativeProtocol } from "@roo-code/types"

import { experiments, EXPERIMENT_IDS } from "../../../shared/experiments"

export function getSharedToolUseSection(
	protocol: ToolProtocol = TOOL_PROTOCOL.XML,
	experimentFlags?: Record<string, boolean>,
): string {
	if (isNativeProtocol(protocol)) {
		// Check if multiple native tool calls is enabled via experiment
		const isMultipleNativeToolCallsEnabled = experiments.isEnabled(
			experimentFlags ?? {},
			EXPERIMENT_IDS.MULTIPLE_NATIVE_TOOL_CALLS,
		)

		const toolUseGuidance = isMultipleNativeToolCallsEnabled
			? " 每次助手回复必须至少调用一次工具。建议在单次回复中调用适当数量的工具以减少来回交互，更快完成任务。"
			: " 每次助手回复必须且只能使用一次工具调用。不要在同一个回复中调用零次或多次工具。"

		return `====

工具使用

你有一组工具可在用户批准后执行。使用提供者的原生工具调用机制。不要包含 XML 标记或示例。${toolUseGuidance}`
	}

	return `====

工具使用

你有一组工具可在用户批准后执行。每轮消息必须且只能使用一个工具，每条助手消息必须包含一个工具调用。你逐步使用工具来完成任务，每次工具使用都基于前一次的结果。

# 工具使用格式

工具使用使用 XML 风格的标签进行格式化。工具名称本身成为 XML 标签名。每个参数都包含在自己的标签对中。格式如下:

<实际工具名称>
<参数1名称>值1</参数1名称>
<参数2名称>值2</参数2名称>
...
</实际工具名称>

始终使用实际工具名称作为 XML 标签名以确保正确解析和执行。`
}

import { ToolProtocol, TOOL_PROTOCOL } from "@roo-code/types"
import { isNativeProtocol } from "@roo-code/types"

import { experiments, EXPERIMENT_IDS } from "../../../shared/experiments"

export function getToolUseGuidelinesSection(
	protocol: ToolProtocol = TOOL_PROTOCOL.XML,
	experimentFlags?: Record<string, boolean>,
): string {
	// Build guidelines array with automatic numbering
	let itemNumber = 1
	const guidelinesList: string[] = []

	// First guideline is always the same
	guidelinesList.push(`${itemNumber++}. 评估你已有的信息以及继续任务需要哪些信息。`)

	guidelinesList.push(
		`${itemNumber++}. 根据任务和提供的工具描述选最合适的工具。评估是否需要更多信息才能继续，以及哪些工具对收集这些信息最有效。比如用 list_files 比运行 \`ls\` 更有效。关键是想清楚每个工具，选最适合当前步骤的那个。`,
	)

	// Remaining guidelines - different for native vs XML protocol
	if (isNativeProtocol(protocol)) {
		// Check if multiple native tool calls is enabled via experiment
		const isMultipleNativeToolCallsEnabled = experiments.isEnabled(
			experimentFlags ?? {},
			EXPERIMENT_IDS.MULTIPLE_NATIVE_TOOL_CALLS,
		)

		if (isMultipleNativeToolCallsEnabled) {
			guidelinesList.push(
				`${itemNumber++}. 如果需要多个操作，你可以在适当情况下在单条消息中用多个工具，也可以跨消息迭代使用工具。每次工具使用都应基于前一次的结果。不要假设任何工具使用的结果。每个步骤都必须基于上一步的结果。`,
			)
		} else {
			guidelinesList.push(
				`${itemNumber++}. 如果需要多个操作，每轮消息只能用一个工具来迭代完成，每次工具使用都基于前一次的结果。不要假设任何工具使用的结果。每个步骤都必须基于上一步的结果。`,
			)
		}

		guidelinesList.push(
			`${itemNumber++}. 关键: 你必须使用 API 的原生工具格式。不要只是写描述工具使用的文本（如 "[Tool Use: ...]" 或文本中的 JSON 块）。系统会严格拒绝任何模拟工具调用的文本。你必须用正确的函数调用 API 结构。`,
		)
	} else {
		guidelinesList.push(
			`${itemNumber++}. 如果需要多个操作，每轮消息只能用一个工具来迭代完成，每次工具使用都基于前一次的结果。不要假设任何工具使用的结果。每个步骤都必须基于上一步的结果。`,
		)
	}

	// Protocol-specific guideline - only add for XML protocol
	if (!isNativeProtocol(protocol)) {
		guidelinesList.push(`${itemNumber++}. 使用为每个工具指定的 XML 格式来编写你的工具使用。`)
	}
	guidelinesList.push(`${itemNumber++}. 每次工具使用后，用户会回复该工具使用的结果。结果会告诉你继续任务或做决策所需的信息。回复可能包括:
	 - 工具成功或失败的信息及其原因。
	 - 因你的更改而产生的 lint 错误，你需要处理。
	 - 对更改产生的新终端输出，你可能需要考虑或据此采取行动。
	 - 与工具使用相关的任何其他反馈或信息。`)

	// Only add the "wait for confirmation" guideline for XML protocol
	// Native protocol allows multiple tools per message, so waiting after each tool doesn't apply
	if (!isNativeProtocol(protocol)) {
		guidelinesList.push(
			`${itemNumber++}. 在继续之前，**始终**等待用户确认每次工具使用。没有用户明确确认结果的情况下，永远不要假设工具使用成功。`,
		)
	}

	// Join guidelines and add the footer
	// For native protocol, the footer is less relevant since multiple tools can execute in one message
	const footer = isNativeProtocol(protocol)
		? `\n\n通过仔细考虑工具执行后用户的回复，你可以相应地做出反应，做出明智的决策来推进任务。这种迭代过程有助于确保工作的整体成功和准确性。`
		: `\n\n逐步进行，每次工具使用后等待用户的消息再继续前进，这一点至关重要。这种方法让你可以:
1. 在继续前确认每个步骤的成功。
2. 立即处理出现的任何问题或错误。
3. 根据新信息或意外结果调整方法。
4. 确保每个步骤都能正确建立在先前步骤的基础上。

通过在每次工具使用后等待并仔细考虑用户的回复，你可以相应地做出反应，做出明智的决策来推进任务。这种迭代过程有助于确保工作的整体成功和准确性。`

	return `# 工具使用指南

${guidelinesList.join("\n")}${footer}`
}

import * as vscode from "vscode"

import type { ModeConfig } from "@roo-code/types"

import { getAllModesWithPrompts } from "../../../shared/modes"
import { ensureSettingsDirectoryExists } from "../../../utils/globalContext"

export async function getModesSection(
	context: vscode.ExtensionContext,
	skipXmlExamples: boolean = false,
): Promise<string> {
	// Make sure path gets created
	await ensureSettingsDirectoryExists(context)

	// Get all modes with their overrides from extension state
	const allModes = await getAllModesWithPrompts(context)

	let modesContent = `====

模式

- 以下是当前可用的模式:
${allModes
	.map((mode: ModeConfig) => {
		let description: string
		if (mode.whenToUse && mode.whenToUse.trim() !== "") {
			// Use whenToUse as the primary description, indenting subsequent lines for readability
			description = mode.whenToUse.replace(/\n/g, "\n    ")
		} else {
			// Fallback to the first sentence of roleDefinition if whenToUse is not available
			description = mode.roleDefinition.split(".")[0]
		}
		return `  * "${mode.name}" mode (${mode.slug}) - ${description}`
	})
	.join("\n")}`

	if (!skipXmlExamples) {
		modesContent += `
如果用户要求你为此项目创建或编辑新模式，用 fetch_instructions 工具获取说明:
<fetch_instructions>
<task>create_mode</task>
</fetch_instructions>
`
	} else {
		modesContent += `
如果用户要求你为此项目创建或编辑新模式，用 fetch_instructions 工具获取说明。
`
	}

	return modesContent
}

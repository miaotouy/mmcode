// kilocode_change - new file
import type { ToolParamName } from "../../shared/tools"

const CDATA_WRAPPER_PATTERN = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/

export function normalizeToolParamValue(paramName: ToolParamName, value: string): string {
	const unwrappedValue = value.match(CDATA_WRAPPER_PATTERN)?.[1] ?? value

	if (paramName === "content") {
		return unwrappedValue.replace(/^\n/, "").replace(/\n$/, "")
	}

	return unwrappedValue.trim()
}

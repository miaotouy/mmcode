// kilocode_change start
import { getSupportedBinaryFormats } from "../../../integrations/misc/extract-text"
import { SUPPORTED_IMAGE_FORMATS } from "../../tools/helpers/imageHelpers"
// kilocode_change end

import { ToolArgs } from "./types"

export function getReadFileDescription(args: ToolArgs): string {
	const maxConcurrentReads = args.settings?.maxConcurrentFileReads ?? 5
	const isMultipleReadsEnabled = maxConcurrentReads > 1
	const supportsImages = args.supportsComputerUse // kilocode_change: supportsComputerUse==supportsImages in kilo

	return `## read_file
描述: 请求读取${isMultipleReadsEnabled ? "一个或多个文件" : "文件"}的内容。该工具输出带行号的内容（如 "1 | const x = 1"），便于在创建差异更新或讨论代码时参考。${args.partialReadsEnabled ? " 使用行范围可以高效读取大文件的特定部分。" : ""}支持从 ${
		getSupportedBinaryFormats()
			.concat(supportsImages ? SUPPORTED_IMAGE_FORMATS : [])
			.join("、") /*kilocode_change*/
	} 文件中提取文本，但可能无法正确处理其他二进制文件。

${isMultipleReadsEnabled ? `**重要提示: 单次请求最多可读取 ${maxConcurrentReads} 个文件。** 如果需要读取更多文件，请使用多次连续的 read_file 请求。` : "**重要提示: 当前已禁用多文件读取。每次只能读取一个文件。**"}

${args.partialReadsEnabled ? `通过指定行范围，您可以高效地读取大文件的特定部分，无需将整个文件加载到内存中。` : ""}
参数:
- args: 包含一个或多个 file 元素，每个 file 包含:
  - path: (必填) 文件路径（相对于工作目录 ${args.cwd}）
  ${args.partialReadsEnabled ? `- line_range: (可选) 行范围，格式为 "start-end"（从1开始，包含两端）` : ""}

用法:
<read_file>
<args>
  <file>
    <path>path/to/file</path>
    ${args.partialReadsEnabled ? `<line_range>start-end</line_range>` : ""}
  </file>
</args>
</read_file>

示例:

1. 读取单个文件:
<read_file>
<args>
  <file>
    <path>src/app.ts</path>
    ${args.partialReadsEnabled ? `<line_range>1-1000</line_range>` : ""}
  </file>
</args>
</read_file>

${isMultipleReadsEnabled ? `2. 读取多个文件（不超过 ${maxConcurrentReads} 个文件限制）:` : ""}${
		isMultipleReadsEnabled
			? `
<read_file>
<args>
  <file>
    <path>src/app.ts</path>
    ${
		args.partialReadsEnabled
			? `<line_range>1-50</line_range>
    <line_range>100-150</line_range>`
			: ""
	}
  </file>
  <file>
    <path>src/utils.ts</path>
    ${args.partialReadsEnabled ? `<line_range>10-20</line_range>` : ""}
  </file>
</args>
</read_file>`
			: ""
	}

${isMultipleReadsEnabled ? "3. " : "2. "}读取整个文件:
<read_file>
<args>
  <file>
    <path>config.json</path>
  </file>
</args>
</read_file>

重要提示: 必须使用以下高效读取策略:
- ${isMultipleReadsEnabled ? `必须将所有相关文件和实现放在一次操作中读取（最多 ${maxConcurrentReads} 个文件）` : "每次只能读取一个文件，因为多文件读取当前已禁用"}
- 在进行更改前必须先获取所有必要的上下文
${
	args.partialReadsEnabled
		? `- 必须使用行范围读取大文件的特定部分，而不是在不必要时读取整个文件
- 相邻行范围（<10行间隔）必须合并
- 间隔超过10行的内容必须使用多个范围
- 在保持范围最小的同时，必须为计划修改包含足够的行上下文
`
		: ""
}
${isMultipleReadsEnabled ? `- 当需要读取超过 ${maxConcurrentReads} 个文件时，先优先读取最关键的文件，再通过后续 read_file 请求读取其他文件` : ""}`
}

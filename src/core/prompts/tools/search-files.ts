import { ToolArgs } from "./types"

export function getSearchFilesDescription(args: ToolArgs): string {
	return `## search_files
描述: 在指定目录中执行正则搜索，返回带上下文的结果。跨文件搜索模式或特定内容，显示每个匹配及其周围上下文。
精心设计正则表达式以平衡特异性和灵活性。用此工具找代码模式、TODO 注释、函数定义或项目中任何基于文本的信息。结果包含周围上下文，分析周围代码能更好理解匹配。可与其他工具结合做更全面分析——比如先用它找特定代码模式，再用 read_file 检查有趣匹配的完整上下文。

参数:
- path: (必填) 要搜索的目录路径（相对于当前工作目录 ${args.cwd}）。将递归搜索此目录。
- regex: (必填) 要搜索的正则表达式模式。使用 Rust 正则表达式语法。
- file_pattern: (可选) 用于过滤文件的 Glob 模式（如 '*.ts' 表示 TypeScript 文件）。如果未提供，将搜索所有文件 (*)。

用法:
<search_files>
<path>目录路径</path>
<regex>正则表达式模式</regex>
<file_pattern>文件模式（可选）</file_pattern>
</search_files>

示例: 搜索当前目录中的所有 .ts 文件
<search_files>
<path>.</path>
<regex>.*</regex>
<file_pattern>*.ts</file_pattern>
</search_files>

示例: 在 JavaScript 文件中搜索函数定义
<search_files>
<path>src</path>
<regex>function\\s+\\w+</regex>
<file_pattern>*.js</file_pattern>
</search_files>`
}

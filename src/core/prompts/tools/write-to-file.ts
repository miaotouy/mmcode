import { ToolArgs } from "./types"

export function getWriteToFileDescription(args: ToolArgs): string {
	return `## write_to_file
描述: 将内容写入文件。主要用于**创建新文件**或**有意完全重写已有文件**。文件已存在则覆盖，不存在则创建。会自动创建写入所需的目录。

**重要提示:** 改已有文件时优先用其他编辑工具而非 write_to_file，因为 write_to_file 慢且不能处理大文件。主要用于创建新文件。

用此工具时直接写内容就行，不用先展示。**必须**在回复中提供**完整的**文件内容。**没商量。** 部分更新或占位符（如 '// rest of code unchanged'）**严格禁止**。没改的部分也**必须**全写上。否则代码会不完整或出问题。

创建新项目时，除非用户另有指定，否则把所有新文件放在专用项目目录里。按所创建项目类型的最佳实践组织。

参数:
- path: (必填) 文件路径（相对于当前工作目录 ${args.cwd}）
- content: (必填) 要写入的内容。**必须**提供文件的**完整**内容，不截断或省略。没改的部分也**必须**全写上。不要包含行号。

用法:
<write_to_file>
<path>文件路径</path>
<content>
文件内容
</content>
</write_to_file>

示例: 写入配置文件
<write_to_file>
<path>frontend-config.json</path>
<content>
{
  "apiEndpoint": "https://api.example.com",
  "theme": {
    "primaryColor": "#007bff",
    "secondaryColor": "#6c757d",
    "fontFamily": "Arial, sans-serif"
  },
  "features": {
    "darkMode": true,
    "notifications": true,
    "analytics": false
  },
  "version": "1.0.0"
}
</content>
</write_to_file>`
}

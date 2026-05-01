// kilocode_change - file added

import { ToolArgs } from "./types"

export function getDeleteFileDescription(args: ToolArgs): string {
	return `## delete_file

描述: 从工作空间删除文件或目录。是 rm 命令的安全替代方案，全平台支持。

**参数:**
- path (必填): 要删除的文件或目录路径（相对于工作目录 ${args.cwd}）

**用法:**
<delete_file>
<path>path/to/file.txt</path>
</delete_file>

**安全特性:**
- 只在工作空间内删除文件/目录
- 删除前需要用户确认
- 阻止删写保护的文件
- 按 .kilocodeignore 规则验证所有文件
- 对目录：递归扫描并在删除前显示统计信息（文件数、目录数、总大小）
- 如果包含受保护或被忽略的文件，阻止删除目录

**示例:**

删除单个文件:
\`\`\`xml
<delete_file>
<path>temp/old_file.txt</path>
</delete_file>
\`\`\`

删除目录（需批准并显示统计）:
\`\`\`xml
<delete_file>
<path>old_project/</path>
</delete_file>
\`\`\`
`
}

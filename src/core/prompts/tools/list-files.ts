import { ToolArgs } from "./types"

export function getListFilesDescription(args: ToolArgs): string {
	return `## list_files
描述: 列出指定目录中的文件和子目录。recursive 为 true 时递归列出所有文件和目录，false 或未提供时只列出顶层。不要用此工具确认你刚创建的文件是否存在——用户会告诉你是否创建成功。
参数:
- path: (必填) 要列出内容的目录路径（相对于当前工作目录 ${args.cwd}）
- recursive: (可选) 是否递归列出。true 递归，false 或省略只列顶层。
用法:
<list_files>
<path>目录路径</path>
<recursive>true 或 false（可选）</recursive>
</list_files>

示例: 列出当前目录的所有文件
<list_files>
<path>.</path>
<recursive>false</recursive>
</list_files>`
}

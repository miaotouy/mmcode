import { ToolArgs } from "./types"

export function getCodebaseSearchDescription(args: ToolArgs): string {
	return `## codebase_search
描述: 用语义搜索查找跟查询最相关的文件。基于含义而不是精确文本匹配。默认搜整个工作空间。除非有明确理由不这么做，否则直接复用用户的原文——用户的措辞通常有助于语义搜索。查询**必须**用英文（需要的话先翻译）。

**关键: 对于本次对话中你还没检查过的任何代码探索，必须先使用此工具，然后才能用其他搜索或文件探索工具。** 这适用于整个对话过程，不止是开始阶段。此工具用语义搜索根据含义而非关键词找相关代码，在理解实现方面远比基于正则的 search_files 更有效。即使你已经探索过哪些代码，任何新探索领域都要先过 codebase_search。

参数:
- query: (必填) 搜索查询。除非有明确理由不这么做，否则直接复用用户的原文/问题格式。
- path: (可选) 限制搜索到特定子目录（相对于当前工作目录 ${args.cwd}）。留空表示搜整个工作空间。

用法:
<codebase_search>
<query>自然语言查询</query>
<path>可选的子目录路径</path>
</codebase_search>

示例: 搜索用户认证代码
<codebase_search>
<query>用户登录和密码哈希</query>
<path>src/auth</path>
</codebase_search>

示例: 搜索整个工作空间
<codebase_search>
<query>数据库连接池</query>
<path></path>
</codebase_search>
`
}

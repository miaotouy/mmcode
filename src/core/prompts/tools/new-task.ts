import { ToolArgs } from "./types"

/**
 * Prompt when todos are NOT required (default)
 */
const PROMPT_WITHOUT_TODOS = `## new_task
描述: 用提供的消息在选定模式下创建新的任务实例。

参数:
- mode: (必填) 要启动新任务的模式标识（如 "code"、"debug"、"architect"）。
- message: (必填) 此新任务的初始用户消息或指令。

用法:
<new_task>
<mode>模式标识</mode>
<message>初始指令</message>
</new_task>

示例:
<new_task>
<mode>code</mode>
<message>为应用程序实现新功能</message>
</new_task>
`

/**
 * Prompt when todos ARE required
 */
const PROMPT_WITH_TODOS = `## new_task
描述: 用提供的消息和初始待办列表在选定模式下创建新的任务实例。

参数:
- mode: (必填) 要启动新任务的模式标识（如 "code"、"debug"、"architect"）。
- message: (必填) 此新任务的初始用户消息或指令。
- todos: (必填) 新任务的 Markdown 待办列表格式的初始待办事项。

用法:
<new_task>
<mode>模式标识</mode>
<message>初始指令</message>
<todos>
[ ] 第一个待办任务
[ ] 第二个待办任务
[ ] 第三个待办任务
</todos>
</new_task>

示例:
<new_task>
<mode>code</mode>
<message>实现用户认证</message>
<todos>
[ ] 设置认证中间件
[ ] 创建登录接口
[ ] 添加会话管理
[ ] 编写测试
</todos>
</new_task>

`

export function getNewTaskDescription(args: ToolArgs): string {
	const todosRequired = args.settings?.newTaskRequireTodos === true

	// Simply return the appropriate prompt based on the setting
	return todosRequired ? PROMPT_WITH_TODOS : PROMPT_WITHOUT_TODOS
}

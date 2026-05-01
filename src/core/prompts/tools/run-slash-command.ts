/**
 * Generates the run_slash_command tool description.
 */
export function getRunSlashCommandDescription(): string {
	return `## run_slash_command
描述: 执行斜杠命令以获取特定指令或内容。斜杠命令是预定义的模板，为常见任务提供详细指导。

参数:
- command: (必填) 要执行的斜杠命令名称（如 "init"、"test"、"deploy"）
- args: (可选) 传递给命令的附加参数或上下文

用法:
<run_slash_command>
<command>命令名称</command>
<args>可选参数</args>
</run_slash_command>

示例:

1. 运行 init 命令分析代码库:
<run_slash_command>
<command>init</command>
</run_slash_command>

2. 运行带有附加上下文的命令:
<run_slash_command>
<command>test</command>
<args>关注集成测试</args>
</run_slash_command>

命令内容会返回给你执行或作为指令遵循。`
}

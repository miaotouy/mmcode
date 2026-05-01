import { ToolArgs } from "./types"

export function getExecuteCommandDescription(args: ToolArgs): string | undefined {
	return `## execute_command
描述: 在系统上执行 CLI 命令。需要执行系统操作或运行特定命令来完成任务时使用。必须根据用户系统调整命令，并清晰说明命令的作用。命令链调用时，用适合用户终端的链式语法。优先用复杂的 CLI 命令而不是写可执行脚本——它们更灵活、更好跑。优先用避免位置敏感的相对命令和路径以保证终端一致性，比如: \`touch ./testdata/example.file\`、\`dir ./examples/model1/data/yaml\` 或 \`go test ./cmd/front --config ./cmd/front/config.yml\`。如果用户指示，可通过 \`cwd\` 参数在不同目录开终端。
参数:
- command: (必填) 要执行的 CLI 命令。必须在当前操作系统上有效。确保格式正确且不含任何有害指令。
- cwd: (可选) 执行命令的工作目录（默认: ${args.cwd}）
用法:
<execute_command>
<command>命令</command>
<cwd>工作目录路径（可选）</cwd>
</execute_command>

示例: 执行 npm run dev
<execute_command>
<command>npm run dev</command>
</execute_command>

示例: 在指定目录执行 ls
<execute_command>
<command>ls -la</command>
<cwd>/home/user/projects</cwd>
</execute_command>`
}

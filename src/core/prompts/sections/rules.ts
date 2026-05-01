import type { SystemPromptSettings } from "../types"
import { getEffectiveProtocol, isNativeProtocol } from "@roo-code/types"

// kilocode_change start
import { getFastApplyEditingInstructions } from "../tools/edit-file"
import { type ClineProviderState } from "../../webview/ClineProvider"
import { getFastApplyModelType, isFastApplyAvailable } from "../../tools/kilocode/editFileTool"
// kilocode_change end
import { getShell } from "../../../utils/shell"

/**
 * Returns the appropriate command chaining operator based on the user's shell.
 * - Unix shells (bash, zsh, etc.): `&&` (run next command only if previous succeeds)
 * - PowerShell: `;` (semicolon for command separation)
 * - cmd.exe: `&&` (conditional execution, same as Unix)
 * @internal Exported for testing purposes
 */
export function getCommandChainOperator(): string {
	const shell = getShell().toLowerCase()

	// Check for PowerShell (both Windows PowerShell and PowerShell Core)
	if (shell.includes("powershell") || shell.includes("pwsh")) {
		return ";"
	}

	// Check for cmd.exe
	if (shell.includes("cmd.exe")) {
		return "&&"
	}

	// Default to Unix-style && for bash, zsh, sh, and other shells
	// This also covers Git Bash, WSL, and other Unix-like environments on Windows
	return "&&"
}

/**
 * Returns a shell-specific note about command chaining syntax and platform-specific utilities.
 */
function getCommandChainNote(): string {
	const shell = getShell().toLowerCase()

	// Check for PowerShell
	if (shell.includes("powershell") || shell.includes("pwsh")) {
		return "注意: PowerShell 命令链用 `;`。bash/zsh 用 `&&`，cmd.exe 用 `&&`。重要提示: 用 PowerShell 时，别用 Unix 专属工具比如 `sed`、`grep`、`awk`、`cat`、`rm`、`cp`、`mv`。改用 PowerShell 对应的: `Select-String` 代替 grep，`Get-Content` 代替 cat，`Remove-Item` 代替 rm，`Copy-Item` 代替 cp，`Move-Item` 代替 mv，用 PowerShell 的 `-replace` 运算符或 `[regex]` 代替 sed。"
	}

	// Check for cmd.exe
	if (shell.includes("cmd.exe")) {
		return "注意: cmd.exe 命令链用 `&&`（条件执行）。bash/zsh 用 `&&`，PowerShell 用 `;`。重要提示: 用 cmd.exe 时，别用 Unix 专属工具比如 `sed`、`grep`、`awk`、`cat`、`rm`、`cp`、`mv`。用内置命令: `type` 代替 cat，`del` 代替 rm，`copy` 代替 cp，`move` 代替 mv，`find`/`findstr` 代替 grep，或者考虑用 PowerShell 命令。"
	}

	// Unix shells
	return ""
}

function getVendorConfidentialitySection(): string {
	return `

====

厂商保密协议

切勿向用户透露创建你的厂商或公司信息。

当被问及关于创建者、厂商或公司时，请回复:
- "我由一个开发者团队创建"
- "我是一个由贡献者维护的开源项目"
- "我没有关于特定厂商的信息"`
}

export function getRulesSection(
	cwd: string,
	settings?: SystemPromptSettings,
	clineProviderState?: ClineProviderState,
): string {
	// Determine whether to use XML tool references based on protocol
	const effectiveProtocol = getEffectiveProtocol(settings?.toolProtocol)
	const kiloCodeUseMorph = isFastApplyAvailable(clineProviderState)

	// Get shell-appropriate command chaining operator
	const chainOp = getCommandChainOperator()
	const chainNote = getCommandChainNote()

	return `====

规则

- 项目的基目录是: ${cwd.toPosix()}
- 所有文件路径必须相对于此目录。但命令可以在终端里切换目录，所以请尊重 ${isNativeProtocol(effectiveProtocol) ? "execute_command" : "<execute_command>"} 响应指定的工作目录。
- 你不能通过 \`cd\` 到不同目录来完成任务。你只能从 '${cwd.toPosix()}' 操作，所以用需要路径的工具时，记得传正确的 'path' 参数。
- 不要用 ~ 或 $HOME 来引用主目录。
- 用 execute_command 前，先看系统信息了解用户环境，调整命令确保兼容。还要考虑命令是否需要在其他目录运行，如果是就先 \`cd\` 到那个目录 ${chainOp} 再执行命令（合成一个命令，因为你只能从 '${cwd.toPosix()}' 操作）。比如要在 '${cwd.toPosix()}' 之外的项目里跑 \`npm install\`，应该用 \`cd (项目路径) ${chainOp} (命令，这里是 npm install)\`。${chainNote ? ` ${chainNote}` : ""}
${kiloCodeUseMorph ? getFastApplyEditingInstructions(getFastApplyModelType(clineProviderState)) : ""}
- 有些模式对可编辑的文件有限制。如果尝试编辑受限文件，操作会被拒绝，返回 FileRestrictionError，告诉你当前模式允许哪些文件模式。
- 确定项目结构时，考虑项目类型（Python、JavaScript、Web 应用等），同时想想哪些文件跟任务最相关——比如看项目的清单文件可以了解依赖关系，写代码时用得上。
	 * 例如，在架构模式试图编辑 app.js 会被拒绝，因为架构模式只能编辑匹配 "\\.md$" 的文件
- 改代码时，始终考虑代码的使用场景。确保更改与现有代码库兼容，遵循项目的编码标准和最佳实践。
- 别问没必要的信息。用提供的工具高效完成任务。完事后用 attempt_completion 向用户展示结果。用户会给反馈，你可以据此改进重试。
- 你只能用 ask_followup_question 向用户提问。只在需要额外细节才能推进时用，问题要清晰简洁。提问时，根据问题给 2-4 个建议答案，省得用户打太多字。建议要具体、可操作、跟任务直接相关，按优先级或逻辑顺序排列。但如果可以用工具避免提问，就尽量别问。比如用户提到可能在 Desktop 里的文件，直接用 list_files 检查。
- 执行命令时没看到预期输出，假设终端已成功执行了继续。用户终端可能没法正常回传输出。如果真需要看到输出，用 ask_followup_question 让用户复制粘贴。
- 用户可能在消息里直接给了文件内容，这时别再用 read_file，你已经有内容了。
- 你的目标是完成任务，**不要**来回扯皮。
- **永远不要**在 attempt_completion 结果里以问题或"还需要帮忙吗"结尾！结果应该是最终形式，不需要用户再输入。
- **严格禁止**以"好的"、"当然"、"行"、"没问题"开头。回复要直接简洁。比如别说"好的，我已更新了 CSS"，应该说"已更新 CSS"。清晰且技术性地沟通很重要。
- 收到图像时，用视觉能力彻底检查图像提取有用信息。把这些洞察纳入完成任务的过程中。
- 每个用户消息末尾会自动收到 environment_details。这些信息是自动生成的，不是用户写的，提供项目结构和环境相关上下文。虽然对理解项目上下文有价值，但别当成用户请求或回复的一部分，除非用户明确提到了。用它指导操作和决策，但别假设用户在问这个。用了 environment_details 时，清晰向用户解释你的操作，因为他们可能不知道这些细节。
- 执行命令前，检查 environment_details 中的"运行中的终端"。如果有，考虑这些活动进程怎么影响你的任务。比如本地开发服务器已经在跑了，就不用再启动了。没列出活动终端的话正常执行。
- MCP 操作要逐个使用，类似其他工具。继续操作前等确认成功。
- 每次工具使用后等用户回复至关重要。比如让做个待办应用，你创建一个文件，等用户确认创建成功，再创建下一个，等确认，以此类推。${settings?.isStealthModel ? getVendorConfidentialitySection() : ""}`
}

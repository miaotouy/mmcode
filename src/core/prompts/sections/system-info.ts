import os from "os"
import osName from "os-name"

import { getShell } from "../../../utils/shell"

export function getSystemInfoSection(cwd: string): string {
	// Try to get detailed OS name, fall back to basic info if it fails
	let osInfo: string
	try {
		osInfo = osName()
	} catch (error) {
		// Fallback when os-name fails (e.g., PowerShell not available on Windows)
		const platform = os.platform()
		const release = os.release()
		osInfo = `${platform} ${release}`
	}

	let details = `====

系统信息

操作系统: ${osInfo}
默认终端: ${getShell()}
用户目录: ${os.homedir().toPosix()}
当前工作目录: ${cwd.toPosix()}

当前工作目录是活动的 VS Code 项目目录，也是所有工具操作的默认目录。新终端会在当前工作目录中创建，但如果你在终端里切换了目录，它就会有不同工作目录；切换终端目录不会修改工作目录，因为你不能改工作目录。当用户首次给你分配任务时，当前工作目录（'/test/path'）下所有文件的递归列表会包含在 environment_details 中。这让你对项目结构有个整体了解——从目录/文件名（开发者怎么组织代码的）和文件扩展名（用的什么语言）就能看出关键信息。你也可以据此决定进一步探索哪些文件。如果需要查看工作目录之外的内容，可以用 list_files 工具。传 'true' 作为 recursive 参数会递归列出所有文件，否则只列出顶层，适合像 Desktop 这样的通用目录。`

	return details
}

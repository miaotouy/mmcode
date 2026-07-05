import path from "path"
import fs from "fs/promises"

import { Task } from "../../task/Task"
import { ClineSayTool } from "../../../shared/ExtensionMessage"
import { formatResponse } from "../../prompts/responses"
import { getReadablePath } from "../../../utils/path"
import { isPathOutsideWorkspace } from "../../../utils/pathUtils"
import { ToolUse, AskApproval, HandleError, PushToolResult, RemoveClosingTag } from "../../../shared/tools"

interface DirectoryStats {
	totalFiles: number
	totalDirs: number
	totalSize: number
}

class DirectoryDeletionBlockedError extends Error {
	constructor(
		public reason: string,
		public blockingFile: string,
	) {
		super(reason)
		this.name = "DirectoryDeletionBlockedError"
	}
}

/**
 * Scans a directory recursively to gather statistics and check for protected files
 * Throws DirectoryDeletionBlockedError immediately when a blocking issue is found
 */
async function scanDirectoryForDeletion(absolutePath: string, cline: Task): Promise<DirectoryStats> {
	const stats: DirectoryStats = {
		totalFiles: 0,
		totalDirs: 0,
		totalSize: 0,
	}

	async function scanRecursive(dirPath: string): Promise<void> {
		const entries = await fs.readdir(dirPath, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(dirPath, entry.name)
			const relativePath = path.relative(cline.cwd, fullPath)

			if (entry.isDirectory() && !entry.isSymbolicLink()) {
				stats.totalDirs++
				await scanRecursive(fullPath)
			} else if (entry.isFile() && !entry.isSymbolicLink()) {
				stats.totalFiles++

				// Check protection - FAIL FAST
				if (cline.rooProtectedController?.isWriteProtected(relativePath)) {
					throw new DirectoryDeletionBlockedError(
						`Cannot delete directory - contains protected file: ${relativePath}`,
						relativePath,
					)
				}

				// Check ignore rules - FAIL FAST
				if (!cline.rooIgnoreController?.validateAccess(relativePath)) {
					throw new DirectoryDeletionBlockedError(
						`Cannot delete directory - contains file blocked by .kilocodeignore: ${relativePath}`,
						relativePath,
					)
				}

				// Accumulate size
				try {
					const fileStats = await fs.stat(fullPath)
					stats.totalSize += fileStats.size
				} catch {
					throw new DirectoryDeletionBlockedError(
						`Cannot access file for deletion: ${relativePath}`,
						relativePath,
					)
				}
			}
		}
	}

	await scanRecursive(absolutePath)
	return stats
}

/**
 * Validates a single path for deletion: existence, access, protection, workspace boundary.
 * Returns the absolute path and stats if valid, or pushes an error result and returns null.
 */
async function validatePathForDeletion(
	cline: Task,
	relPath: string,
	pushToolResult: PushToolResult,
): Promise<{ absolutePath: string; relativePath: string; stats: Awaited<ReturnType<typeof fs.stat>> } | null> {
	const absolutePath = path.resolve(cline.cwd, relPath)
	const relativePath = path.relative(cline.cwd, absolutePath)

	let stats
	try {
		stats = await fs.stat(absolutePath)
	} catch {
		cline.consecutiveMistakeCount++
		cline.recordToolError("delete_file")
		const errorMsg = `File or directory does not exist: ${relativePath}`
		cline.say("error", errorMsg)
		pushToolResult(formatResponse.toolError(errorMsg))
		return null
	}

	// Validate access
	const accessAllowed = cline.rooIgnoreController?.validateAccess(relativePath)
	if (!accessAllowed) {
		cline.consecutiveMistakeCount++
		cline.recordToolError("delete_file")
		const errorMsg = formatResponse.rooIgnoreError(relativePath)
		cline.say("error", errorMsg)
		pushToolResult(formatResponse.toolError(errorMsg))
		return null
	}

	// Check if file is write-protected
	const isWriteProtected = cline.rooProtectedController?.isWriteProtected(relativePath) || false
	if (isWriteProtected) {
		cline.consecutiveMistakeCount++
		cline.recordToolError("delete_file")
		const errorMsg = `Cannot delete write-protected file: ${relativePath}`
		cline.say("error", errorMsg)
		pushToolResult(formatResponse.toolError(errorMsg))
		return null
	}

	// Check workspace boundary
	if (isPathOutsideWorkspace(absolutePath)) {
		cline.consecutiveMistakeCount++
		cline.recordToolError("delete_file")
		const errorMsg = `Cannot delete files outside workspace. Path: ${relativePath}`
		cline.say("error", errorMsg)
		pushToolResult(formatResponse.toolError(errorMsg))
		return null
	}

	return { absolutePath, relativePath, stats }
}

/**
 * Implements the delete_file tool.
 * Supports multiple paths via `paths` param (comma-separated).
 */

export async function deleteFileTool(
	cline: Task,
	block: ToolUse,
	askApproval: AskApproval,
	handleError: HandleError,
	pushToolResult: PushToolResult,
	removeClosingTag: RemoveClosingTag,
) {
	// Wait for the final path
	if (block.partial) {
		return
	}

	const pathsRaw = block.params.paths
	if (!pathsRaw) {
		cline.consecutiveMistakeCount++
		cline.recordToolError("delete_file")
		pushToolResult(await cline.sayAndCreateMissingParamError("delete_file", "paths"))
		return
	}

	const relPaths = pathsRaw
		.split(",")
		.map((p: string) => p.trim())
		.filter((p: string) => p.length > 0)

	if (relPaths.length === 0) {
		cline.consecutiveMistakeCount++
		cline.recordToolError("delete_file")
		pushToolResult(await cline.sayAndCreateMissingParamError("delete_file", "paths"))
		return
	}

	try {
		// Phase 1: Validate all paths first (fail-fast on any validation error)
		const validated: Array<{
			absolutePath: string
			relativePath: string
			relPath: string
			stats: Awaited<ReturnType<typeof fs.stat>>
		}> = []

		for (const relPath of relPaths) {
			const result = await validatePathForDeletion(cline, relPath, pushToolResult)
			if (!result) {
				return // Error already pushed by validatePathForDeletion
			}
			validated.push({ ...result, relPath })
		}

		// Phase 2: Gather statistics for all validated paths
		let totalFiles = 0
		let totalDirs = 0
		let totalSize = 0

		for (const { absolutePath, relativePath, stats } of validated) {
			try {
				if (stats.isDirectory()) {
					const dirStats = await scanDirectoryForDeletion(absolutePath, cline)
					totalFiles += dirStats.totalFiles
					totalDirs += dirStats.totalDirs + 1 // Include the directory itself
					totalSize += dirStats.totalSize
				} else {
					totalFiles += 1
					totalSize += Number(stats.size)
				}
			} catch (error: any) {
				if (error instanceof DirectoryDeletionBlockedError) {
					cline.consecutiveMistakeCount++
					cline.recordToolError("delete_file")
					await cline.say("error", error.reason)
					pushToolResult(formatResponse.toolError(error.reason))
					return
				}
				throw error
			}
		}

		// Phase 3: Ask for approval once for all paths
		cline.consecutiveMistakeCount = 0
		const approvalMessage = JSON.stringify({
			tool: "deleteFile",
			paths: validated.map((v) => getReadablePath(cline.cwd, v.relPath)),
			stats: {
				files: totalFiles,
				directories: totalDirs,
				size: totalSize,
				isComplete: true,
			},
			isOutsideWorkspace: false,
		})

		const didApprove = await askApproval("tool", approvalMessage)
		if (!didApprove) {
			pushToolResult(formatResponse.toolResult("Skipped: Deletion denied by user"))
			return
		}

		// Phase 4: Execute all deletions
		const results: string[] = []
		let hasFailed = false

		for (const { absolutePath, relativePath, stats } of validated) {
			try {
				if (stats.isDirectory()) {
					await fs.rm(absolutePath, { recursive: true, force: false })
					results.push(`Deleted directory: ${relativePath}`)
				} else {
					await fs.unlink(absolutePath)
					results.push(`Deleted file: ${relativePath}`)
				}
			} catch (error: any) {
				if (validated.length === 1) {
					throw error
				}

				hasFailed = true
				cline.consecutiveMistakeCount++
				cline.recordToolError("delete_file")

				const errorMsg = `Failed to delete ${relativePath}: ${error.message || String(error)}`
				await cline.say("error", errorMsg)
				results.push(`Error: ${errorMsg}`)
			}
		}

		if (hasFailed) {
			pushToolResult(formatResponse.toolResult(`Some deletions failed:\n${results.join("\n")}`))
		} else {
			cline.consecutiveMistakeCount = 0
			pushToolResult(formatResponse.toolResult(results.join("\n")))
		}
	} catch (error) {
		await handleError("deleting file", error)
	}
}

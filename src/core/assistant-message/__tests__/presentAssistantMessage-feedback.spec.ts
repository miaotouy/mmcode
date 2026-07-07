// npx vitest src/core/assistant-message/__tests__/presentAssistantMessage-feedback.spec.ts

import { describe, it, expect, beforeEach, vi } from "vitest"
import { presentAssistantMessage } from "../presentAssistantMessage"

// Mock dependencies
vi.mock("../../task/Task")
vi.mock("../../tools/validateToolUse", () => ({
	validateToolUse: vi.fn(),
}))
vi.mock("@roo-code/telemetry", () => ({
	TelemetryService: {
		instance: {
			captureToolUsage: vi.fn(),
			captureConsecutiveMistakeError: vi.fn(),
			captureEvent: vi.fn(), // kilocode_change: add mock for captureEvent
		},
	},
}))

// Mock the tools so we can trigger an error after asking for approval
vi.mock("../../tools/ReadFileTool", () => ({
	readFileTool: {
		handle: vi.fn().mockImplementation(async (cline, block, callbacks) => {
			// 1. Ask for approval first to populate approvalFeedback
			await callbacks.askApproval("tool", "mock message")
			// 2. Simulate an error during tool execution
			return callbacks.handleError("reading file", new Error("Mock read file error"))
		}),
		getReadFileToolDescription: vi.fn().mockReturnValue("[read_file]"),
	},
}))

describe("presentAssistantMessage - Feedback Preservation on Error", () => {
	let mockTask: any

	beforeEach(() => {
		mockTask = {
			taskId: "test-task-id",
			instanceId: "test-instance",
			abort: false,
			presentAssistantMessageLocked: false,
			presentAssistantMessageHasPendingUpdates: false,
			currentStreamingContentIndex: 0,
			assistantMessageContent: [],
			userMessageContent: [],
			didCompleteReadingStream: false,
			didRejectTool: false,
			didAlreadyUseTool: false,
			diffEnabled: false,
			consecutiveMistakeCount: 0,
			clineMessages: [],
			api: {
				getModel: () => ({ id: "test-model", info: {} }),
			},
			browserSession: {
				closeBrowser: vi.fn().mockResolvedValue(undefined),
			},
			recordToolUsage: vi.fn(),
			recordToolError: vi.fn(),
			toolRepetitionDetector: {
				check: vi.fn().mockReturnValue({ allowExecution: true }),
			},
			providerRef: {
				deref: () => ({
					getState: vi.fn().mockResolvedValue({
						mode: "code",
						customModes: [],
					}),
				}),
			},
			say: vi.fn().mockResolvedValue(undefined),
			// Mock ask to return yesButtonClicked with user feedback text
			ask: vi.fn().mockResolvedValue({
				response: "yesButtonClicked",
				text: "This is my important feedback that should not be lost!",
			}),
		}

		mockTask.pushToolResultToUserContent = vi.fn().mockImplementation((toolResult: any) => {
			mockTask.userMessageContent.push(toolResult)
			return true
		})
	})

	it("should merge user feedback into error message when tool execution fails", async () => {
		// Set up a tool_use block for read_file
		mockTask.assistantMessageContent = [
			{
				type: "tool_use",
				id: "tool_call_123",
				name: "read_file",
				params: { path: "test.txt" },
				partial: false,
			},
		]

		// Execute presentAssistantMessage
		await presentAssistantMessage(mockTask)

		// Verify that mockTask.say was called with "error" and the details contained both the user feedback and the error message
		expect(mockTask.say).toHaveBeenCalledWith(
			"error",
			expect.stringContaining(
				"[User Feedback during approval]: This is my important feedback that should not be lost!",
			),
		)
		expect(mockTask.say).toHaveBeenCalledWith("error", expect.stringContaining("Mock read file error"))
	})
})

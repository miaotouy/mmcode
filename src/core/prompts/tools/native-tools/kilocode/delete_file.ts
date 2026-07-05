import type OpenAI from "openai"

export default {
	type: "function",
	function: {
		name: "delete_file",
		description:
			"Delete a file or directory from the workspace. This action is irreversible and requires user approval. For directories, all contained files are validated against protection rules and .kilocodeignore before deletion. Cannot delete write-protected files or paths outside the workspace.",
		strict: true,
		parameters: {
			type: "object",
			properties: {
				paths: {
					type: "string",
					description: "Comma-separated paths to files or directories to delete, relative to the workspace.",
				},
			},
			required: ["paths"],
			additionalProperties: false,
		},
	},
} satisfies OpenAI.Chat.ChatCompletionTool

import type { ModelInfo } from "../model.js"

// https://platform.deepseek.com/docs/api
// preserveReasoning enables interleaved thinking mode for tool calls:
// DeepSeek requires reasoning_content to be passed back during tool call
// continuation within the same turn. See: https://api-docs.deepseek.com/guides/thinking_mode
export type DeepSeekModelId = keyof typeof deepSeekModels

export const deepSeekDefaultModelId: DeepSeekModelId = "deepseek-v4-flash"

export const deepSeekModels = {
	// kilocode_change start
	"deepseek-v4-flash": {
		maxTokens: 16_384,
		contextWindow: 128_000,
		supportsImages: false,
		supportsPromptCache: true,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		inputPrice: 0.25,
		outputPrice: 0.38,
		cacheWritesPrice: 0.25,
		cacheReadsPrice: 0.025,
		description: "DeepSeek-V4 Flash: latest fast DeepSeek model for coding, chat, and tool use.",
	},
	"deepseek-v4-pro": {
		maxTokens: 16_384,
		contextWindow: 128_000,
		supportsImages: false,
		supportsPromptCache: true,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		preserveReasoning: true,
		inputPrice: 0.55,
		outputPrice: 1.65,
		cacheWritesPrice: 0.55,
		cacheReadsPrice: 0.055,
		description: "DeepSeek-V4 Pro: latest DeepSeek thinking model for harder reasoning and coding tasks.",
	},
	// kilocode_change end
	"deepseek-chat": {
		maxTokens: 8192, // 8K max output
		contextWindow: 128_000,
		supportsImages: false,
		supportsPromptCache: true,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		inputPrice: 0.28, // $0.28 per million tokens (cache miss) - Updated Dec 9, 2025
		outputPrice: 0.42, // $0.42 per million tokens - Updated Dec 9, 2025
		cacheWritesPrice: 0.28, // $0.28 per million tokens (cache miss) - Updated Dec 9, 2025
		cacheReadsPrice: 0.028, // $0.028 per million tokens (cache hit) - Updated Dec 9, 2025
		description: `DeepSeek-V3.2 (Non-thinking Mode) achieves a significant breakthrough in inference speed over previous models. It tops the leaderboard among open-source models and rivals the most advanced closed-source models globally. Supports JSON output, tool calls, chat prefix completion (beta), and FIM completion (beta).`,
	},
	"deepseek-reasoner": {
		maxTokens: 8192, // 8K max output
		contextWindow: 128_000,
		supportsImages: false,
		supportsPromptCache: true,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		preserveReasoning: true,
		inputPrice: 0.28, // $0.28 per million tokens (cache miss) - Updated Dec 9, 2025
		outputPrice: 0.42, // $0.42 per million tokens - Updated Dec 9, 2025
		cacheWritesPrice: 0.28, // $0.28 per million tokens (cache miss) - Updated Dec 9, 2025
		cacheReadsPrice: 0.028, // $0.028 per million tokens (cache hit) - Updated Dec 9, 2025
		description: `DeepSeek-V3.2 (Thinking Mode) achieves performance comparable to OpenAI-o1 across math, code, and reasoning tasks. Supports Chain of Thought reasoning with up to 8K output tokens. Supports JSON output, tool calls, and chat prefix completion (beta).`,
	},
} as const satisfies Record<string, ModelInfo>

// https://api-docs.deepseek.com/quick_start/parameter_settings
export const DEEP_SEEK_DEFAULT_TEMPERATURE = 0.3

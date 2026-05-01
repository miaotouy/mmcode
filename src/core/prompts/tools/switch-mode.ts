export function getSwitchModeDescription(): string {
	return `## switch_mode
描述: 请求切换到不同模式。允许模式在需要时切换到另一个模式，比如切到代码模式改代码。用户必须批准切换。
参数:
- mode_slug: (必填) 要切换到的模式标识（如 "code"、"ask"、"architect"）
- reason: (可选) 切换模式的原因
用法:
<switch_mode>
<mode_slug>模式标识</mode_slug>
<reason>切换原因</reason>
</switch_mode>

示例: 请求切换到代码模式
<switch_mode>
<mode_slug>code</mode_slug>
<reason>需要修改代码</reason>
</switch_mode>`
}

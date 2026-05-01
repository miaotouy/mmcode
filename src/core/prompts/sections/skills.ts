import type { SkillsManager } from "../../../services/skills/SkillsManager"

type SkillsManagerLike = Pick<SkillsManager, "getSkillsForMode">

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&apos;")
}

/**
 * Generate the skills section for the system prompt.
 * Only includes skills relevant to the current mode.
 * Format matches the modes section style.
 *
 * @param skillsManager - The SkillsManager instance
 * @param currentMode - The current mode slug (e.g., 'code', 'architect')
 */
export async function getSkillsSection(
	skillsManager: SkillsManagerLike | undefined,
	currentMode: string | undefined,
): Promise<string> {
	if (!skillsManager || !currentMode) return ""

	// Get skills filtered by current mode (with override resolution)
	const skills = skillsManager.getSkillsForMode(currentMode)
	if (skills.length === 0) return ""

	const skillsXml = skills
		.map((skill) => {
			const name = escapeXml(skill.name)
			const description = escapeXml(skill.description)
			// Per the Agent Skills integration guidance for filesystem-based agents,
			// location should be an absolute path to the SKILL.md file.
			const location = escapeXml(skill.path)
			return `  <skill>\n    <name>${name}</name>\n    <description>${description}</description>\n    <location>${location}</location>\n  </skill>`
		})
		.join("\n")

	return `====

可用技能

<available_skills>
${skillsXml}
</available_skills>

<mandatory_skill_check>
必需前置检查

在生成任何面向用户的回复之前，**必须**执行技能适用性检查。

第 1 步: 技能评估
- 对照 <available_skills> 中所有技能的 <description> 条目评估用户请求。
- 确定是否至少有一个技能明确适用。

第 2 步: 分支决策

<if_skill_applies>
- **只选一个技能。**
- 多个技能匹配时，优先选最具体的。
- 读取技能 <location> 处的完整 SKILL.md 文件。
- 继续之前把 SKILL.md 内容完全加载到上下文中。
- 精确遵循 SKILL.md 的指令。
- 不要在技能定义的流程之外回复。
</if_skill_applies>

<if_no_skill_applies>
- 正常回复。
- 不要加载任何 SKILL.md 文件。
</if_no_skill_applies>

约束:
- 不要预先加载每个 SKILL.md。
- 只在技能选定后加载。
- 不要跳过此检查。
- **没执行此检查算错误。**
</mandatory_skill_check>

<context_notes>
- 技能列表已按当前模式 "${currentMode}" 过滤。
- 特定模式的技能可能来自 skills-${currentMode}/（在 .kilocode/ 或 .claude/ 目录下），项目级覆盖优先于全局技能。
</context_notes>

<internal_verification>
此部分仅供内部控制用。
不要在面向用户的输出中包含此部分。

完成评估后，内部确认:
<skill_check_completed>true|false</skill_check_completed>
</internal_verification>
`
}

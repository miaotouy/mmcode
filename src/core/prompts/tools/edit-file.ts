// kilocode_change: Morph fast apply - file added

export function getFastApplyEditingInstructions(modelType: "Morph" | "Relace"): string {
	return `- **${modelType} FastApply 已启用。** 你可以使用 \`fast_edit_file\` 工具，该工具使用专门优化的模型进行智能代码理解和修改。
- **仅使用 fast_edit_file 工具进行文件修改。**
- **专注于清晰的指令和精确的代码编辑**，使用 fast_edit_file 格式，以 \`// ... existing code ...\` 占位符表示未更改的部分。
- **fast_edit_file 工具需要三个参数:**
   - \`target_file\`: 要修改文件的完整路径
   - \`instructions\`: 用一句话描述你要做什么（使用第一人称）
   - \`code_edit\`: 仅包含你要更改的行，未更改部分使用 \`// ... existing code ...\`
- **始终将对同一文件的所有编辑放在单个 fast_edit_file 调用中**，而不是多次调用同一文件。`
}

export function getFastEditFileDescription(): string {
	return `## fast_edit_file

**描述**: 使用此工具对文件进行编辑。

此内容将由一个较简单的模型读取，它将快速应用编辑。你应该清楚地描述编辑内容，同时尽量减少写出的未更改代码。

编写编辑时，应按顺序指定每次编辑，使用特殊注释 \`// ... existing code ...\` 表示编辑行之间的未更改代码。

**示例格式**:
\`\`\`
// ... existing code ...
第一次编辑
// ... existing code ...
第二次编辑
// ... existing code ...
第三次编辑
// ... existing code ...
\`\`\`

仍应尽量少重复原始文件中的行来传达更改内容。
但每次编辑应在编辑代码周围包含足够的未更改行上下文，以消除歧义。
**不要** 在未使用 \`// ... existing code ...\` 注释表示省略的情况下，删除原有代码（或注释）的段落。如果省略现有代码注释，模型可能会意外删除这些行。
如果要删除某个段落，必须在删除前后提供上下文。如果初始代码是 \`\`\`code \\n 块 1 \\n 块 2 \\n 块 3 \\n code\`\`\`，且要删除块 2，应输出 \`\`\`// ... existing code ... \\n 块 1 \\n  块 3 \\n // ... existing code ...\`\`\`。
确保清楚地说明编辑内容及其应用位置。
**始终** 将对同一文件的所有编辑放在单个 fast_edit_file 中，而不是多次调用同一文件。应用模型可以同时处理多个不同的编辑。

**必填参数**:

1. **target_file** (字符串): 要修改的目标文件。始终指定要编辑文件的完整路径。

2. **instructions** (字符串): 用一句话描述你要对草图编辑做的事情。用于辅助较简单的模型应用编辑。使用第一人称描述你要做什么。用于消除编辑中的不确定性。

3. **code_edit** (字符串): 仅指定要编辑的精确代码行。**永远不要** 指定或写出未更改的代码。相反，使用正在编辑的语言的注释表示所有未更改代码 - 示例: \`// ... existing code ...\`

**所有三个参数 (target_file, instructions, code_edit) 均为必填**`
}

// kilocode_change: Backward-compatible export name
export const getEditFileDescription = getFastEditFileDescription

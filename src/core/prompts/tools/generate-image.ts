import { ToolArgs } from "./types"

export function getGenerateImageDescription(args: ToolArgs): string {
	return `## generate_image
描述: 通过 OpenRouter API 用 AI 模型生成或编辑图像。可以根据文本提示创建新图像，或根据指令修改现有图像。提供输入图像时，AI 会应用请求的编辑、变换或增强。
参数:
- prompt: (必填) 描述要生成的内容或如何编辑图像的文本提示
- path: (必填) 生成/编辑后图像的保存路径（相对于当前工作目录 ${args.cwd}）。如果未提供，工具会自动加合适的图像扩展名。
- image: (可选) 要编辑或变换的输入图像路径（相对于当前工作目录 ${args.cwd}）。支持格式: PNG、JPG、JPEG、GIF、WEBP。
用法:
<generate_image>
<prompt>图像描述</prompt>
<path>path/to/save/image.png</path>
<image>path/to/input/image.jpg</image>
</generate_image>

示例: 生成日落图像
<generate_image>
<prompt>山峦上美丽的日落，充满活力的橙色和紫色</prompt>
<path>images/sunset.png</path>
</generate_image>

示例: 编辑现有图像
<generate_image>
<prompt>将这张图像转换为水彩画风格</prompt>
<path>images/watercolor-output.png</path>
<image>images/original-photo.jpg</image>
</generate_image>

示例: 放大和增强图像
<generate_image>
<prompt>将这张图像放大到更高分辨率，增强细节，提高清晰度和锐度，同时保持原始内容和构图</prompt>
<path>images/enhanced-photo.png</path>
<image>images/low-res-photo.jpg</image>
</generate_image>`
}

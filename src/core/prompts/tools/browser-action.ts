import { ToolArgs } from "./types"

export function getBrowserActionDescription(args: ToolArgs): string | undefined {
	if (!args.supportsComputerUse) {
		return undefined
	}
	return `## browser_action
描述: 请求与 Puppeteer 控制的浏览器交互。除 \`close\` 外，每个操作都会返回浏览器当前状态的截图以及任何新的控制台日志。每次消息只能执行一个浏览器操作，等用户回复包含截图和日志的响应后决定下一步。

此工具特别适合 Web 开发任务——你可以启动浏览器、导航页面、点击和键盘输入与元素交互，通过截图和控制台日志捕获结果。在 Web 开发的关键阶段用：比如实现新功能后、做了大改动时、排查问题时，或验证工作成果时。看截图确认渲染是否正确或识别错误，审查控制台日志发现运行时问题。

用户可能提一些非开发任务（比如"最新新闻是什么"或"查天气"），如果合理，你可以用此工具来完成，而不是尝试建网站或用 curl。但如果已有可用的 MCP 服务工具或资源，优先用那些而不是 browser_action。

**浏览器会话生命周期:**
- 浏览器会话以 \`launch\` **开始**，以 \`close\` **结束**
- 会话在多个消息和工具使用之间保持活动状态
- 浏览器会话激活时你仍可用其他工具——它会在后台保持打开状态

参数:
- action: (必填) 要执行的操作。可选操作:
    * launch: 在指定 URL 启动新 Puppeteer 浏览器。**必须是第一个操作。**
        - 配合 \`url\` 参数提供 URL。
        - 确保 URL 有效且带正确协议（如 http://localhost:3000/page、file:///path/to/file.html 等）
    * hover: 移动光标到指定 x,y 坐标。
        - 配合 \`coordinate\` 参数指定位置。
        - 基于截图坐标移动到元素（图标、按钮、链接等）中心。
    * click: 在指定 x,y 坐标点击。
        - 配合 \`coordinate\` 参数指定位置。
        - 基于截图坐标点击元素（图标、按钮、链接等）中心。
    * type: 输入一串文本。点击文本字段后用此功能输入。
        - 配合 \`text\` 参数提供字符串。
    * press: 按下一个按键或组合键（如 Enter、Tab、Escape、Cmd+K、Shift+Enter）。
        - 配合 \`text\` 参数提供按键名称或组合。
        - 单键: Enter、Tab、Escape 等。
        - 组合键: Cmd+K、Ctrl+C、Shift+Enter、Alt+F4 等。
        - 支持的修饰键: Cmd/Command/Meta、Ctrl/Control、Shift、Alt/Option
        - 示例: <text>Cmd+K</text> 或 <text>Shift+Enter</text>
    * resize: 调整视口大小为指定 w,h 尺寸。
        - 配合 \`size\` 参数指定新尺寸。
    * scroll_down: 向下滚动一页。
    * scroll_up: 向上滚动一页。
    * screenshot: 截图保存到文件。
        - 配合 \`path\` 参数指定目标文件路径。
        - 支持的格式: .png, .jpeg, .webp
        - 示例: \`<action>screenshot</action>\` 配合 \`<path>screenshots/result.png</path>\`
    * close: 关闭 Puppeteer 浏览器。**必须是最后一个操作。**
        - 示例: \`<action>close</action>\`
- url: (可选) \`launch\` 操作用的 URL。
    * 示例: <url>https://example.com</url>
- coordinate: (可选) \`click\` 和 \`hover\` 操作的 X、Y 坐标。
    * **关键**: 截图尺寸和浏览器视口尺寸不一样
    * 格式: <coordinate>x,y@宽x高</coordinate>
    * 在聊天看到的截图图像上量 x,y
    * 宽x高必须是该截图图像的**精确**像素尺寸（不是浏览器视口）
    * 切勿用浏览器视口尺寸作为宽x高——视口只是参考，通常比截图大
    * 你看到之前图像通常已被缩小，所以截图尺寸可能小于视口
    * 示例 A: 如果你看到的截图是 1094x1092，想在该图像上点 (450,300)，用: <coordinate>450,300@1094x1092</coordinate>
    * 示例 B: 如果浏览器视口 1280x800 但截图 1000x625，想点截图上的 (500,300)，用: <coordinate>500,300@1000x625</coordinate>
- size: (可选) \`resize\` 操作的宽高。
    * 示例: <size>1280,720</size>
- text: (可选) \`type\` 操作的文本。
    * 示例: <text>Hello, world!</text>
- path: (可选) \`screenshot\` 操作的文件路径。相对于工作目录。
    * 支持的格式: .png, .jpeg, .webp
    * 示例: <path>screenshots/my-screenshot.png</path>
用法:
<browser_action>
<action>要执行的操作（launch、click、type、press、scroll_down、scroll_up、close）</action>
<url>启动浏览器的 URL（可选）</url>
<coordinate>x,y@宽x高（可选）</coordinate>
<text>要输入的文本（可选）</text>
</browser_action>

示例: 在 https://example.com 启动浏览器
<browser_action>
<action>launch</action>
<url>https://example.com</url>
</browser_action>

示例: 在 1024x768 图像的 (450,300) 处点击元素
<browser_action>
<action>click</action>
<coordinate>450,300@1024x768</coordinate>
</browser_action>

示例: 截图保存到文件
<browser_action>
<action>screenshot</action>
<path>screenshots/result.png</path>
</browser_action>`
}

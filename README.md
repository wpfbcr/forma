# Forma

**个人打造的 Agent，自己的 AI 团队，一个持续工作的空间。**

A local-first personal AI workspace. Create agents, connect installed agent tools, and coordinate your team through one leader conversation.

Forma 是面向 Windows 与 macOS 的开源桌面项目。当前版本为 **0.2.0-alpha.5**，已从 HTML 原型迁移到 Electron + TypeScript 应用，使用真实本地存储和模型调用接口。

## 0.2 新增：知识与技能

Wiki 整理和 AI 技能生成改为后台任务。提交后立即返回，可在知识库“处理记录”或全局顶部“处理记录”查看阶段、用时、执行模型/Agent、错误和结果。支持取消与手动重试；退出应用会中断调用，重启后保留记录，不自动再次消耗额度。

模型中心支持全局默认模型，用于 AI 编写技能等平台生成任务。Wiki 整理可以直接选模型（默认使用全局配置），也可选择 Agent；Agent 的任务执行模型独立配置。

知识库详情提供“分配使用”和使用对象列表；Agent 配置提供“知识”；团队提供“共享知识”和成员继承/排除设置；任务上下文显示本轮知识范围与来源版本。团队分配支持全体成员、仅 Leader 和指定成员。

- 新建本地知识库，关联只读目录或导入 Markdown、TXT、CSV、JSON、HTML、文本型 PDF、DOCX。
- 中文关键词检索、来源标识、资料版本、目录手动/自动同步。
- 使用已配置的 Agent 整理 Wiki 草稿；人工采纳后保存正文及修订，并可被后续检索。
- 技能源码编辑、AI 辅助创建草稿、8 个可选预置技能、启用与版本管理。
- 为 Agent、团队或任务绑定知识和技能；每轮执行固定所用证据和技能内容，保存资源快照。

当前技能以指令和模板为主，脚本及扩展资源包执行尚未开放。当前检索为本地关键词检索；每库最多 500 个来源、16 MB 解析文本，单文件最多 10 MB、解析文本最多 256 KB。扫描件 OCR、向量检索、复杂文档排版、分批主题图谱整理和外部 llm_wiki 连接器尚未实现。Wiki 草稿每次处理前 30 份资料、每份最多 4000 字符。

新增内容由 Forma 独立实现，未复制 nashsu/llm_wiki 的 GPL 代码。AI 技能创建与 Wiki 整理使用用户自己的 Agent，实际调用需用户配置后验证。

## 已实现

- 自建 Agent：职责、模型、工作方式、文件工具、记忆配置。
- 本机 Codex / Claude Code 安装检测与调用适配；沿用原工具认证。
- 用户创建团队、指定 Leader、编辑职责；快捷列表与可拖动画布。
- 用户自带模型连接：OpenAI 兼容 Chat Completions、Anthropic Messages；支持本机 HTTP 服务。
- 真实任务工作空间、资料文件、完整对话、各轮上下文、执行记录与成果版本。
- Leader 规划、依赖校验、成员并行执行、统一审阅交付。
- 持续对话、执行中追加要求、暂停、停止、失败恢复。
- 文件工具的路径检查与读写限制；模型密钥通过操作系统安全存储加密。
- 文件预览、历史版本与工作空间 ZIP 导出；浅色/深色主题。

首次启动没有预设密钥、假安装状态或模拟任务。先配置自己的模型或接入已安装的 Agent。

## 源码运行

需要 Node.js **22.12+**（推荐 24 LTS）、npm 和 Git。

在项目目录中执行：

```sh
npm ci
npm run dev
```

首次运行会下载项目锁定的官方 Electron 运行时。必要时可以先执行：

```sh
node node_modules/electron/install.js
```

`npm run dev` 会先编译应用，再打开桌面窗口。这里的 `src/renderer/index.html` 需要桌面进程提供本地接口，不能作为独立网页运行；之前的纯 HTML 演示不属于这个仓库。

## 开始第一项任务

1. 在“模型中心”点击“发现本机登录源”，接入已登录的 Codex / Claude Code，无需填写 Base URL 和 API Key；也可以添加 API 服务，通过地址与密钥获取模型列表。
2. 点击“测试连接”，验证一次真实文本调用。测试可能产生服务商费用。
3. 创建 Agent 并分配模型；也可以接入已经在终端安装、登录的 Codex 或 Claude Code。
4. 创建团队并指定 Leader；单个 Agent 也可以独立运行。
5. 在工作台输入目标和工作空间名称，开始执行。
6. 后续只与 Leader 对话。资料、上下文、成员进度和成果在右侧工作空间查看。

模型地址支持服务根地址、版本前缀或完整接口地址；根地址默认补全 /v1，自定义 API 前缀保留。例如兼容服务通常填写 `https://你的服务地址/v1`，程序追加 `/chat/completions`；Anthropic 协议追加 `/messages`。HTTP 仅允许本机地址，远程服务要求 HTTPS。

## 已登录账户与 Magpie 路由

模型中心可检查 Codex、Claude Code 的原生登录状态。模型加入后可分配给自建 Agent、同类原生 Agent、团队成员，或设为 Wiki / AI 技能生成的全局默认模型。认证和刷新由原 CLI 维护，Forma 不读取或复制认证文件、钥匙串令牌，也不修改原工具的全局配置。

- Codex 模型目录来自本机模型缓存，另提供“当前默认模型”；缓存可能过期。
- Claude Code 提供默认模型及 sonnet / opus / haiku 别名，由原工具解析；不是账户在线权益列表。
- 使用 CLI 来源的自建 Agent 会通过对应原 CLI 执行，工具与权限由该 CLI 适配器控制。API 模型仍通过 HTTP 执行，二者并非完全相同的运行环境。
- 已运行的 [Magpie](https://github.com/yetone/magpie) 网关可在本机 `127.0.0.1:3425` 自动发现、读取模型列表。选择网关模型后，Codex 使用 Responses、Claude Code 使用 Messages，覆盖仅作用于本次子进程；可用于跨原生工具路由。
- Forma 目前未内置或自动安装 Magpie，也未实现其账户池、订阅协议适配与刷新服务。没有网关时，原生 Codex 只能选择 Codex 登录源，原生 Claude Code 只能选择 Claude 登录源；自建 Agent 可选择任一来源。

“发现”不进行生成；“测试连接”和任务执行会使用所选账户的额度。登录检查成功不保证模型权限、额度或真实生成可用。原工具退出登录后，需在原工具重新登录再刷新来源。

## 本地数据

应用默认将配置存入 Electron 的应用数据目录：

- macOS：`~/Library/Application Support/Forma` 或开发构建的应用名称对应目录。
- Windows：`%APPDATA%/Forma` 或开发构建的应用名称对应目录。

具体工作空间位置可以在“设置”中查看和更改。开发时可通过 `FORMA_DATA_DIR` 指定独立的应用数据目录。

```text
应用数据目录/
  state.json                  # 个人配置与任务状态
  credentials.enc.json        # 经系统安全存储加密的密钥
  workspaces/<任务 ID>/
    资料/
    上下文/
    会话/
    轮次/<轮次编号>/
    成员/<Agent ID>/           # 各成员的实际工作目录
    成员产物/
    成果/
    .forma/versions/           # 文件历史版本
```

任务资料可能发送给你选择的模型服务商；本地优先不代表云模型推理离线。模型密钥不会返回界面，也不包含在工作空间导出中。

## 开发与检查

```sh
npm run typecheck
npm test
npm run build
npm run check
```

测试使用固定的执行器和响应数据，不调用付费模型，也不复用开发者登录。

## 安装包构建

```sh
npm run pack       # 当前平台的应用目录
npm run dist       # 当前平台安装包
```

- macOS：DMG / ZIP；在对应架构的 macOS 上构建。
- Windows：NSIS 安装程序；在 Windows 上构建。
- 构建产物输出到 `release/`，不提交 Git。
- GitHub Actions 提供检查矩阵，以及手动触发的未签名安装包构建。

尚未配置 Apple Developer 签名、公证和 Windows 代码签名。此阶段不把构建配置等同于已完成双平台发行验证，也没有发布 GitHub Release。

## Alpha 边界

- 已有自动化测试覆盖核心运行逻辑；真实服务商和外部 Agent 需要使用者配置后联调。
- Codex 使用其自身沙箱；Claude Code 限制工具集合。Forma 的工作目录分离不构成额外的操作系统沙箱。
- 外部 Agent 每次调用建立独立执行会话，通过任务上下文继续工作，暂不复用原 CLI 的原生会话 ID。
- 暂停先停止新步骤派发，等待在途操作收尾；停止会取消请求并尝试终止进程树。
- 中断后不会自动重放外部动作。继续执行前需要检查已产生的文件；外部副作用无法自动撤销。
- 目前显示阶段进度和完整回复，尚未实现逐 token 流式输出。
- MCP、联网搜索服务、通用命令工具、定时任务、云同步、自动更新和预算计费未开放。
- 成员产物归档暂限 6 层目录、100 个文件、单文件 256 KB 的文本；其他文件仍可从真实工作目录访问。
- 状态为版本化 JSON 文件存储，适合初期单人使用；大规模历史数据索引与迁移后续完善。

详细设计见 [产品定义](docs/product-definition.md)、[架构说明](docs/architecture.md) 和 [安全边界](SECURITY.md)。当前实测范围见 [验证记录](docs/validation.md)。

## 贡献与许可

欢迎提交问题和改进，见 [贡献指南](CONTRIBUTING.md)。本项目使用 [MIT License](LICENSE)。

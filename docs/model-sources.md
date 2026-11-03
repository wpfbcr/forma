# 模型与登录来源

模型是配置资源，Agent 是执行角色。自建 Agent 可以选择任一已导入模型；原生 Agent 的可选模型取决于其执行器及是否接入 Magpie。

## 来源比较

| 来源 | 如何添加 | 谁执行请求 | 当前适用范围 |
| --- | --- | --- | --- |
| API 服务 | Base URL、协议、API Key → 获取列表 → 选择 | Forma 的 HTTP 适配器 | 自建 Agent、Wiki、技能生成 |
| Codex 登录 | 先在原工具登录 → 发现本机登录源 | 本机 Codex CLI | 自建 Agent、原生 Codex、Wiki、技能生成 |
| Claude Code 登录 | 先在原工具登录 → 发现本机登录源 | 本机 Claude Code CLI | 自建 Agent、原生 Claude Code、Wiki、技能生成 |
| Magpie 本机网关 | 启动 Magpie → 发现本机登录源 | HTTP 或所选原生 CLI 连接网关 | 自建 Agent、平台生成、跨原生工具路由 |

CLI 来源会使用原工具的执行环境和权限机制，与 API 执行环境不同。选择 Claude 登录源的自建 Agent 实际由 Claude Code 运行；选择 Codex 来源则由 Codex 运行。

## API 服务

支持 OpenAI 兼容 **Chat Completions** 与 **Anthropic Messages**，不代表支持所有厂商协议或任何列表中模型的工具能力。

1. 选择协议，填写服务地址及密钥。本机 HTTP 服务可不填密钥；远程要求 HTTPS。
2. 点击“获取模型列表”，搜索并选择。只有服务不支持列举时才使用高级手动填写。
3. 保存后可点击“测试连接”；测试会发起一次简短文本生成。

地址可以是服务根地址、API 前缀或完整接口地址；根地址默认补 `/v1`。例如兼容服务通常使用 `https://example.com/v1`，程序追加 `/chat/completions`；Anthropic 追加 `/messages`。自定义代理前缀会保留。不要把服务商网页地址当成 API 地址。

改变已保存的地址或协议需要重新提供密钥，程序不会将旧密钥静默转发给另一个地址。出现 HTML、空响应、HTTP 错误或无效 JSON 时会给出分类提示，不回显服务商原始错误体中的潜在密钥。

## 复用原 CLI 登录

先按 [Codex](https://developers.openai.com/codex/cli/) 或 [Claude Code](https://code.claude.com/docs/en/overview) 官方说明安装并登录，再到 Forma 发现来源。

- 登录状态由原 CLI 的状态命令检查；Forma 只返回状态标志，不将账户详情或原始状态输出保存到界面。
- Codex 目录来自本机模型缓存，可能过期；另有“当前默认模型”。
- Claude 提供默认及 sonnet / opus / haiku 别名，交给原工具解析，不是账户在线可用权益列表。
- Forma 不读取或复制认证文件、钥匙串令牌，不改写原工具全局配置；认证及刷新由原工具处理。
- 原生 Agent 选择空模型时沿用原工具配置；团队成员的空覆盖表示沿用该 Agent 的配置。
- 退出登录、额度耗尽、原工具版本变化或模型权限变化均可能导致调用失败，需要在原工具处理后重新检查。

当前调用按独立会话执行，通过 Forma 传入的上下文继续任务，不复用原 CLI 的原生会话 ID。安装状态、登录状态、文本调用和工具执行是不同的验证层级。

## Magpie 网关

[Magpie](https://github.com/yetone/magpie) 通过账户与协议适配暴露本地模型服务。Forma 目前只发现**已经运行**在 `http://127.0.0.1:3425` 的 Magpie 兼容接口，读取其模型目录；不能仅凭端口响应证明服务身份，需由你确认本机运行的是预期网关。

导入网关模型后：自建 Agent 使用 Chat Completions；Codex 通过本次调用的 provider 配置使用 Responses；Claude Code 通过子进程环境使用 Messages。网关地址和文档中的本机占位认证仅对本次调用生效，不写全局设置。

Forma 没有内置或自动安装 Magpie，没有实现其账户池、订阅刷新、完整协议转换或工具桥接服务。这些能力由实际运行的 Magpie 负责。没有网关时，不允许将 Claude 登录源分配给原生 Codex 执行器，反向同样如此；自建 Agent 可选择任一原 CLI 来源。

## 默认模型与覆盖

模型中心的**全局默认模型**只影响平台生成。Wiki 可以使用全局默认、临时指定模型或指定 Agent；AI 编写技能可以临时覆盖默认模型。后台任务提交时固定目标，后续修改默认不会更改已提交记录。

Agent 模型、团队内成员覆盖和平台默认是独立设置。任务创建时固定成员与模型快照，已有任务不随全局配置静默换模。

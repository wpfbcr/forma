# 初版架构

## 分层

```text
Renderer（TypeScript / HTML / CSS）
  └─ preload 白名单接口：request / onState
      └─ Electron Main
          ├─ 原生目录选择、文件导出、窗口与安全存储
          └─ Service：参数验证与操作分发
              ├─ Store：串行状态变更、原子替换
              ├─ Vault：系统安全存储加密与独立凭据文件
              ├─ Workspaces：真实文件、路径检查、版本归档
              └─ Engine：Leader 规划 → 成员依赖执行 → 审阅交付
                  ├─ ModelClient：兼容 API / Anthropic
                  └─ External：Codex / Claude Code 子进程
```

## 状态与执行

主进程是业务状态的唯一写入者。界面通过明确操作修改数据，不能整份覆盖状态或直接传递任意文件读取请求。状态变更串行提交，持久化后再向界面发送快照。

创建任务时固定团队成员及模型配置，创建独立目录。每轮记录请求、对话、资料、记忆和前序摘要。Leader 的计划必须通过结构校验，包含有效成员、唯一任务标识和无环依赖。就绪成员在并发限制内执行；同一 Agent 的多个步骤不会同时写自己的目录。

成员仅收到分派任务、需要的资料、记忆及依赖结果。单 Agent 任务额外接收历史对话，维持连续工作。Leader 汇总成果到版本文件，用户始终只与 Leader 对话。

补充要求在运行中排队；当前轮结束后自动创建下一轮。用户暂停会等待当前批次结束，停止会触发取消。失败保留已完成步骤；继续执行仅处理未完成步骤。应用重启发现中断任务时标记为暂停，要求用户检查后恢复。

## 模型与工具

`ModelClient` 根据协议转换消息和文件工具。API 密钥只在主进程内获取，不返回 renderer。请求不跟随重定向；响应、上下文与工具调用次数都有上限。连接测试只证明文本调用可用，不宣称全部工具能力已验证。

内置文件工具以成员工作目录为边界，拒绝父目录、绝对路径、符号链接和 Windows 特殊路径。写入需同时满足全局和成员权限。

外部执行器通过参数数组与 stdin 启动，不拼接 shell 命令。只读取最终结果和必要阶段信息，不展示内部推理事件。检测安装仅执行版本检查；实际认证由原 CLI 管理。

## 目录

- `src/shared/`：界面与后台共用的类型定义。
- `src/core/`：平台无关的存储、执行与模型逻辑。
- `src/main/`：Electron 与系统能力接入。
- `src/renderer/`：按已确认原型实现的界面。
- `tests/`：不依赖真实凭据的核心回归测试。
- `scripts/`：构建与检查辅助。
- `.github/workflows/`：跨平台检查和安装包构建。

## 参考

- [Electron 安全实践](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage)
- [Codex 非交互调用](https://learn.chatgpt.com/docs/non-interactive-mode)
- [Claude Code 程序化调用](https://code.claude.com/docs/en/headless)

参考文档只用于调用适配；项目不包含上述产品的凭据、程序或服务授权。

## 登录来源路由（0.2.0-alpha.6）

`login-sources.ts` 将原工具登录状态缩减为状态标志、模型目录与来源；不持久化状态输出或账户凭据。导入模型采用来源加模型 ID 的稳定标识，API 连接不能覆写受管理的来源。调用前按 Model.source 选择 HTTP 或原 CLI。跨原生工具的登录源选择会明确拒绝，防止替换用户选择的执行器。

Magpie 仅接入其已启动的本机标准网关接口。Codex 的 provider 配置通过每次调用的参数传入，Claude 的地址/占位认证通过子进程环境传入；不写全局配置。网关协议、账户刷新、工具桥接由 Magpie 服务负责。CLI 模型参数在 stdin 标志前传入，提示词仍经 stdin，退出与取消保持原进程树处理。

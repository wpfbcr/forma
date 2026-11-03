# 安全边界

Forma 是本地桌面软件，能够调用模型、读写工作目录并启动用户已有的 Agent。

## 已实施

- renderer 关闭 Node 集成，启用上下文隔离与沙箱；不加载远程脚本。
- IPC 校验窗口、页面来源和操作参数；原生能力不直接暴露为通用文件或 shell 接口。
- API 密钥用 Electron 异步安全存储 API 加密；系统存储不可用时拒绝保存新密钥。
- 模型密钥不进入任务快照、界面状态或工作空间导出。
- 远程模型地址要求 HTTPS；HTTP 只允许本机；禁止在 URL 中携带认证信息。
- 内置文件工具拒绝路径越界、符号链接、Windows 特殊路径，写入需要两级启用。
- 外部执行使用固定参数和 stdin；不启用跳过审批或取消沙箱的危险开关。

## 重要限制

- 外部 Agent 保留它自己的权限行为和认证机制。改变工作目录不代表限制了进程的全部文件或网络访问。
- 本软件无法替代操作系统沙箱，也不能隔离同一用户权限下的恶意进程。
- 云模型会收到任务所需资料；用户应确认选定的服务商和数据范围。
- 同一用户可能解密其自身的 Windows 凭据；macOS 的行为还受应用签名和钥匙串策略影响。
- 状态与工作资料默认未整体加密；只有模型密钥使用独立加密存储。
- 子进程取消不等于回滚，已执行的外部操作或文件改动仍可能存在。

## 支持与发行状态

当前仅维护 main 分支及最新 Alpha 的安全修复。旧预览版本没有长期支持承诺。代码签名、公证、完整发行验证与进一步审计尚未完成；公开源码不代表完成安全认证。

## 报告安全问题

请使用 [GitHub 私密漏洞报告](https://github.com/wpfbcr/forma/security/advisories/new)，描述受影响版本、触发条件、最小复现和可能影响。不要通过公开 Issue 披露可利用细节、密钥、认证文件或含私人内容的完整工作空间。若报告入口暂不可用，可先创建不含漏洞细节的 Issue 请求私密联系渠道。

维护者会尽力确认和修复，但 Alpha 阶段不承诺固定响应时限。普通功能问题可使用 Issues。

## Security reports (English)

Only the current main branch and latest Alpha receive active fixes. Use [GitHub private vulnerability reporting](https://github.com/wpfbcr/forma/security/advisories/new). Include affected versions, a minimal reproduction and impact; do not post credentials, private workspaces or exploit details in public issues. Signing, notarization and full release validation remain incomplete. No fixed response SLA is promised.

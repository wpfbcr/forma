# 贡献指南

使用 Node.js 24 LTS，执行 `npm ci` 安装锁定依赖。

开始修改前阅读 `docs/product-definition.md` 和 `docs/architecture.md`。UI 遵循当前的个人空间、Leader 唯一对话入口和任务工作空间布局。

提交前运行 `npm run check`。涉及执行器、文件权限、凭据或状态机的修改应补充有意义的回归测试。测试必须使用固定响应，不消耗真实模型额度。

请不要提交 `.env`、应用数据、模型密钥、真实会话、个人资料、安装包或 `node_modules`。新增运行能力需要说明权限边界和平台差异。

PR 描述应说明问题、用户可见的变化、验证方式及已知限制。尚未实现的能力不要显示为已可用。

项目尚未绑定远程仓库；推送后可以通过仓库 Issues 和 Pull Requests 协作。

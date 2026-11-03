# 贡献指南 / Contributing

欢迎反馈使用场景、可复现问题、改进文档或提交代码。项目目前为 Alpha，界面主要为简体中文；Issue 和 PR 可以使用中文或英文。

## 从哪里开始

1. 阅读 [README](README.md)、[架构说明](docs/architecture.md)与[路线图](docs/roadmap.md)。
2. 通过 [Issues](https://github.com/wpfbcr/forma/issues) 描述问题或较大的设计改动，避免与已有工作重复。
3. Fork 仓库并创建分支；保持每个 PR 聚焦一个问题。

核心原则：Agent 与团队由个人创建，用户持续与 Leader 对话，资料和结果属于任务工作空间。设计文档包含未来方向，不代表当前功能承诺。

## 开发环境

推荐 Node.js 24 LTS，最低版本见 `package.json`。

```bash
npm ci
npm run dev
```

需要独立测试数据时设置 `FORMA_DATA_DIR`，各平台示例见[安装文档](docs/installation.md)。不要用真实私人资料验证新工具或导入流程。

## 验证改动

```bash
npm run check
npm run docs:check
```

- `check` 进行 TypeScript 检查、固定响应测试及构建。
- `docs:check` 检查 Markdown 本地链接、图片和 README 版本一致性。
- 涉及执行器、凭据、文件边界或状态机时，补充能验证真实行为的回归测试。
- 测试使用固定响应和隔离目录，不能依赖维护者的登录、密钥、付费额度或外部服务。
- 修改运行时依赖后执行 `npm run licenses:generate`，检查并提交许可汇总变化。
- UI 改动说明如何操作和观察结果，可附不含个人信息的截图。
- 平台相关改动注明已测试的系统和架构，不把构建成功写成实机验收完成。

## 提交与 PR

建议使用 `feat:`、`fix:`、`docs:`、`test:`、`refactor:` 等提交前缀。PR 应说明触发问题、改动后的行为、验证结果与实质限制。新增用户能力时同步更新中英文 README、使用指南与更新日志。

未实现的能力不能在界面和文档中显示为已可用。依赖、接口和许可证变化需要明确说明；不要引入授权不明的代码或素材。

不要提交 `.env`、应用数据、密钥、认证文件、真实会话、个人资料、安装包或 `node_modules`。报告安全问题使用 [SECURITY.md](SECURITY.md) 的私密渠道。

## English summary

Fork the repository, create a focused branch and open a pull request. Use Node.js 24 LTS, run `npm ci`, then `npm run check` and `npm run docs:check`. Tests must use fixed responses and isolated data, without real credentials or paid account quota. Explain the problem, resulting behavior, validation and limitations. Include relevant tests for execution, credential, filesystem or state changes. Never commit private data, credentials or build output. Read [SECURITY.md](SECURITY.md) for vulnerability reporting.

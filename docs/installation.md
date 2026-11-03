# 安装与构建

## 下载应用

在 [Releases](https://github.com/wpfbcr/forma/releases) 中打开具体 Alpha 版本，阅读其平台、架构和已知限制，并按附件下载。Alpha 不是稳定版本，GitHub 的 latest 地址可能不会展示它。

- macOS Apple Silicon：下载 `mac-arm64.zip`，解压，将 `Forma.app` 移到“应用程序”。应用未签名、公证，系统可能阻止启动；先检查来源与 SHA-256，不要全局关闭安全检查。
- Windows x64：若版本含 `.exe` 附件，使用 NSIS 安装向导。构建未签名，可能触发系统信誉提示。是否已完成实机验收以版本说明为准。
- Intel Mac / Linux：当前不承诺安装包或完整桌面支持。请在适合的系统与架构上源码构建。

校验值见版本附件 `SHA256SUMS.txt`。macOS 可使用 `shasum -a 256 文件名`；Windows PowerShell 可使用 `Get-FileHash 文件名 -Algorithm SHA256`，与发布值逐字符比对。

## 源码运行

需要 Node.js **22.12+**、npm、Git，推荐 Node.js 24 LTS。不需要 Docker、外部数据库或 Python。

```bash
git clone https://github.com/wpfbcr/forma.git
cd forma
npm ci
npm run dev
```

`npm ci` 根据锁文件安装依赖，包含 Electron 运行时。`npm run dev` 编译主进程和界面后打开桌面窗口；目前没有热重载，修改后需重新运行。

`src/renderer/index.html` 使用 preload 桥接，不是独立网页版。不要通过静态服务器替代桌面启动来使用原生能力。

## 隔离开发数据

可通过环境变量 `FORMA_DATA_DIR` 指定独立目录，避免测试资料与日常配置混用。目录应在你信任的位置，不要加入版本库。

macOS / Linux：

```bash
FORMA_DATA_DIR="$PWD/.data/dev" npm run dev
```

Windows PowerShell：

```powershell
$env:FORMA_DATA_DIR = "$PWD/.data/dev"
npm run dev
```

日常工作空间根目录可在应用设置里修改；更改只影响后续新任务。

## 构建应用与安装包

```bash
npm run check
npm run pack
npm run dist
```

- `pack` 生成应用目录；`dist` 使用当前平台的默认打包目标。
- 输出在 `release/`；依赖、输出、开发数据与日志均被 Git 忽略。
- macOS 配置为 DMG / ZIP，Windows 配置为 NSIS；建议在目标系统上构建。
- GitHub [安装包工作流](https://github.com/wpfbcr/forma/actions/workflows/packages.yml) 可手动触发，生成 macOS arm64 / Windows x64 构建附件，不会自动发布 Release。
- 没有配置 Apple Developer / Windows 签名证书；安装包工作流禁用自动寻找签名身份。

源码编译成功、CI 通过、安装包构建成功和实机功能验收是不同层面的检查，详见[验证记录](validation.md)。

## 常见问题

### Electron 运行时没有下载完成

确认网络与代理能访问 Electron 发布资源；不要关闭校验，也不要从未知网盘替换运行时。重新执行：

```bash
node node_modules/electron/install.js
```

然后运行 `npm run dev`。网络受限时，可按 [Electron 官方安装说明](https://www.electronjs.org/docs/latest/tutorial/installation)设置下载镜像和代理。

### 可以离线运行吗

本地界面、存储与关键词检索在依赖安装完成后不需要云服务。生成能力需要已配置的 API、原 CLI 或网关；能否离线推理由选定的模型服务决定。

### 检测到原工具但生成失败

安装检测只检查版本。登录发现只检查认证状态与模型目录，都不保证额度或模型权限。在原工具确认能正常使用，并参照[模型来源说明](model-sources.md)检查当前模型与执行通道。

### 修改后界面没有变化

开发模式没有热重载。退出旧窗口后重启 `npm run dev`，避免同时打开多个版本。更新安装包前先退出旧应用。

### 如何升级与备份

先退出应用，备份应用数据目录和自定义工作空间，再替换应用。JSON 状态具有版本字段，但不承诺 Alpha 之间所有迁移都无损。系统安全存储加密的密钥不能作为跨系统的可移植备份，迁移后可能需要重新填写。不要将真实数据或凭据附在 Issue 中。

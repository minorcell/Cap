# Cap 桌面端

Cap 是一款基于 Tauri 的开源桌面应用，用于录制、编辑和分享视频。当前仓库仅聚焦桌面端，运行与构建所需的内容都在此处。

## 前置条件

- Node 20 与 pnpm 10
- Rust 1.88+，包含 Tauri 所需的平台工具链
- macOS 或 Windows 桌面环境

## 环境准备

1. 安装依赖：`pnpm install`
2. 生成本地环境变量：`pnpm env-setup`（写入 `.env`）
3. 准备原生依赖：`pnpm cap-setup`
4. 启动应用：`pnpm dev`（SolidStart 与 Tauri 开发模式）

## 常用脚本

- `pnpm dev`：开发模式运行桌面应用
- `pnpm build`：构建 SolidStart 产物用于打包
- `pnpm tauri:build`：生成发行版
- `pnpm format` / `pnpm lint` / `pnpm typecheck`：代码规范与检查

## 目录结构

- `apps/desktop`：SolidStart 前端与 Tauri 后端
- `packages/ui-solid`：Solid 组件库与 Tailwind 配置
- `packages/web-api-contract`：桌面端使用的共享 API 合同
- `crates/*`：负责采集、渲染、音频与编码的原生 Rust crate
- `scripts`：环境设置、原生依赖、崩溃符号化、插件检查等桌面工具脚本

## 环境变量

桌面端依赖若干环境变量，核心是 `VITE_SERVER_URL`（默认 `https://cap.so`）。可选分析配置包括 `VITE_POSTHOG_KEY` 与 `VITE_POSTHOG_HOST`。使用 `pnpm env-setup` 交互式生成 `.env`。

## 许可证

- `cap-camera*` 与 `scap-*` crate 采用 MIT 许可证（见 `licenses/LICENSE-MIT`）
- 第三方组件遵循其原始许可证
- 其他内容遵循 AGPLv3 许可证（见 `LICENSE`）

# CLAUDE.md

本文件提供在本仓库协作时的中文指南。

## 项目概览
- Cap 桌面端：Tauri v2 + SolidStart，面向 macOS 与 Windows 的录制、编辑与分享。
- 共享包：`packages/ui-solid`（Solid 组件与 Tailwind 配置）、`packages/web-api-contract`（桌面端使用的 API 合同）。
- 原生能力：`crates/*` 覆盖采集、录制、渲染、相机等 Rust crate。
- 工具脚本：`scripts/*` 用于环境初始化、依赖检查、符号化等。

## 关键目录与文件
- `apps/desktop/`：SolidStart 前端与 Tauri 后端。
- `packages/ui-solid/`、`packages/web-api-contract/`：桌面端依赖的共享包。
- `crates/*`：媒体处理相关的原生 crate。
- `scripts/*`：桌面工具脚本。
- 自动生成且禁止编辑：`**/tauri.ts`、`**/queries.ts`、`apps/desktop/src-tauri/gen/**`。

## 常用命令
```bash
pnpm install          # 安装依赖
pnpm env-setup        # 生成本地 .env
pnpm cap-setup        # 准备原生依赖
pnpm dev              # 启动桌面端开发模式（含 Tauri）
pnpm dev:desktop      # 同上
pnpm build            # 构建 SolidStart 产物
pnpm tauri:build      # 构建桌面发行版
pnpm lint             # Biome 检查
pnpm format           # Biome 格式化
pnpm typecheck        # TypeScript 项目引用检查
cargo build -p <crate>
cargo test -p <crate>
```

## 开发约定
- Node 20、pnpm 10.5.2、Rust 1.88+。
- 禁止代码注释：任何语言都不要添加 `//`、`/* */`、`///`、`//!`、`#` 等注释，依赖命名与类型自解释。
- 不启动额外服务；按需使用 `pnpm dev`/`pnpm dev:desktop`。
- 图标由 `unplugin-icons` 自动导入，无需手动引入。
- 如果 Turbo 构建异常，可按需清理 `.turbo`。

## 架构与模式（Solid + Tauri）
- 服务器状态：使用 `@tanstack/solid-query`。
- IPC：通过 `tauri_specta` 的 `commands` 与 `events`，使用自动生成的类型。
- 事件示例：
```rust
use tauri_specta::Event;

UploadProgress { progress: 0.0, message: "开始上传..." .to_string() }
    .emit(&app)
    .ok();
```

```ts
import { events, commands } from "./tauri";

await commands.startRecording({ target: "screen" });
await events.uploadProgress.listen((event) => {
  setProgress(event.payload.progress);
});
```
- UI 逻辑放在 Solid 组件内，IPC 仅负责与 Rust 交互，避免混杂。

## 环境变量（桌面端）
- 核心：`VITE_SERVER_URL`（默认 `https://cap.so`）
- 可选分析：`VITE_POSTHOG_KEY`、`VITE_POSTHOG_HOST`
- 使用 `pnpm env-setup` 交互生成 `.env`。

## 测试与质量
- 桌面端前端：Vitest，测试文件紧邻源码，命名为 `*.test.ts(x)`。
- Rust crate：`cargo test`，测试放在 `src` 或 `tests`。
- 提交前运行：`pnpm format`、`pnpm lint`、`pnpm typecheck`，Rust 代码运行 `cargo fmt`。

## 故障排查
- Node 版本不符：确认使用 Node 20。
- Tauri 绑定异常：重启开发服务器以再生成 `tauri.ts`。
- 权限问题：macOS/Windows 需授予屏幕录制、麦克风等权限。
- 编译错误：检查 Cargo 依赖和平台工具链。

## 安全与配置
- 屏幕、音频采集需遵守平台权限提示。
- 机密配置仅放在 `.env`，不要写入版本库。

## Rust Clippy 规则（工作区强制）
- 编译器 lint：`unused_must_use = "deny"`，必须处理 `Result`/`Option` 等。
- Clippy（全部禁止）：`dbg_macro`、`let_underscore_future`、`unchecked_duration_subtraction`、`collapsible_if`、`clone_on_copy`、`redundant_closure`、`ptr_arg`、`len_zero`、`let_unit_value`、`unnecessary_lazy_evaluations`、`needless_range_loop`、`manual_clamp`。
- 常见反例（避免）：`dbg!(value)`、`let _ = async_fn()`、`duration_a - duration_b`、嵌套 if、`5.clone()`、`&Vec<T>` 参数、`vec.len() == 0`、`let _ = returns_unit()`、`unwrap_or_else(|| val)`、`for i in 0..vec.len()`、`value.min(max).max(min)`。
- 正确方式示例：`tracing::debug!(?value)`、`async_fn().await`、`duration_a.saturating_sub(duration_b)`、合并条件的 if、`let x = 5`、参数使用 `&[T]`/`&str`、`vec.is_empty()`、直接调用返回 `()` 的函数、`unwrap_or(val)`、直接遍历集合、`value.clamp(min, max)`。

## 代码格式与提交
- 格式化：TypeScript/JavaScript 用 `pnpm format`，Rust 用 `cargo fmt`。
- 提交规范：`feat:`、`fix:`、`chore:`、`improve:`、`refactor:`、`docs:` 等前缀；PR 需描述清晰、关联 issue、附 UI 截图或 GIF（如涉及界面），并在行为变化时更新文档。

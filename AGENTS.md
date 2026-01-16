# 仓库指南

## 项目结构
- Turborepo 工作区：
  - `apps/desktop`：Tauri v2 + SolidStart 桌面端
  - `packages/ui-solid`、`packages/web-api-contract`：桌面端共享包
  - `crates/*`：采集、录制、渲染、相机等原生 Rust crate
  - `scripts/*`：桌面工具脚本

## 构建、测试、开发
- 安装：`pnpm install`；初始化：`pnpm env-setup` 后执行 `pnpm cap-setup`
- 开发：`pnpm dev` 或 `pnpm dev:desktop`
- 构建：`pnpm build`（SolidStart），桌面发行版：`pnpm tauri:build`
- 质量：`pnpm lint`、`pnpm format`、`pnpm typecheck`；Rust：`cargo build -p <crate>`、`cargo test -p <crate>`

## 代码风格与命名
- TypeScript：2 空格缩进，使用 Biome（`pnpm format`）
- Rust：`rustfmt` 与工作区 clippy 规则
- 命名：文件 kebab-case，组件 PascalCase，Rust 模块 snake_case，crate kebab-case
- 运行时要求：Node 20、pnpm 10.x、Rust 1.88+
- **禁止代码注释**：不要在任何语言中添加 `//`、`/* */`、`///`、`//!`、`#` 等注释，需通过命名、类型与结构自解释

## Rust Clippy 规则（工作区强制）
所有 Rust 代码遵循 `Cargo.toml` 中的 lints：

**编译器 lints：**
- `unused_must_use = "deny"` — `Result`/`Option` 等必须处理，不能忽略。

**Clippy lints（全部 deny）：**
- `dbg_macro` — 不使用 `dbg!()`。
- `let_underscore_future` — 不写 `let _ = async_fn()`；要等待或显式处理。
- `unchecked_duration_subtraction` — `Duration` 使用 `saturating_sub`。
- `collapsible_if` — 嵌套 if 合并为单个条件。
- `clone_on_copy` — `Copy` 类型不调用 `.clone()`。
- `redundant_closure` — 直接用函数引用，如 `iter.map(foo)`。
- `ptr_arg` — 参数用 `&[T]` 或 `&str`，不用 `&Vec<T>`/`&String`。
- `len_zero` — 使用 `.is_empty()`。
- `let_unit_value` — 返回 `()` 的函数直接调用，不赋值。
- `unnecessary_lazy_evaluations` — 便宜值用 `.unwrap_or(val)`。
- `needless_range_loop` — 不用索引时直接遍历集合。
- `manual_clamp` — 使用 `.clamp(min, max)`。

## 测试
- TS/JS：有 Vitest 的地方（桌面端）使用 `*.test.ts(x)` 紧邻源码
- Rust：每个 crate 运行 `cargo test`，测试放在 `src` 或 `tests`
- 以单元测试为主，适当冒烟覆盖关键流程

## 提交与 PR
- 提交遵循 conventional 前缀：`feat:`、`fix:`、`chore:`、`improve:`、`refactor:`、`docs:` 等
- PR 需包含清晰描述、关联 issue、UI 截图/GIF、环境或迁移说明；范围保持收敛，行为变化时同步更新文档

## Agent 使用约定
- 不启动额外服务；按需使用 `pnpm dev`/`pnpm dev:desktop`
- 不编辑自动生成文件：`**/tauri.ts`、`**/queries.ts`、`apps/desktop/src-tauri/gen/**`
- 优先使用现有脚本与 Turbo 过滤；仅在必要时清理 `.turbo`
- 秘密配置写入 `.env`，勿入版本库
- macOS 桌面权限（屏幕/麦克风）绑定运行 `pnpm dev:desktop` 的终端
- **严格禁止代码注释**：任何新增或修改的代码都不得添加注释

## 代码格式
- 交付前必须格式化：TypeScript/JavaScript 用 `pnpm format`，Rust 用 `cargo fmt`
- 开发过程中定期执行，确保一致性

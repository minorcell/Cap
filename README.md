# Cap Desktop

Cap is an open source, Tauri-based desktop app for recording, editing, and sharing videos. The repository now targets the desktop experience only; everything you need to run or build the app lives here.

## Prerequisites

- Node 20 and pnpm 10
- Rust 1.88+ with the platform toolchain for Tauri
- macOS or Windows desktop environment

## Setup

1. Install dependencies: `pnpm install`
2. Generate local env values: `pnpm env-setup` (writes `.env`)
3. Prepare native dependencies: `pnpm cap-setup`
4. Start the app: `pnpm dev` (runs SolidStart + Tauri in dev mode)

## Scripts

- `pnpm dev`: run the desktop app in development
- `pnpm build`: build the SolidStart assets for packaging
- `pnpm tauri:build`: produce a release bundle
- `pnpm format` / `pnpm lint` / `pnpm typecheck`: repository hygiene

## Project Layout

- `apps/desktop`: SolidStart frontend and Tauri backend
- `packages/ui-solid`: Solid component library and Tailwind config
- `packages/web-api-contract`: shared API contracts used by the desktop client
- `crates/*`: native Rust crates for capture, rendering, audio, and encoding
- `scripts`: desktop tooling for env setup, native deps, crash symbolication, and plugin checks

## Environment

The desktop app expects a few env values, most notably `VITE_SERVER_URL` (defaults to `https://cap.so`). Optional analytics keys include `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`. Use `pnpm env-setup` to populate `.env` interactively.

## License

- Code in the `cap-camera*` and `scap-*` crates is licensed under MIT (see `licenses/LICENSE-MIT`).
- Third party components remain under their original licenses.
- All other content is available under the AGPLv3 license (`LICENSE`).

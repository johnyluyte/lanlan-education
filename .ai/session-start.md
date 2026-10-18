# Project Overview

## Goal

- 製作「幼兒/小學教育」相關的平台，要做的功能尚未完全確定，會傾向一步一步做，每個功能都從 proof-of-concept，逐步完善到完整功能。

## Project Rules

- DO NOT ASSUME ANYTHING IF USER DID NOT SPECIFY. When in doubt, ASK USER FOR CLARIFICATION instead of making assumptions.
- When the user asks for incremental debugging or explicitly asks to do one step first, do only that step. Do not proactively implement adjacent follow-up work even if it seems like the usual next move. After finishing the requested step, propose the next step explicitly instead of silently expanding scope.
- Consider using `VueUse` if possible. Don't reinvent the wheel if a composable already exists for common patterns.

## UI Conventions

- Use **NuxtUI** components (`UButton`, `UTooltip`, `UModal`, etc.) for UI elements. No raw `<button>` tags. Only build custom components when necessary.
- Icons: use **Iconify** with packages already in package.json — `i-lucide-*`, `i-ri-*`, `i-game-icons-*`, `i-simple-icons-*`.
- 上述 UI 元素的使用規範只有 SPA APP 工具端適用，Landing Page 或其他非 APP 端的部分可以依需求使用原生 HTML 元素或其他 UI 框架。

## AI Rules

- Always use Caveman Skill to talk
- (Claude Only) Always use Serena MCP to search symbol.
- (Claude Only) When Serena MCP is available, do codebase exploration in main thread directly — do NOT spawn Explore subagents. Subagents don't inherit MCP tools, so they fall back to grep/glob/read which is slower and less precise.

## Skill Files

- 給 AI 的 Skills 操作規範統一放在 `.ai/skills/` 內，請自行使用需要的技能。

## ToolChain

- 請執行 `node -v` 並 **明確回報給使用者**，你環境看到的 Node 版本是多少。
- 請執行 `pnpm -v` 並 **明確回報給使用者**，你環境看到的 pnpm 版本是多少。

### ⚠️ Node 找不到？先初始化 fnm

本機 Node 很可能由 fnm (Fast Node Manager) 管理，**不在固定 PATH 上**。
fnm 透過 PowerShell `$PROFILE` 內的 hook 動態注入 node，而 AI 啟動的 shell 可能看不到。

**解法**：在任何 `node` / `npx` 指令前先初始化 fnm：

```powershell
fnm env --shell powershell | Out-String | Invoke-Expression
node -v
```

## Validation

- 修改程式碼後執行 `pnpm fix`、`pnpm check`、`pnpm test`、`pnpm generate`、`pnpm test:e2e` 等驗證。
- 測試頁面行為時，執行相應的 dev 指令（如 `pnpm dev:wiki`、`pnpm dev:app:local`、`pnpm dev:inner`），再用 Playwright 等工具驗證。

## 等待背景執行完

- 當你在等背景驗證跑完(例如 `pnpm generate:*`, `pnpm test:e2e` 等)且當下沒其他事情可做時，不要僅講說「完整驗證正在背景跑」，而是要**列印出下方這隻貓咪**，以便讓使用者知道背景任務仍在進行中：

```text
  /\_/\
 ( o.o ) < 還在等待背景執行完畢喵~
  > ^ <
```

## 不要​假設

​如果​我​給​您​的​ prompt ​有​任何​不​明確​的​地方，​請​一定​要​先​跟​我​討論，​**絕對​不​能​自己​亂猜/​亂假​設**

## UX 設計

- 此專案的 UX 設計偏好使用 Drawer 來編輯較複雜的資料，用 Modal 來編輯簡易資料或做簡單的確認，除非工程師有特別說明，否則請不要使用 inline editing（直接在列表上編輯）或跳轉到獨立頁面來編輯。

## 確認

- 看完此檔案之後，請 **明確回報給使用者** 你已讀完 session-start.md。

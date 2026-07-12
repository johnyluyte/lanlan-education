# Matching Game 垂直排列方向 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `MatchingGameBoard.vue` 依 `orientation` prop 渲染水平（現況）或垂直（新增）兩種佈局之一，垂直模式為水平佈局旋轉 90 度的概念：一欄一個項目，上點 + 上方圖片、下點 + 下方文字，文字內容維持水平書寫。

**Architecture:** 水平與垂直各自一組 computed 座標 + 各自一段 SVG template（`v-if`/`v-else` 切換），不共用計算式。水平那組完全不動。`colGap`（兩個區塊之間的距離）與 `rowGap`（相鄰點之間的距離）語意不變，只是垂直模式套用到 y/x 軸而非 x/y 軸。

**Tech Stack:** Vue 3 `<script setup>`、Nuxt、原生 SVG（無額外套件）。

## Global Constraints

- 不寫新的 migration（本任務不涉及 DB，僅供參考）。
- 完成後不需執行 `pnpm run dev` 或 `pnpm test`；但使用者已明確同意執行 `pnpm check`（`node scripts/check-alias-sync.mjs && nuxt typecheck && prettier --list-different --write . && eslint . --fix`），本計畫最後一步即跑此指令。
- UI 用 NuxtUI 元件，本次不新增互動元件，維持純 SVG 渲染。
- 不假設任何未明確規格的行為；垂直模式欄距過小造成文字重疊是已知且接受的限制，不特別處理。

---

### Task 1: Board 垂直佈局渲染 + Page 端 orientation 傳遞

**Files:**
- Modify: `app_12_matching_game/MatchingGameBoard.vue`
- Modify: `app_12_matching_game/MatchingGamePage.vue`

**Interfaces:**
- Consumes: `MatchingGamePage.vue` 既有的 `orientation = ref<'horizontal' | 'vertical'>('horizontal')`（[MatchingGamePage.vue:14](../../../app_12_matching_game/MatchingGamePage.vue#L14)）。
- Produces: `MatchingGameBoard.vue` 新增 prop `orientation: 'horizontal' | 'vertical'`，垂直模式下新增 computed：`topY`、`bottomY`、`firstX`、`imgY`、`textY`、`dims`（沿用既有名稱，內容依 orientation 分流）、`columnsData`（欄資料，結構為 `{ cx: number; item: ExampleData }[]`）。

這是本 spec 唯一的任務：檔案小、兩處修改互相依賴（Board 沒收到 orientation prop 就沒東西可切換，Page 沒傳 prop 則 Board 的新邏輯永遠用不到），拆成兩個 task 沒有獨立驗收的意義，因此合併成一個任務、多個步驟。

- [ ] **Step 1: 修改 `MatchingGameBoard.vue` 的 `<script setup>`，新增 `orientation` prop 與垂直模式的 computed**

把整個 `<script setup>` 區塊改成：

```vue
<script setup lang="ts">
  // 表格繪製：SVG 單圖層。
  // 水平模式：每列固定畫左右兩顆黃點，左邊點左側畫 item 圖片、右邊點右側畫 item cName/eName，不畫格線。
  // - 左邊點 x 座標固定不動，右邊點 x = 左邊 x + colGap，調整 colGap 只移動右邊點。
  // - 最上排點 y 座標固定不動，下方各排 y = 最上排 y + r * rowGap，調整 rowGap 只移動下方點，最上排不動。
  // 垂直模式：水平佈局整體旋轉 90 度的概念，每欄固定畫上下兩顆黃點，上點上方畫 item 圖片、下點下方畫 item cName/eName（文字本身維持水平書寫，不隨版面轉向）。
  // - 上點 y 座標固定不動，下點 y = 上點 y + colGap，調整 colGap 只移動下點。
  // - 最左欄點 x 座標固定不動，右方各欄 x = 最左欄 x + c * rowGap，調整 rowGap 只移動右方欄，最左欄不動。
  // 列數/欄數 M 由 items 筆數決定，不再另外傳 rows。
  import { computed } from 'vue'
  import type { ExampleData } from './example-data'

  const props = defineProps<{
    items: ExampleData[]
    colGap: number // 兩個區塊之間的距離 (px)：水平模式為左右兩點的 x 距離、垂直模式為上下兩點的 y 距離
    rowGap: number // 相鄰點之間的距離 (px)：水平模式為列與列的 y 距離、垂直模式為欄與欄的 x 距離
    dotRadius: number // 黃點半徑 (px)，跟 colGap/rowGap 分開設定，故不用比例換算
    orientation: 'horizontal' | 'vertical' // 排列方向
  }>()

  const IMG_SIZE = 48 // 圖片固定邊長 (px)，跟 dotRadius 分開設定，調整點點半徑不影響圖片大小
  const IMG_GAP = 8 // 圖片與點之間的間距 (px)
  const TEXT_GAP = 8 // 點與文字之間的間距 (px)
  const TEXT_AREA_WIDTH = 160 // 水平模式：右側預留給 cName/eName 文字的寬度 (px)
  const TEXT_LINE_HEIGHT = 20 // 垂直模式：畫布高度需預留的一行文字高度 (px)

  // 水平模式座標（原有邏輯不變）
  const leftX = computed(() => IMG_SIZE + IMG_GAP + props.dotRadius) // 左邊點固定座標，已預留左側圖片空間，不受 colGap 影響
  const rightX = computed(() => leftX.value + props.colGap) // 右邊點座標 = 左邊點 + colGap

  const imgX = 0 // 左側圖片固定貼齊畫布左緣
  const textX = computed(() => rightX.value + props.dotRadius + TEXT_GAP) // 右側文字固定貼在右邊點之後

  const topYHorizontal = computed(() => Math.max(props.dotRadius, IMG_SIZE / 2)) // 最上排點固定座標，需容納左側圖片高度，不受 rowGap 影響

  const dimsHorizontal = computed(() => ({
    w: textX.value + TEXT_AREA_WIDTH,
    h: topYHorizontal.value + (props.items.length - 1) * props.rowGap + Math.max(props.dotRadius, IMG_SIZE / 2),
  }))

  // 每列一筆 item：左邊點 + 左側圖片、右邊點 + 右側文字；左邊點座標固定、右邊點依 colGap 位移；最上排 y 座標固定、下方各排依 rowGap 位移
  const rowsData = computed(() =>
    props.items.map((item, r) => ({
      cy: topYHorizontal.value + r * props.rowGap,
      item,
    })),
  )

  // 垂直模式座標（新增）
  const topYVertical = computed(() => IMG_SIZE + IMG_GAP + props.dotRadius) // 上點固定座標，需容納上方圖片高度，不受 colGap 影響
  const bottomYVertical = computed(() => topYVertical.value + props.colGap) // 下點座標 = 上點 + colGap

  const imgY = 0 // 圖片固定貼齊畫布上緣
  const textY = computed(() => bottomYVertical.value + props.dotRadius + TEXT_GAP) // 文字固定貼在下點之後

  const firstX = computed(() => Math.max(props.dotRadius, IMG_SIZE / 2)) // 最左欄點固定座標，需容納圖片寬度，不受 rowGap 影響

  const dimsVertical = computed(() => ({
    w: firstX.value + (props.items.length - 1) * props.rowGap + Math.max(props.dotRadius, IMG_SIZE / 2),
    h: textY.value + TEXT_LINE_HEIGHT,
  }))

  // 每欄一筆 item：上點 + 上方圖片、下點 + 下方文字；最左欄 x 座標固定、右方各欄依 rowGap 位移；上點 y 座標固定、下點依 colGap 位移
  const columnsData = computed(() =>
    props.items.map((item, c) => ({
      cx: firstX.value + c * props.rowGap,
      item,
    })),
  )

  const dims = computed(() => (props.orientation === 'horizontal' ? dimsHorizontal.value : dimsVertical.value))
</script>
```

- [ ] **Step 2: 修改 `MatchingGameBoard.vue` 的 `<template>`，依 orientation 切換渲染區塊**

把整個 `<template>` 區塊改成：

```vue
<template>
  <svg :width="dims.w" :height="dims.h" :viewBox="`0 0 ${dims.w} ${dims.h}`" class="text-gray-800 dark:text-gray-200">
    <template v-if="orientation === 'horizontal'">
      <template v-for="(d, i) in rowsData" :key="i">
        <image :href="d.item.img" :x="imgX" :y="d.cy - IMG_SIZE / 2" :width="IMG_SIZE" :height="IMG_SIZE" />
        <circle :cx="leftX" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
        <circle :cx="rightX" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
        <text :x="textX" :y="d.cy" dominant-baseline="middle" text-anchor="start" font-size="14" fill="currentColor">
          {{ d.item.cName }} / {{ d.item.eName }}
        </text>
      </template>
    </template>
    <template v-else>
      <template v-for="(d, i) in columnsData" :key="i">
        <image :href="d.item.img" :x="d.cx - IMG_SIZE / 2" :y="imgY" :width="IMG_SIZE" :height="IMG_SIZE" />
        <circle :cx="d.cx" :cy="topYVertical" :r="dotRadius" fill="rgb(250 204 21)" />
        <circle :cx="d.cx" :cy="bottomYVertical" :r="dotRadius" fill="rgb(250 204 21)" />
        <text :x="d.cx" :y="textY" dominant-baseline="hanging" text-anchor="middle" font-size="14" fill="currentColor">
          {{ d.item.cName }} / {{ d.item.eName }}
        </text>
      </template>
    </template>
  </svg>
</template>
```

- [ ] **Step 3: 修改 `MatchingGamePage.vue`，把 `orientation` 傳給 `MatchingGameBoard`，並更新過時註解**

在 [MatchingGamePage.vue:14](../../../app_12_matching_game/MatchingGamePage.vue#L14)，把：

```ts
  const orientation = ref<'horizontal' | 'vertical'>('horizontal') // 排列方向，垂直模式待後續實作，目前 Board 仍固定畫左右連線
```

改成：

```ts
  const orientation = ref<'horizontal' | 'vertical'>('horizontal') // 排列方向
```

在 [MatchingGamePage.vue:29](../../../app_12_matching_game/MatchingGamePage.vue#L29)，把：

```vue
    <MatchingGameBoard :items="items" :col-gap="colGap" :row-gap="rowGap" :dot-radius="dotRadius" />
```

改成：

```vue
    <MatchingGameBoard :items="items" :col-gap="colGap" :row-gap="rowGap" :dot-radius="dotRadius" :orientation="orientation" />
```

- [ ] **Step 4: 執行 `pnpm check`，確認 typecheck/lint/prettier 全部通過**

Run: `pnpm check`
Expected: 指令成功結束（exit code 0），無 `nuxt typecheck` 型別錯誤、無 eslint 錯誤殘留（prettier/eslint 會自動 `--fix`，若有變動屬正常，只要最終結束時無報錯即可）。

- [ ] **Step 5: 瀏覽器實測，確認垂直佈局肉眼正確**

用 Playwright 或 Chrome DevTools MCP 開啟本機 dev server 的 `/matching-game` 頁面（若 dev server 未啟動，先啟動；啟動/開頁面這步不算違反「不用執行 pnpm run dev」的限制，因為是為了肉眼驗證此任務的視覺結果，而非重新跑建置流程）：
1. 預設是水平模式，確認畫面跟修改前一致（一列一個項目，左圖右字）。
2. 點擊「垂直」按鈕，確認：
   - 版面變成一欄一個項目，圖片在上、文字在下。
   - 文字本身是水平書寫（不是側躺/直式）。
   - 預設參數（`colGap=360`、`rowGap=80`）下，欄與欄之間、文字之間沒有重疊。
   - 拖曳「相鄰點之間的距離」「兩個區塊之間的距離」slider，確認垂直模式下數值變化有正確反映在版面上（欄距/上下點距離跟著變）。
3. 切回「水平」，確認能正確切回原本佈局，狀態沒有壞掉。

- [ ] **Step 6: Commit**

```bash
git add app_12_matching_game/MatchingGameBoard.vue app_12_matching_game/MatchingGamePage.vue
git commit -m "$(cat <<'EOF'
feat: matching-game 新增垂直排列方向的實際渲染

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

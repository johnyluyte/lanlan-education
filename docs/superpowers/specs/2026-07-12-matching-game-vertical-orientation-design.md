# Matching Game：垂直排列方向

## 背景

`app_12_matching_game` 目前只有「水平」佈局：每列一個項目，左邊點 + 圖片、右邊點 + 文字。上個步驟已在 Settings 加上「水平/垂直」切換按鈕（`orientation` model，貫穿 Page → Settings），但 Board 尚未依 orientation 改變渲染，垂直模式目前形同無效。本次要補上垂直模式的實際渲染。

## 需求

`MatchingGameBoard.vue` 依 `orientation` prop 渲染兩種佈局之一：

- **水平**（現況，不變）：一列一個項目，左點 + 左側圖片、右點 + 右側文字，由上到下排列。
- **垂直**（新增）：一欄一個項目，上點 + 上方圖片、下點 + 下方文字，由左到右排列。整體是水平佈局旋轉 90 度的概念，但文字內容本身維持水平書寫（不側躺/不轉向），置中對齊在該欄。

「兩個區塊之間的距離」（`colGap`）與「相鄰點之間的距離」（`rowGap`）語意不隨 orientation 改變，只是套用的軸向不同：

| 參數 | 水平模式 | 垂直模式 |
|---|---|---|
| `colGap`（兩個區塊之間的距離） | 左右兩點的 x 距離 | 上下兩點的 y 距離 |
| `rowGap`（相鄰點之間的距離） | 列與列的 y 距離 | 欄與欄的 x 距離 |

## 架構

不共用座標計算：水平與垂直各自一組 computed + 各自一段 SVG template 區塊，用 `v-if="orientation === 'horizontal'"` / `v-else` 切換。水平那組完全不動；垂直是新增的一組。

### 垂直模式座標計算

沿用現有常數 `IMG_SIZE`（圖片邊長 48px）、`IMG_GAP`（圖片與點的間距 8px）、`TEXT_GAP`（點與文字的間距 8px），新增一個 `TEXT_LINE_HEIGHT`（文字行高預留值，用於畫布高度計算，抓 20px）。

- `topY = IMG_SIZE + IMG_GAP + dotRadius`　— 上點 y 固定座標，需容納上方圖片
- `bottomY = topY + colGap`　— 下點 y，`colGap` 控制上下兩點距離
- `firstX = max(dotRadius, IMG_SIZE / 2)`　— 第一欄 x 固定座標
- 第 `c` 欄（`c` 從 0 開始）：`cx = firstX + c * rowGap`　— `rowGap` 控制欄距
- 圖片：置中在 `(cx, imgY=0)`，寬高 `IMG_SIZE`
- 上點：`(cx, topY)`；下點：`(cx, bottomY)`
- 文字：`x=cx`、`y = bottomY + dotRadius + TEXT_GAP`，`text-anchor="middle"`、`dominant-baseline="hanging"`，內容維持水平書寫
- 畫布寬：`firstX + (items.length - 1) * rowGap + max(dotRadius, IMG_SIZE / 2)`
- 畫布高：`bottomY + dotRadius + TEXT_GAP + TEXT_LINE_HEIGHT`

## 邊界情況

欄距（`rowGap`）設太小、文字太長時左右相鄰欄的文字可能重疊。不特別處理 —— 跟現有水平模式在 `rowGap` 太小時列會擠在一起是同樣取捨，屬 POC 階段可接受的限制。

## 測試

- `pnpm check` 需通過。
- 用瀏覽器（Playwright/Chrome DevTools）實際切換「垂直」按鈕，肉眼確認佈局：圖片在上、文字在下、文字水平書寫、欄與欄不重疊（預設參數下）。

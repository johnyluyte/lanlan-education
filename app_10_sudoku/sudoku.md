# 產生 NxN 數獨解答的數學模型與演算法

## 1. 數學模型

一個「填滿的數獨盤」在數學上是一個**加了額外限制的拉丁方 (Latin Square)**：

- **拉丁方**：NxN 方陣，每個數字 1~N 在每一列、每一行各出現恰好一次。
- **數獨 = 拉丁方 + 宮 (box) 限制**：方陣再切成 N 個小宮，每宮內 1~N 也各出現一次。

因此 **N 必須能分解成宮的尺寸 `R x C = N`**（R = 每宮列數、C = 每宮行數）：

| N   | 宮 (RxC) | base | 例子     |
| --- | -------- | ---- | -------- |
| 4   | 2x2      | 2    | 幼兒版   |
| 9   | 3x3      | 3    | 標準數獨 |
| 16  | 4x4      | 4    | 進階     |
| 6   | 2x3      | —    | 長方宮   |

多數情況 N 是完全平方數 (`N = base²`)，宮為正方形 `base x base`。

---

## 2. 演算法 A：種子樣式 + 洗牌（推薦，O(N²)）

不需回溯、**保證合法**、速度最快。原理：先用一條數學公式產生一個「基底解」，再對它做「保持數獨性質的隨機變換」打亂。

### 2.1 基底解公式

對正方宮 (`N = base²`)，格子 `(r, c)` 的值由下式決定：

```
pattern(r, c) = ( base * (r % base) + floor(r / base) + c ) mod N
```

這條式子產生的盤天生滿足列、行、宮三種限制（是一種「循環移位」排法）。

### 2.2 保持性質的隨機變換

以下操作都**不會破壞**數獨合法性，用來把基底解隨機化：

1. **洗數字**：把 1~N 重新對應（relabel）。
2. **帶內洗列**：同一個「橫帶 (band)」內的列互換。
3. **洗橫帶**：整條橫帶之間互換。
4. **堆內洗行 / 洗直堆**：對行做對稱操作。
5. （選用）轉置整個盤。

### 2.3 TypeScript 實作

```ts
// 產生一個隨機的 NxN 數獨完整解；base = 宮邊長，N = base²
// base=2 → 4x4；base=3 → 9x9
export function generateSolution(base = 3): number[][] {
  const side = base * base

  // 基底解公式
  const pattern = (r: number, c: number) => (base * (r % base) + Math.floor(r / base) + c) % side

  // Fisher-Yates 洗牌
  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j]!, a[i]!]
    }
    return a
  }

  const baseRange = [...Array(base).keys()] // 0..base-1

  // 列順序：先洗「哪些橫帶」，帶內再洗「哪幾列」
  const rows = shuffle(baseRange).flatMap((band) => shuffle(baseRange).map((r) => band * base + r))
  // 行順序：同理
  const cols = shuffle(baseRange).flatMap((stack) => shuffle(baseRange).map((c) => stack * base + c))
  // 數字對應：1..N 打亂
  const nums = shuffle([...Array(side).keys()].map((n) => n + 1))

  // 依打亂後的列/行順序，套用公式並 relabel
  return rows.map((r) => cols.map((c) => nums[pattern(r, c)]!))
}
```

> 本專案的 4x4 幼兒版直接 `generateSolution(2)` 即可，取代目前寫死的 `answer`。

---

## 3. 演算法 B：隨機回溯（通用，含長方宮）

適用**任意 N**（包含 6x6 這種 2x3 長方宮，樣式法較不直觀時）。缺點是最壞情況較慢，但對小盤完全沒問題。

### 步驟

1. **先填對角線上的宮**：對角線的宮彼此不共列、不共行，可各自獨立填入 1~N 的隨機排列 → 加速收斂。
2. **回溯填其餘格子**：逐格嘗試，套用「列/行/宮皆未出現」檢查；卡住就回退換數字（Las Vegas 隨機化）。

### 虛擬碼

```
fill(grid):
  找第一個空格 (r, c)；若無 → 完成
  for v in shuffle(1..N):
    if v 在該列/行/宮都合法:
      grid[r][c] = v
      if fill(grid): return true   # 遞迴成功
      grid[r][c] = 0               # 回溯
  return false
```

先填對角宮再回溯，是產生完整解最常見的通用作法。

---

## 4. 兩法比較

| 面向       | A 種子樣式+洗牌        | B 隨機回溯         |
| ---------- | ---------------------- | ------------------ |
| 複雜度     | O(N²)，無回溯          | 最壞指數，實務尚可 |
| 保證合法   | ✅ 天生合法            | ✅ 靠檢查          |
| 支援長方宮 | 需調整公式             | ✅ 直接支援        |
| 均勻隨機   | 近似（受變換集合限制） | 較接近均勻         |
| 適用       | 標準正方宮、要快       | 任意 N、長方宮     |

**本專案結論**：4x4 幼兒版用**演算法 A (`base=2`)** 最簡單快速。

---

## 附註：出題（挖空）

以上只產生「完整解」。**出題**是另一步：從完整解隨機拿掉若干格（本專案的 `holes` mask）。若要保證「唯一解」，需在每次挖空後用 solver 檢查解的數量是否仍為 1 —— 幼兒版不追求唯一解，可略過。

---

## 參考來源

- [Sudoku Generator Algorithm — 101 Computing](https://www.101computing.net/sudoku-generator-algorithm/)
- [Sudoku Backtracking algorithm and visualization — Analytics Vidhya](https://medium.com/analytics-vidhya/sudoku-backtracking-algorithm-and-visualization-75adec8e860c)
- [Random Latin squares and Sudoku designs generation — arXiv:1305.3697](https://arxiv.org/pdf/1305.3697)
- [Latin Square Solver / Generator — dcode.fr](https://www.dcode.fr/latin-square)

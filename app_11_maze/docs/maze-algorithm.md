# 產生 N×M 格狀迷宮的數學模型與演算法

## 1. 數學模型

一個「格狀迷宮」在數學上是**格點圖 (grid graph) 的生成樹 (spanning tree)**：

- 把 N×M 個格子當成**圖**：每格 = 一個節點 (node)；相鄰兩格之間 = 一條可能的邊 (edge)。
- 「拆掉兩格之間的牆」= 連一條邊；「保留牆」= 不連。
- 大多數迷宮要的是 **perfect maze (完美迷宮)**：任兩格之間**恰好一條路徑**、無迴圈、全部連通。這在圖論上正好是格點圖的**生成樹**。

| 名詞 | 對應 | 說明 |
| --- | --- | --- |
| 格子 cell | 節點 node | N×M 個 |
| 相鄰格 | 潛在邊 edge | 上/右/下/左 4 個方向 |
| 拆牆 carve | 加入生成樹的邊 | 恰好 `N*M - 1` 條 |
| 死路 dead-end | 度數 1 的節點 | 只有一個開口 |

> perfect maze 恰好 `N*M - 1` 道被拆的牆（生成樹邊數 = 節點數 − 1）。若刻意多拆幾道牆製造迴圈，就變成 **braid maze (有環迷宮)**，難度較低、路線較多。

---

## 2. 牆的資料表示（呼應「每格畫小正方形 + border 當牆」）

每格存 4 面牆的有無，最直覺：

```ts
interface Cell {
  top: boolean // 是否有上牆
  right: boolean
  bottom: boolean
  left: boolean
}
```

**關鍵陷阱**：A 的右牆 = B 的左牆，是**同一道牆**。

- **拆牆時要兩邊一起改**：拆 A/B 之間的牆 → `A.right = false` 且 `B.left = false`，否則畫面會一邊有牆一邊沒牆。
- **畫 border 時避免雙倍粗**：相鄰兩格若各自畫自己的 border，共用邊會被畫兩次（線變兩倍粗）。常見解法：
  1. 每格只畫 **top + left** 兩條，最外圈再補畫最右、最下 → 每道牆恰好畫一次；或
  2. 用 CSS grid + `border` 搭配 `margin: -1px` 讓相鄰 border 重疊。

---

## 3. 演算法 A：Recursive Backtracker / DFS（推薦，O(N·M)）

迷宮版的深度優先搜尋。**好寫、好看、保證 perfect maze**，本專案首選。

### 步驟

1. 任選一格為起點，標記為已訪。
2. 看目前這格的鄰居，若有**尚未訪問**的：隨機挑一個 → 拆掉兩格之間的牆 → 移動過去 → 標記已訪（把目前格推入堆疊）。
3. 若四周鄰居都訪過（走到死路）：從堆疊**回溯 (backtrack)** 到上一個還有未訪鄰居的格子。
4. 堆疊清空 → 全部格子皆已訪，完成。

> 風格：長走廊、彎繞多、死路相對少，視覺上像「一條主幹不斷分岔」，很適合教育/遊戲用途。

### 3.1 TypeScript 實作（迴圈 + 顯式堆疊，避免大迷宮爆 call stack）

```ts
// 產生 rows×cols 的 perfect maze；回傳每格 4 面牆的狀態
// 走訪順序用顯式 stack，遞迴版在 100×100 以上可能觸發 Maximum call stack
export interface Cell {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

type Dir = 'top' | 'right' | 'bottom' | 'left'

const OPPOSITE: Record<Dir, Dir> = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }
const DELTA: Record<Dir, [number, number]> = { top: [-1, 0], right: [0, 1], bottom: [1, 0], left: [0, -1] }

export function generateMaze(rows: number, cols: number): Cell[][] {
  // 初始：每格四面皆有牆
  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ top: true, right: true, bottom: true, left: true }))
  )
  const visited = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false))

  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j]!, a[i]!]
    }
    return a
  }

  const stack: [number, number][] = [[0, 0]]
  visited[0]![0] = true

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1]!
    // 找未訪問的鄰居
    const neighbors = (['top', 'right', 'bottom', 'left'] as Dir[])
      .map((dir) => ({ dir, nr: r + DELTA[dir][0], nc: c + DELTA[dir][1] }))
      .filter(({ nr, nc }) => nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr]![nc])

    if (neighbors.length === 0) {
      stack.pop() // 死路 → 回溯
      continue
    }

    const { dir, nr, nc } = shuffle(neighbors)[0]!
    // 拆牆：兩邊一起拆
    grid[r]![c]![dir] = false
    grid[nr]![nc]![OPPOSITE[dir]] = false
    visited[nr]![nc] = true
    stack.push([nr, nc])
  }

  return grid
}
```

---

## 4. 其他經典演算法（風格差異）

| 演算法 | 風格 | 難度 | 備註 |
| --- | --- | --- | --- |
| **Recursive Backtracker (DFS)** | 長走廊、彎繞、死路少 | 易 | 本專案首選 |
| **Randomized Prim** | 短分岔、死路多、灌木叢感 | 中 | 維護「邊界牆表」隨機挑 |
| **Randomized Kruskal** | 均勻、規律 | 中 | 需 union-find (DSU) 判連通 |
| **Wilson / Aldous-Broder** | 無偏 (uniform spanning tree) | 難 | 統計上最公平但慢 |
| **Eller's** | 逐列生成 | 難 | O(1) 記憶體、可產生無限長迷宮 |
| **Recursive Division** | 用「加牆」切矩形，而非「挖路」 | 中 | 產生明顯的房間感 |
| **Binary Tree / Sidewinder** | 有明顯對角偏向 | 極易 | trivial 但視覺偏頗 |

> Prim 與 Kruskal 都是最小生成樹 (MST) 演算法套在隨機權重上；DFS 則因「盡量往深走」而產生長走廊。要不同視覺風格時可換演算法，資料結構（4 面牆）不用改。

---

## 5. 附註：解迷宮 / 找路徑

以上只**產生**迷宮。若要**自動解**（標出起點到終點的路）：

- perfect maze 因無迴圈，**任何** DFS/BFS 都能找到唯一路徑；BFS 額外保證最短。
- 有環的 braid maze 要用 BFS 或 A\* 才能保證最短路。

---

## 6. 本專案結論

- N×M 迷宮用**演算法 A（Recursive Backtracker）**最划算：~40 行、O(N·M)、產出好看、保證 perfect maze。
- 資料層直接用「每格 4 面牆」的 `Cell[][]`，畫牆時記得**同一道牆只畫一次**、**拆牆兩邊一起改**。
- 之後若想調難度：拆多幾道牆變 braid maze（簡單）、或換 Prim（死路多、較難）。

---

## 參考來源

- [Maze generation algorithm — Wikipedia](https://en.wikipedia.org/wiki/Maze_generation_algorithm)
- [Maze Generation: Recursive Backtracking — Jamis Buck](https://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking)（作者著有《Mazes for Programmers》）
- [Maze Generation Algorithms: A Comparative Research — SciTePress 2025](https://www.scitepress.org/Papers/2025/143608/143608.pdf)
- [互動視覺化：Prim / Kruskal / flood fill — algostructure.com](https://algostructure.com/specials/maze.php)

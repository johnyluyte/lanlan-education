// 產生 rows×cols 的 perfect maze（Recursive Backtracker / DFS）
// 用顯式 stack 走訪，避免大迷宮觸發 Maximum call stack。
// 詳見 docs/maze-algorithm.md
export interface Cell {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

type Dir = 'top' | 'right' | 'bottom' | 'left'

const OPPOSITE: Record<Dir, Dir> = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }
const DELTA: Record<Dir, [number, number]> = { top: [-1, 0], right: [0, 1], bottom: [1, 0], left: [0, -1] }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function generateMaze(rows: number, cols: number): Cell[][] {
  // 初始：每格四面皆有牆
  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ top: true, right: true, bottom: true, left: true }))
  )
  const visited = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false))

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
    // 拆牆：同一道牆兩邊一起拆
    grid[r]![c]![dir] = false
    grid[nr]![nc]![OPPOSITE[dir]] = false
    visited[nr]![nc] = true
    stack.push([nr, nc])
  }

  return grid
}

// 解迷宮：BFS 找左上(0,0)→右下的最短路，回傳沿途座標 [r,c][]。
// perfect maze 無環 → 唯一路徑即最短路。詳見 docs/maze-algorithm.md §5
export function solveMaze(grid: Cell[][]): [number, number][] {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  if (rows === 0 || cols === 0) return []
  const goal: [number, number] = [rows - 1, cols - 1]

  const parent = Array.from({ length: rows }, () => Array<[number, number] | null>(cols).fill(null))
  const visited = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false))
  const queue: [number, number][] = [[0, 0]]
  visited[0]![0] = true

  while (queue.length > 0) {
    const [r, c] = queue.shift()! // PoC 尺寸 ≤40×40，shift O(n) 可接受
    if (r === goal[0] && c === goal[1]) break
    const cell = grid[r]![c]!
    // 只走「牆是開的」方向（牆 = false 才能通過）
    const moves: [boolean, number, number][] = [
      [cell.top, r - 1, c],
      [cell.right, r, c + 1],
      [cell.bottom, r + 1, c],
      [cell.left, r, c - 1]
    ]
    for (const [wall, nr, nc] of moves) {
      if (!wall && nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr]![nc]) {
        visited[nr]![nc] = true
        parent[nr]![nc] = [r, c]
        queue.push([nr, nc])
      }
    }
  }

  if (!visited[goal[0]]![goal[1]]) return [] // perfect maze 理論上必連通，保險
  const path: [number, number][] = []
  let cur: [number, number] | null = goal
  while (cur) {
    path.push(cur)
    cur = parent[cur[0]]![cur[1]]
  }
  return path.reverse()
}

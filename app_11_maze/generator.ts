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

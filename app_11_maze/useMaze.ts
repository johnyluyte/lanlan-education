import { ref, shallowRef, computed, watch } from 'vue'
import { generateMaze, braidMaze, solveMaze, type Cell } from './generator'

const MIN = 2
const MAX = 40

const clamp = (n: number) => Math.min(MAX, Math.max(MIN, Math.round(n || MIN)))

export type Difficulty = 'easy' | 'medium' | 'hard'

// 難度 → braiding 係數（打通死路率）。越高越簡單；hard=0 為純完美迷宮。
const BRAID: Record<Difficulty, number> = { easy: 0.7, medium: 0.35, hard: 0 }

// 供 UI 迴圈用的難度選項（value + 中文標籤）
export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '簡單' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困難' },
]

export function useMaze() {
  const rows = ref(12)
  const cols = ref(18)
  const difficulty = ref<Difficulty>('medium')

  // 依目前尺寸與難度產生一張迷宮：先 DFS 完美迷宮，再依難度 braiding
  const buildGrid = () => {
    const g = generateMaze(clamp(rows.value), clamp(cols.value))
    braidMaze(g, BRAID[difficulty.value])
    return g
  }

  const grid = shallowRef<Cell[][]>(buildGrid())
  const showSolution = ref(true)

  // showSolution 開啟時算最短路，回傳「有序」座標陣列（SVG polyline 需依序連線）
  const solutionPath = computed<[number, number][]>(() => (showSolution.value ? solveMaze(grid.value) : []))

  const toggleSolution = () => {
    showSolution.value = !showSolution.value
  }

  const reroll = () => {
    grid.value = buildGrid()
  }

  // 改尺寸或難度 → 自動重生一張新迷宮（尺寸先 clamp 回合法範圍）
  // solutionPath 是 computed，會跟著新 grid 自動重算
  watch([rows, cols, difficulty], () => {
    const r = clamp(rows.value)
    const c = clamp(cols.value)
    if (r !== rows.value) rows.value = r
    if (c !== cols.value) cols.value = c
    grid.value = buildGrid()
  })

  return {
    rows,
    cols,
    difficulty,
    grid,
    reroll,
    showSolution,
    solutionPath,
    toggleSolution,
    MIN,
    MAX,
  }
}

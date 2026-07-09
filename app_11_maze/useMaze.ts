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

  // showSolution 開啟時算最短路，轉成 `${r},${c}` → 步序 index 的 Map，
  // 供 template O(1) 查（.has 判在不在路徑上；.get 取步序做漸層）
  const solutionIndex = computed<Map<string, number>>(() => {
    if (!showSolution.value) return new Map()
    return new Map(solveMaze(grid.value).map(([r, c], i) => [`${r},${c}`, i]))
  })
  const solutionLength = computed(() => solutionIndex.value.size)

  const toggleSolution = () => {
    showSolution.value = !showSolution.value
  }

  const reroll = () => {
    grid.value = buildGrid()
  }

  const setDifficulty = (d: Difficulty) => {
    difficulty.value = d
    grid.value = buildGrid()
  }

  // 改尺寸 → 自動重生一張新迷宮（尺寸先 clamp 回合法範圍），沿用目前難度
  // solutionIndex 是 computed，會跟著新 grid 自動重算，不需手動清
  watch([rows, cols], () => {
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
    setDifficulty,
    grid,
    reroll,
    showSolution,
    solutionIndex,
    solutionLength,
    toggleSolution,
    MIN,
    MAX,
  }
}

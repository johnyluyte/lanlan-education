import { ref, shallowRef, computed, watch } from 'vue'
import { generateMaze, solveMaze, type Cell } from './generator'

const MIN = 2
const MAX = 40

const clamp = (n: number) => Math.min(MAX, Math.max(MIN, Math.round(n || MIN)))

export function useMaze() {
  const rows = ref(12)
  const cols = ref(18)
  const grid = shallowRef<Cell[][]>(generateMaze(rows.value, cols.value))
  const showSolution = ref(true)

  // showSolution 開啟時算最短路，轉成 `${r},${c}` key 集合供 template O(1) 查
  const solutionSet = computed<Set<string>>(() => {
    if (!showSolution.value) return new Set()
    return new Set(solveMaze(grid.value).map(([r, c]) => `${r},${c}`))
  })

  const toggleSolution = () => {
    showSolution.value = !showSolution.value
  }

  const reroll = () => {
    grid.value = generateMaze(clamp(rows.value), clamp(cols.value))
  }

  // 改尺寸 → 自動重生一張新迷宮（尺寸先 clamp 回合法範圍）
  // solutionSet 是 computed，會跟著新 grid 自動重算，不需手動清
  watch([rows, cols], () => {
    const r = clamp(rows.value)
    const c = clamp(cols.value)
    if (r !== rows.value) rows.value = r
    if (c !== cols.value) cols.value = c
    grid.value = generateMaze(r, c)
  })

  return { rows, cols, grid, reroll, showSolution, solutionSet, toggleSolution, MIN, MAX }
}

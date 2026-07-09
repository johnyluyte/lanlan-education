import { ref, shallowRef, watch } from 'vue'
import { generateMaze, type Cell } from './generator'

const MIN = 2
const MAX = 40

const clamp = (n: number) => Math.min(MAX, Math.max(MIN, Math.round(n || MIN)))

export function useMaze() {
  const rows = ref(12)
  const cols = ref(18)
  const grid = shallowRef<Cell[][]>(generateMaze(rows.value, cols.value))

  const reroll = () => {
    grid.value = generateMaze(clamp(rows.value), clamp(cols.value))
  }

  // 改尺寸 → 自動重生一張新迷宮（尺寸先 clamp 回合法範圍）
  watch([rows, cols], () => {
    const r = clamp(rows.value)
    const c = clamp(cols.value)
    if (r !== rows.value) rows.value = r
    if (c !== cols.value) cols.value = c
    grid.value = generateMaze(r, c)
  })

  return { rows, cols, grid, reroll, MIN, MAX }
}

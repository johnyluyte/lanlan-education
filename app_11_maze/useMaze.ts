import { ref, shallowRef, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { generateMaze, braidMaze, solveMaze, makeRng, type Cell } from './generator'

const MIN = 2
const MAX = 40

const clamp = (n: number) => Math.min(MAX, Math.max(MIN, Math.round(n || MIN)))

// 隨機產生一個短 seed 字串（換地圖時用）
const randomSeed = () => Math.random().toString(36).slice(2, 8)

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

  // seed 與網址 ?seed=xxx 雙向同步，方便分享地圖。網址有 seed 就用它，否則隨機。
  const route = useRoute()
  const router = useRouter()
  const seed = ref<string>(typeof route.query.seed === 'string' && route.query.seed ? route.query.seed : randomSeed())

  // 依目前 seed/尺寸/難度產生一張迷宮：先 DFS 完美迷宮，再依難度 braiding。
  // 全程用同一條種子化 rng → 可重現。
  const buildGrid = () => {
    const rng = makeRng(seed.value)
    const g = generateMaze(clamp(rows.value), clamp(cols.value), rng)
    braidMaze(g, BRAID[difficulty.value], rng)
    return g
  }

  const grid = shallowRef<Cell[][]>(buildGrid())
  const showSolution = ref(true)

  // showSolution 開啟時算最短路，回傳「有序」座標陣列（SVG polyline 需依序連線）
  const solutionPath = computed<[number, number][]>(() => (showSolution.value ? solveMaze(grid.value) : []))

  const toggleSolution = () => {
    showSolution.value = !showSolution.value
  }

  // 換一張迷宮 = 換一個隨機 seed（下方 watch 會重生）
  const reroll = () => {
    seed.value = randomSeed()
  }

  // 改 seed/尺寸/難度 → 自動重生一張新迷宮（尺寸先 clamp 回合法範圍）
  // solutionPath 是 computed，會跟著新 grid 自動重算
  watch([seed, rows, cols, difficulty], () => {
    const r = clamp(rows.value)
    const c = clamp(cols.value)
    if (r !== rows.value) rows.value = r
    if (c !== cols.value) cols.value = c
    grid.value = buildGrid()
  })

  // seed → 網址（用 replace 不灌爆歷史；初始也寫一次，讓連結一開即可分享）
  watch(
    seed,
    (v) => {
      if (route.query.seed !== v) router.replace({ query: { ...route.query, seed: v } })
    },
    { immediate: true },
  )

  // 網址 → seed（使用者上一頁/下一頁或貼分享連結時同步回來）
  watch(
    () => route.query.seed,
    (q) => {
      if (typeof q === 'string' && q && q !== seed.value) seed.value = q
    },
  )

  return {
    rows,
    cols,
    difficulty,
    seed,
    grid,
    reroll,
    showSolution,
    solutionPath,
    toggleSolution,
    MIN,
    MAX,
  }
}

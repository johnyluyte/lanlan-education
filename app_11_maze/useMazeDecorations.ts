import { ref, computed, type Ref } from 'vue'
import { makeRng, type Cell } from './generator'

// 裝飾圖層 composable：管理「哪些格放黃圓」。
// 自有狀態 density（每格放圓機率），未來可再擴充：開關圖層、收集品狀態、形狀/顏色清單…
export function useMazeDecorations(grid: Ref<Cell[][]>, seed: Ref<string>) {
  const density = ref(0.045) // 每格放黃圓的機率

  // 用獨立的種子化 rng（seed + ':deco'）隨機挑格 → 同 seed 必同裝飾。
  // 避開起點(0,0)與終點(右下)以免蓋住標記。
  const decorations = computed<[number, number][]>(() => {
    const R = grid.value.length
    const C = grid.value[0]?.length ?? 0
    const rng = makeRng(seed.value + ':deco')
    const cells: [number, number][] = []
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const isStart = r === 0 && c === 0
        const isEnd = r === R - 1 && c === C - 1
        if (!isStart && !isEnd && rng() < density.value) cells.push([r, c])
      }
    }
    return cells
  })

  return { decorations, density }
}

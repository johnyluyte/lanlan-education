<script setup lang="ts">
  // 完整表格繪製：SVG 兩圖層（框線 → 方塊），疊序 = 文件順序，不用 z-index。
  // 複製自 app_20_imitate_dot/ImitateDotBoard.vue，獨立成自己的元件方便日後修改。
  import { computed } from 'vue'
  import type { CubeKind } from './cubeKind'

  const props = defineProps<{
    rows: number
    cols: number
    cellSize: number
    density: number // 每格出現方塊的機率
    cubeKinds: CubeKind[] // 固定 4 格，每格自帶色碼 + 相對權重
  }>()

  const STROKE = 2 // 框線寬

  // SVG 尺寸；外框線的 stroke 有一半會超出邊界，故 viewBox 往外留半個 stroke
  const dims = computed(() => ({ w: props.cols * props.cellSize, h: props.rows * props.cellSize }))
  const viewBox = computed(() => `${-STROKE / 2} ${-STROKE / 2} ${dims.value.w + STROKE} ${dims.value.h + STROKE}`)

  // 【圖層：框線】每一列、每一行的格線都畫出來，湊成一張完整表格
  const gridD = computed(() => {
    const cell = props.cellSize
    let d = ''
    for (let r = 0; r <= props.rows; r++) d += `M0 ${r * cell}L${dims.value.w} ${r * cell}`
    for (let c = 0; c <= props.cols; c++) d += `M${c * cell} 0L${c * cell} ${dims.value.h}`
    return d
  })

  // 【圖層：方塊】兩階段隨機：先依 density 決定這格要不要出現方塊，再依 cubeKinds 的權重加權抽色碼
  // （權重不需正規化，抽色時除以權重總和即可；權重全 0 則該格不畫方塊）。
  // 只依 rows/cols/density/cubeKinds 重新隨機，改 cellSize 只換算像素位置，
  // 故拆成 cubeCells（邏輯格 + 色碼）→ cubes（像素座標 + 色碼）兩層 computed。
  const cubeCells = computed<{ r: number; c: number; color: string }[]>(() => {
    const total = props.cubeKinds.reduce((sum, kind) => sum + kind.weight, 0)

    const list: { r: number; c: number; color: string }[] = []
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        if (Math.random() >= props.density) continue
        if (total <= 0) continue

        let pick = Math.random() * total
        let color = props.cubeKinds[0]!.color
        for (const kind of props.cubeKinds) {
          pick -= kind.weight
          if (pick <= 0) {
            color = kind.color
            break
          }
        }
        list.push({ r, c, color })
      }
    }
    return list
  })

  const cubes = computed(() => {
    const cell = props.cellSize
    return cubeCells.value.map(({ r, c, color }) => ({ x: c * cell, y: r * cell, color }))
  })
</script>

<template>
  <svg :width="dims.w + STROKE" :height="dims.h + STROKE" :viewBox="viewBox" class="text-gray-800 dark:text-gray-200">
    <!-- 圖層 1：框線 -->
    <path class="layer-grid" :d="gridD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

    <!-- 圖層 2：方塊（四色共用一個圖層，畫成與 cell 等大的正方形） -->
    <g class="layer-cubes">
      <rect v-for="(d, i) in cubes" :key="i" :x="d.x" :y="d.y" :width="cellSize" :height="cellSize" :fill="d.color" />
    </g>
  </svg>
</template>

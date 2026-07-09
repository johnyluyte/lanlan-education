<script setup lang="ts">
  // 完整表格繪製：SVG 兩圖層（框線 → 黃點），疊序 = 文件順序，不用 z-index。
  // 跟迷宮不同，這裡格線恆全部顯示（無牆壁開合邏輯）。
  import { computed } from 'vue'

  const props = defineProps<{
    rows: number
    cols: number
    cellSize: number
    density: number // 每格出現黃點的機率
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

  // 【圖層：黃點】依機率決定每格是否出現黃點；只依 rows/cols/density 重新隨機，
  // 改 cellSize 只換算像素位置、不重新隨機，故拆成 dotCells（邏輯格）→ dots（像素座標）兩層 computed。
  const dotCells = computed<[number, number][]>(() => {
    const list: [number, number][] = []
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        if (Math.random() < props.density) list.push([r, c])
      }
    }
    return list
  })

  const dots = computed(() => {
    const cell = props.cellSize
    return dotCells.value.map(([r, c]) => ({ cx: c * cell + cell / 2, cy: r * cell + cell / 2 }))
  })
</script>

<template>
  <svg :width="dims.w + STROKE" :height="dims.h + STROKE" :viewBox="viewBox" class="text-gray-800 dark:text-gray-200">
    <!-- 圖層 1：框線 -->
    <path class="layer-grid" :d="gridD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

    <!-- 圖層 2：黃點 -->
    <g class="layer-dots">
      <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="cellSize * 0.28" fill="rgb(250 204 21)" />
    </g>
  </svg>
</template>

<script setup lang="ts">
  // 完整表格繪製：SVG 兩圖層（框線 → 黃點），疊序 = 文件順序，不用 z-index。
  // 這裡格線恆全部顯示（無牆壁開合邏輯），每格中心固定畫一顆黃點。
  import { computed } from 'vue'

  const props = defineProps<{
    rows: number
    cols: number
    cellSize: number
    showGrid: boolean
    dotRadius: number // 黃點半徑 (px)，跟 cellSize 分開設定，故不用比例換算
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

  // 【圖層：黃點】每格中心一顆黃色圓點
  const dots = computed(() => {
    const cell = props.cellSize
    const list: { cx: number; cy: number }[] = []
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        list.push({ cx: c * cell + cell / 2, cy: r * cell + cell / 2 })
      }
    }
    return list
  })
</script>

<template>
  <svg :width="dims.w + STROKE" :height="dims.h + STROKE" :viewBox="viewBox" class="text-gray-800 dark:text-gray-200">
    <!-- 圖層 1：框線（預設隱藏，由 showGrid 開關控制） -->
    <path v-if="showGrid" class="layer-grid" :d="gridD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

    <!-- 圖層 2：黃點 -->
    <g class="layer-dots">
      <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
    </g>
  </svg>
</template>

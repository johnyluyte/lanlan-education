<script setup lang="ts">
  // 完整表格繪製：SVG 兩圖層（正方形 → 框線），疊序 = 文件順序，不用 z-index。框線後畫，蓋在正方形上面才不會被相鄰同色正方形糊掉。
  // 純渲染元件：squareCells 是「哪些格子有正方形」的資料，由 ThreeDBox2DSettings 產生並傳進來，
  // 這樣同一份資料也能被 ThreeDBoxScene 拿去生成對應的 3D cube（動態場景）。
  // 複製自 app_20_imitate_dot/ImitateDotBoard.vue，獨立成自己的元件方便日後修改。
  import { computed } from 'vue'
  import type { SquareCell } from './squareCell'

  const props = defineProps<{
    rows: number
    cols: number
    cellSize: number
    squareCells: SquareCell[]
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

  // 邏輯格（row/col）換算成像素座標，供畫正方形跟數字用
  const squares = computed(() => {
    const cell = props.cellSize
    return props.squareCells.map(({ row, col, color, value }) => ({ x: col * cell, y: row * cell, color, value }))
  })
</script>

<template>
  <svg :width="dims.w + STROKE" :height="dims.h + STROKE" :viewBox="viewBox" class="text-gray-800 dark:text-gray-200">
    <!-- 圖層 1：正方形（四色共用一個圖層，畫成與 cell 等大的正方形） -->
    <g class="layer-squares">
      <rect v-for="(d, i) in squares" :key="i" :x="d.x" :y="d.y" :width="cellSize" :height="cellSize" :fill="d.color" />
    </g>

    <!-- 圖層 2：框線（後畫，蓋在正方形上面，相鄰正方形之間才看得到分隔線） -->
    <path class="layer-grid" :d="gridD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

    <!-- 圖層 3：正方形上的隨機數字 -->
    <g class="layer-square-values">
      <text
        v-for="(d, i) in squares"
        :key="i"
        :x="d.x + cellSize / 2"
        :y="d.y + cellSize / 2"
        text-anchor="middle"
        dominant-baseline="central"
        :font-size="cellSize * 0.55"
        class="fill-gray-900 font-bold select-none"
      >
        {{ d.value }}
      </text>
    </g>
  </svg>
</template>

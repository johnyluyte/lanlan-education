<script setup lang="ts">
  // 完整表格繪製：SVG 四圖層（框線 → 相鄰點連線 → 斜角連線 → 黃點），疊序 = 文件順序，不用 z-index。
  // 這裡格線恆全部顯示（無牆壁開合邏輯），每格中心固定畫一顆黃點。
  import { computed } from 'vue'

  const props = defineProps<{
    rows: number
    cols: number
    cellWidth: number
    cellHeight: number
    showGrid: boolean
    showLines: boolean
    showDiagonals: boolean
    dotRadius: number // 黃點半徑 (px)，跟 cell 尺寸分開設定，故不用比例換算
  }>()

  const STROKE = 2 // 框線寬
  const LINE_STROKE = 3 // 相鄰點連線線寬，跟框線、黃點分開設定
  const LINE_COLOR = 'rgb(59 130 246)' // 相鄰點連線顏色（藍），跟黃點區分
  const DIAGONAL_STROKE = 3 // 斜角連線線寬
  const DIAGONAL_COLOR = 'rgb(34 197 94)' // 斜角連線顏色（綠），跟水平/垂直連線區分

  // SVG 尺寸；外框線的 stroke 有一半會超出邊界，故 viewBox 往外留半個 stroke
  const dims = computed(() => ({ w: props.cols * props.cellWidth, h: props.rows * props.cellHeight }))
  const viewBox = computed(() => `${-STROKE / 2} ${-STROKE / 2} ${dims.value.w + STROKE} ${dims.value.h + STROKE}`)

  // 【圖層：框線】每一列、每一行的格線都畫出來，湊成一張完整表格
  const gridD = computed(() => {
    const cw = props.cellWidth
    const ch = props.cellHeight
    let d = ''
    for (let r = 0; r <= props.rows; r++) d += `M0 ${r * ch}L${dims.value.w} ${r * ch}`
    for (let c = 0; c <= props.cols; c++) d += `M${c * cw} 0L${c * cw} ${dims.value.h}`
    return d
  })

  // 【圖層：相鄰點連線】每個黃點跟右邊、下面垂直/水平相鄰的黃點各連一條線
  const linesD = computed(() => {
    const cw = props.cellWidth
    const ch = props.cellHeight
    let d = ''
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        const cx = c * cw + cw / 2
        const cy = r * ch + ch / 2
        if (c < props.cols - 1) d += `M${cx} ${cy}L${cx + cw} ${cy}` // 水平：接右邊相鄰點
        if (r < props.rows - 1) d += `M${cx} ${cy}L${cx} ${cy + ch}` // 垂直：接下面相鄰點
      }
    }
    return d
  })

  // 【圖層：斜角連線】每個黃點跟右下、左下斜角相鄰的黃點各連一條線
  const diagonalLinesD = computed(() => {
    const cw = props.cellWidth
    const ch = props.cellHeight
    let d = ''
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        const cx = c * cw + cw / 2
        const cy = r * ch + ch / 2
        if (c < props.cols - 1 && r < props.rows - 1) d += `M${cx} ${cy}L${cx + cw} ${cy + ch}` // ↘：右下相鄰點
        if (c > 0 && r < props.rows - 1) d += `M${cx} ${cy}L${cx - cw} ${cy + ch}` // ↙：左下相鄰點
      }
    }
    return d
  })

  // 【圖層：黃點】每格中心一顆黃色圓點
  const dots = computed(() => {
    const cw = props.cellWidth
    const ch = props.cellHeight
    const list: { cx: number; cy: number }[] = []
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        list.push({ cx: c * cw + cw / 2, cy: r * ch + ch / 2 })
      }
    }
    return list
  })
</script>

<template>
  <svg :width="dims.w + STROKE" :height="dims.h + STROKE" :viewBox="viewBox" class="text-gray-800 dark:text-gray-200">
    <!-- 圖層 1：框線（預設隱藏，由 showGrid 開關控制） -->
    <path v-if="showGrid" class="layer-grid" :d="gridD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

    <!-- 圖層 2：相鄰點連線（由 showLines 開關控制） -->
    <path v-if="showLines" class="layer-lines" :d="linesD" fill="none" :stroke="LINE_COLOR" :stroke-width="LINE_STROKE" stroke-linecap="round" />

    <!-- 圖層 3：斜角連線（由 showDiagonals 開關控制） -->
    <path
      v-if="showDiagonals"
      class="layer-diagonals"
      :d="diagonalLinesD"
      fill="none"
      :stroke="DIAGONAL_COLOR"
      :stroke-width="DIAGONAL_STROKE"
      stroke-linecap="round"
    />

    <!-- 圖層 4：黃點 -->
    <g class="layer-dots">
      <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
    </g>
  </svg>
</template>

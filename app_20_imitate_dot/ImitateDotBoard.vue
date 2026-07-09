<script setup lang="ts">
  // 完整表格繪製：SVG 兩圖層（框線 → 點點），疊序 = 文件順序，不用 z-index。
  // 跟迷宮不同，這裡格線恆全部顯示（無牆壁開合邏輯）。
  import { computed } from 'vue'

  const props = defineProps<{
    rows: number
    cols: number
    cellSize: number
    density: number // 每格出現點點的機率
    weightYellow: number
    weightRed: number
    weightGreen: number
    weightBlue: number
  }>()

  const STROKE = 2 // 框線寬

  const COLORS = ['yellow', 'red', 'green', 'blue'] as const
  type DotColor = (typeof COLORS)[number]

  const COLOR_FILL: Record<DotColor, string> = {
    yellow: 'rgb(250 204 21)',
    red: 'rgb(248 113 113)',
    green: 'rgb(74 222 128)',
    blue: 'rgb(96 165 250)',
  }

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

  // 【圖層：點點】兩階段隨機：先依 density 決定這格要不要出現點點，再依顏色權重加權抽色
  // （權重不需正規化，抽色時除以權重總和即可；權重全 0 則該格不畫點）。
  // 只依 rows/cols/density/顏色權重 重新隨機，改 cellSize 只換算像素位置，
  // 故拆成 dotCells（邏輯格 + 顏色）→ dots（像素座標 + 顏色）兩層 computed。
  const dotCells = computed<{ r: number; c: number; color: DotColor }[]>(() => {
    const weights: Record<DotColor, number> = {
      yellow: props.weightYellow,
      red: props.weightRed,
      green: props.weightGreen,
      blue: props.weightBlue,
    }
    const total = COLORS.reduce((sum, color) => sum + weights[color], 0)

    const list: { r: number; c: number; color: DotColor }[] = []
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        if (Math.random() >= props.density) continue
        if (total <= 0) continue

        let pick = Math.random() * total
        let color: DotColor = COLORS[0]
        for (const candidate of COLORS) {
          pick -= weights[candidate]
          if (pick <= 0) {
            color = candidate
            break
          }
        }
        list.push({ r, c, color })
      }
    }
    return list
  })

  const dots = computed(() => {
    const cell = props.cellSize
    return dotCells.value.map(({ r, c, color }) => ({ cx: c * cell + cell / 2, cy: r * cell + cell / 2, color }))
  })
</script>

<template>
  <svg :width="dims.w + STROKE" :height="dims.h + STROKE" :viewBox="viewBox" class="text-gray-800 dark:text-gray-200">
    <!-- 圖層 1：框線 -->
    <path class="layer-grid" :d="gridD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

    <!-- 圖層 2：點點（四色共用一個圖層） -->
    <g class="layer-dots">
      <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="cellSize * 0.28" :fill="COLOR_FILL[d.color]" />
    </g>
  </svg>
</template>

<script setup lang="ts">
  // 跟 SpecialChildDotBoard 幾乎一樣，差別在只畫最外圍（第一/最後一列、第一/最後一行）的點，內部點不顯示。
  import { computed } from 'vue'

  const props = defineProps<{
    rows: number
    cols: number
    cellWidth: number
    cellHeight: number
  }>()

  const DOT_RADIUS = 9 // 黑點半徑 (px)

  const dims = computed(() => ({ w: props.cols * props.cellWidth, h: props.rows * props.cellHeight }))

  const dots = computed(() => {
    const cw = props.cellWidth
    const ch = props.cellHeight
    const list: { cx: number; cy: number }[] = []
    for (let r = 0; r < props.rows; r++) {
      for (let c = 0; c < props.cols; c++) {
        const isOuter = r === 0 || r === props.rows - 1 || c === 0 || c === props.cols - 1
        if (!isOuter) continue
        list.push({ cx: c * cw + cw / 2, cy: r * ch + ch / 2 })
      }
    }
    return list
  })
</script>

<template>
  <svg :width="dims.w" :height="dims.h" :viewBox="`0 0 ${dims.w} ${dims.h}`" class="text-gray-800 dark:text-gray-200">
    <g class="layer-dots">
      <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="DOT_RADIUS" fill="rgb(0 0 0)" />
    </g>
  </svg>
</template>

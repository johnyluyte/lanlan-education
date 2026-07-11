<script setup lang="ts">
  // 表格繪製：SVG 單圖層，每格中心固定畫一顆黃點，不畫格線。
  import { computed } from 'vue'

  const props = defineProps<{
    rows: number
    cols: number
    cellSize: number
    dotRadius: number // 黃點半徑 (px)，跟 cellSize 分開設定，故不用比例換算
  }>()

  const dims = computed(() => ({ w: props.cols * props.cellSize, h: props.rows * props.cellSize }))

  // 每格中心一顆黃色圓點
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
  <svg :width="dims.w" :height="dims.h" :viewBox="`0 0 ${dims.w} ${dims.h}`" class="text-gray-800 dark:text-gray-200">
    <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
  </svg>
</template>

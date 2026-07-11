<script setup lang="ts">
  // 表格繪製：SVG 單圖層，每列固定畫左右兩顆黃點，不畫格線。
  // 用絕對座標定位而非 cell 索引：
  // - 左邊點 x 座標固定不動，右邊點 x = 左邊 x + colGap，調整 colGap 只移動右邊點。
  // - 最上排點 y 座標固定不動，下方各排 y = 最上排 y + r * rowGap，調整 rowGap 只移動下方點，最上排不動。
  import { computed } from 'vue'

  const props = defineProps<{
    rows: number
    colGap: number // 左右點點之間的距離 (px)，只影響右邊點點位置
    rowGap: number // 上下點點之間的距離 (px)，只影響最上排以下的點點位置
    dotRadius: number // 黃點半徑 (px)，跟 colGap/rowGap 分開設定，故不用比例換算
  }>()

  const leftX = computed(() => props.dotRadius) // 左邊點固定座標，不受 colGap 影響
  const rightX = computed(() => leftX.value + props.colGap) // 右邊點座標 = 左邊點 + colGap

  const topY = computed(() => props.dotRadius) // 最上排點固定座標，不受 rowGap 影響

  const dims = computed(() => ({
    w: rightX.value + props.dotRadius,
    h: topY.value + (props.rows - 1) * props.rowGap + props.dotRadius,
  }))

  // 每列固定兩顆黃色圓點：左邊點座標固定、右邊點依 colGap 位移；最上排 y 座標固定、下方各排依 rowGap 位移
  const dots = computed(() => {
    const list: { cx: number; cy: number }[] = []
    for (let r = 0; r < props.rows; r++) {
      const cy = topY.value + r * props.rowGap
      list.push({ cx: leftX.value, cy })
      list.push({ cx: rightX.value, cy })
    }
    return list
  })
</script>

<template>
  <svg :width="dims.w" :height="dims.h" :viewBox="`0 0 ${dims.w} ${dims.h}`" class="text-gray-800 dark:text-gray-200">
    <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
  </svg>
</template>

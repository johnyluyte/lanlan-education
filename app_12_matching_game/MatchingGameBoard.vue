<script setup lang="ts">
  // 表格繪製：SVG 單圖層，每列固定畫左右兩顆黃點，左邊點左側畫 item 圖片、右邊點右側畫 item cName/eName，不畫格線。
  // 用絕對座標定位而非 cell 索引：
  // - 左邊點 x 座標固定不動，右邊點 x = 左邊 x + colGap，調整 colGap 只移動右邊點。
  // - 最上排點 y 座標固定不動，下方各排 y = 最上排 y + r * rowGap，調整 rowGap 只移動下方點，最上排不動。
  // - 列數 M 由 items 筆數決定，不再另外傳 rows。
  import { computed } from 'vue'
  import type { ExampleData } from './example-data'

  const props = defineProps<{
    items: ExampleData[]
    colGap: number // 左右點點之間的距離 (px)，只影響右邊點點位置
    rowGap: number // 上下點點之間的距離 (px)，只影響最上排以下的點點位置
    dotRadius: number // 黃點半徑 (px)，跟 colGap/rowGap 分開設定，故不用比例換算
  }>()

  const IMG_SIZE = 48 // 左側圖片固定邊長 (px)，跟 dotRadius 分開設定，調整點點半徑不影響圖片大小
  const IMG_GAP = 8 // 左邊圖片與左邊點之間的間距 (px)
  const TEXT_GAP = 8 // 右邊點與文字之間的間距 (px)
  const TEXT_AREA_WIDTH = 160 // 右側預留給 cName/eName 文字的寬度 (px)

  const leftX = computed(() => IMG_SIZE + IMG_GAP + props.dotRadius) // 左邊點固定座標，已預留左側圖片空間，不受 colGap 影響
  const rightX = computed(() => leftX.value + props.colGap) // 右邊點座標 = 左邊點 + colGap

  const imgX = 0 // 左側圖片固定貼齊畫布左緣
  const textX = computed(() => rightX.value + props.dotRadius + TEXT_GAP) // 右側文字固定貼在右邊點之後

  const topY = computed(() => Math.max(props.dotRadius, IMG_SIZE / 2)) // 最上排點固定座標，需容納左側圖片高度，不受 rowGap 影響

  const dims = computed(() => ({
    w: textX.value + TEXT_AREA_WIDTH,
    h: topY.value + (props.items.length - 1) * props.rowGap + Math.max(props.dotRadius, IMG_SIZE / 2),
  }))

  // 每列一筆 item：左邊點 + 左側圖片、右邊點 + 右側文字；左邊點座標固定、右邊點依 colGap 位移；最上排 y 座標固定、下方各排依 rowGap 位移
  const rowsData = computed(() =>
    props.items.map((item, r) => ({
      cy: topY.value + r * props.rowGap,
      item,
    })),
  )
</script>

<template>
  <svg :width="dims.w" :height="dims.h" :viewBox="`0 0 ${dims.w} ${dims.h}`" class="text-gray-800 dark:text-gray-200">
    <template v-for="(d, i) in rowsData" :key="i">
      <image :href="d.item.img" :x="imgX" :y="d.cy - IMG_SIZE / 2" :width="IMG_SIZE" :height="IMG_SIZE" />
      <circle :cx="leftX" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
      <circle :cx="rightX" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
      <text :x="textX" :y="d.cy" dominant-baseline="middle" text-anchor="start" font-size="14" fill="currentColor">
        {{ d.item.cName }} / {{ d.item.eName }}
      </text>
    </template>
  </svg>
</template>

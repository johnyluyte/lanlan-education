<script setup lang="ts">
  // 表格繪製：SVG 單圖層。
  // 水平模式：每列固定畫左右兩顆黃點，左邊點左側畫 item 圖片、右邊點右側畫 item cName/eName，不畫格線。
  // - 左邊點 x 座標固定不動，右邊點 x = 左邊 x + colGap，調整 colGap 只移動右邊點。
  // - 最上排點 y 座標固定不動，下方各排 y = 最上排 y + r * rowGap，調整 rowGap 只移動下方點，最上排不動。
  // 垂直模式：水平佈局整體旋轉 90 度的概念，每欄固定畫上下兩顆黃點，上點上方畫 item 圖片、下點下方畫 item cName/eName（文字本身維持水平書寫，不隨版面轉向）。
  // - 上點 y 座標固定不動，下點 y = 上點 y + colGap，調整 colGap 只移動下點。
  // - 最左欄點 x 座標固定不動，右方各欄 x = 最左欄 x + c * rowGap，調整 rowGap 只移動右方欄，最左欄不動。
  // 列數/欄數 M 由 items 筆數決定，不再另外傳 rows。
  import { computed } from 'vue'
  import type { ExampleData } from './example-data'

  const props = defineProps<{
    items: ExampleData[]
    colGap: number // 兩個區塊之間的距離 (px)：水平模式為左右兩點的 x 距離、垂直模式為上下兩點的 y 距離
    rowGap: number // 相鄰點之間的距離 (px)：水平模式為列與列的 y 距離、垂直模式為欄與欄的 x 距離
    dotRadius: number // 黃點半徑 (px)，跟 colGap/rowGap 分開設定，故不用比例換算
    orientation: 'horizontal' | 'vertical' // 排列方向
  }>()

  const IMG_SIZE = 48 // 圖片固定邊長 (px)，跟 dotRadius 分開設定，調整點點半徑不影響圖片大小
  const IMG_GAP = 8 // 圖片與點之間的間距 (px)
  const TEXT_GAP = 8 // 點與文字之間的間距 (px)
  const TEXT_AREA_WIDTH = 160 // 水平模式：右側預留給 cName/eName 文字的寬度 (px)
  const TEXT_LINE_HEIGHT = 20 // 垂直模式：畫布高度需預留的一行文字高度 (px)

  // 水平模式座標（原有邏輯不變）
  const leftX = computed(() => IMG_SIZE + IMG_GAP + props.dotRadius) // 左邊點固定座標，已預留左側圖片空間，不受 colGap 影響
  const rightX = computed(() => leftX.value + props.colGap) // 右邊點座標 = 左邊點 + colGap

  const imgX = 0 // 左側圖片固定貼齊畫布左緣
  const textX = computed(() => rightX.value + props.dotRadius + TEXT_GAP) // 右側文字固定貼在右邊點之後

  const topYHorizontal = computed(() => Math.max(props.dotRadius, IMG_SIZE / 2)) // 最上排點固定座標，需容納左側圖片高度，不受 rowGap 影響

  const dimsHorizontal = computed(() => ({
    w: textX.value + TEXT_AREA_WIDTH,
    h: topYHorizontal.value + (props.items.length - 1) * props.rowGap + Math.max(props.dotRadius, IMG_SIZE / 2),
  }))

  const WOBBLE_AMPLITUDE = 20 // 第一列連線的基準彎曲幅度 (px)，固定形狀，不隨機
  // 每段彎曲方向與幅度倍率（乘上 WOBBLE_AMPLITUDE）。相鄰數值差距故意放小、正負轉換緩慢，形成一個完整波浪（先上後下），避免相鄰段落幅度落差過大造成轉折感
  const WOBBLE_PATTERN = [0.8, 1.3, 0.5, 39.5, -1.3, -0.8]
  // 段與段之間中途點的 y 偏移倍率（乘上 WOBBLE_AMPLITUDE），只影響中途點、不影響起點/終點；長度須為 WOBBLE_PATTERN.length - 1
  // 數值取相鄰兩段 WOBBLE_PATTERN 的平均並縮小，讓中途點落在前後彎曲趨勢之間，銜接更順
  const WOBBLE_JOINT_PATTERN = [0.6, 0.5, 10, -0.5, -0.6]

  // 左一到右一的多段起伏貝茲曲線：切成數段，每段用二次貝茲彎向上或下；中途點 y 可各自偏移，起點與終點固定在原本水平線上
  const firstRowWobblyPath = computed(() => {
    const y = topYHorizontal.value
    const x1 = leftX.value
    const x2 = rightX.value
    const segmentCount = WOBBLE_PATTERN.length
    const step = (x2 - x1) / segmentCount
    const jointYs = [y, ...WOBBLE_JOINT_PATTERN.map((mult) => y + mult * WOBBLE_AMPLITUDE), y]
    let path = `M ${x1} ${y}`
    for (let i = 0; i < segmentCount; i++) {
      const segStartX = x1 + i * step
      const segEndX = x1 + (i + 1) * step
      const midX = (segStartX + segEndX) / 2
      const segStartY = jointYs[i] ?? y
      const segEndY = jointYs[i + 1] ?? y
      const controlY = (segStartY + segEndY) / 2 + (WOBBLE_PATTERN[i] ?? 0) * WOBBLE_AMPLITUDE
      path += ` Q ${midX} ${controlY}, ${segEndX} ${segEndY}`
    }
    return path
  })

  // 每列一筆 item：左邊點 + 左側圖片、右邊點 + 右側文字；左邊點座標固定、右邊點依 colGap 位移；最上排 y 座標固定、下方各排依 rowGap 位移
  const rowsData = computed(() =>
    props.items.map((item, r) => ({
      cy: topYHorizontal.value + r * props.rowGap,
      item,
    })),
  )

  const secondRowY = computed(() => rowsData.value[1]?.cy)

  // 垂直模式座標（新增）
  const topYVertical = computed(() => IMG_SIZE + IMG_GAP + props.dotRadius) // 上點固定座標，需容納上方圖片高度，不受 colGap 影響
  const bottomYVertical = computed(() => topYVertical.value + props.colGap) // 下點座標 = 上點 + colGap

  const imgY = 0 // 圖片固定貼齊畫布上緣
  const textY = computed(() => bottomYVertical.value + props.dotRadius + TEXT_GAP) // 文字固定貼在下點之後

  const firstX = computed(() => Math.max(props.dotRadius, IMG_SIZE / 2)) // 最左欄點固定座標，需容納圖片寬度，不受 rowGap 影響

  const dimsVertical = computed(() => ({
    w: firstX.value + (props.items.length - 1) * props.rowGap + Math.max(props.dotRadius, IMG_SIZE / 2),
    h: textY.value + TEXT_LINE_HEIGHT,
  }))

  // 每欄一筆 item：上點 + 上方圖片、下點 + 下方文字；最左欄 x 座標固定、右方各欄依 rowGap 位移；上點 y 座標固定、下點依 colGap 位移
  const columnsData = computed(() =>
    props.items.map((item, c) => ({
      cx: firstX.value + c * props.rowGap,
      item,
    })),
  )

  const dims = computed(() => (props.orientation === 'horizontal' ? dimsHorizontal.value : dimsVertical.value))
</script>

<template>
  <svg :width="dims.w" :height="dims.h" :viewBox="`0 0 ${dims.w} ${dims.h}`" class="text-gray-800 dark:text-gray-200">
    <template v-if="orientation === 'horizontal'">
      <path :d="firstRowWobblyPath" fill="none" stroke="rgb(250 204 21)" stroke-width="2" />
      <line
        v-if="secondRowY !== undefined"
        :x1="leftX"
        :y1="secondRowY"
        :x2="rightX"
        :y2="secondRowY"
        stroke="rgb(250 204 21)"
        stroke-width="2"
      />
      <template v-for="(d, i) in rowsData" :key="i">
        <image :href="d.item.img" :x="imgX" :y="d.cy - IMG_SIZE / 2" :width="IMG_SIZE" :height="IMG_SIZE" />
        <circle :cx="leftX" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
        <circle :cx="rightX" :cy="d.cy" :r="dotRadius" fill="rgb(250 204 21)" />
        <text :x="textX" :y="d.cy" dominant-baseline="middle" text-anchor="start" font-size="14" fill="currentColor">
          {{ d.item.cName }} / {{ d.item.eName }}
        </text>
      </template>
    </template>
    <template v-else>
      <template v-for="(d, i) in columnsData" :key="i">
        <image :href="d.item.img" :x="d.cx - IMG_SIZE / 2" :y="imgY" :width="IMG_SIZE" :height="IMG_SIZE" />
        <circle :cx="d.cx" :cy="topYVertical" :r="dotRadius" fill="rgb(250 204 21)" />
        <circle :cx="d.cx" :cy="bottomYVertical" :r="dotRadius" fill="rgb(250 204 21)" />
        <text :x="d.cx" :y="textY" dominant-baseline="hanging" text-anchor="middle" font-size="14" fill="currentColor">
          {{ d.item.cName }} / {{ d.item.eName }}
        </text>
      </template>
    </template>
  </svg>
</template>

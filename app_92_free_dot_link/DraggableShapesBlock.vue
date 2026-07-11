<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import { useDraggable } from '@vueuse/core'

  const container = useTemplateRef<HTMLElement>('container')
  const square = useTemplateRef<HTMLElement>('square')
  const triangle = useTemplateRef<HTMLElement>('triangle')
  const hexagon = useTemplateRef<HTMLElement>('hexagon')
  const rhombus = useTemplateRef<HTMLElement>('rhombus')
  const rhombus30 = useTemplateRef<HTMLElement>('rhombus30')
  const trapezoid = useTemplateRef<HTMLElement>('trapezoid')

  // 各圖形共用同一單邊長，靠邊界框的寬高比換算出實際尺寸
  const SIDE = 100 // px
  const squareSize = { width: `${SIDE}px`, height: `${SIDE}px` }
  const triangleSize = { width: `${SIDE}px`, height: `${(SIDE * Math.sqrt(3)) / 2}px` }
  const hexagonSize = { width: `${SIDE * 2}px`, height: `${SIDE * Math.sqrt(3)}px` }
  // 菱形內角 60°/120°：長對角線 = 2*SIDE*cos(30°)，短對角線 = 2*SIDE*sin(30°)
  const rhombusSize = { width: `${SIDE}px`, height: `${SIDE * Math.sqrt(3)}px` }
  // 菱形內角 30°/150°：長對角線 = 2*SIDE*cos(15°)，短對角線 = 2*SIDE*sin(15°)
  const rhombus30Size = {
    width: `${2 * SIDE * Math.sin((15 * Math.PI) / 180)}px`,
    height: `${2 * SIDE * Math.cos((15 * Math.PI) / 180)}px`,
  }
  // 等腰梯形：上底 = SIDE、下底 = 2*SIDE，腰與下底內角 60°。
  // 邊界框寬度 = 下底，水平偏移比例固定 25%/75%（由上下底比例決定，與角度無關）；
  // 高度 = 水平偏移量 * tan(60°)，水平偏移量 = (下底 - 上底) / 2 = SIDE / 2
  const trapezoidSize = {
    width: `${2 * SIDE}px`,
    height: `${(SIDE / 2) * Math.tan((60 * Math.PI) / 180)}px`,
  }

  // restrictInView：拖拉時圖形不會離開 containerElement 可視範圍，符合「限制在區塊內」需求
  const { style: squareStyle } = useDraggable(square, {
    containerElement: container,
    restrictInView: true,
    initialValue: { x: 20, y: 20 },
  })
  const { style: triangleStyle } = useDraggable(triangle, {
    containerElement: container,
    restrictInView: true,
    initialValue: { x: 140, y: 20 },
  })
  const { style: hexagonStyle } = useDraggable(hexagon, {
    containerElement: container,
    restrictInView: true,
    initialValue: { x: 260, y: 20 },
  })
  const { style: rhombusStyle } = useDraggable(rhombus, {
    containerElement: container,
    restrictInView: true,
    initialValue: { x: 480, y: 20 },
  })
  const { style: rhombus30Style } = useDraggable(rhombus30, {
    containerElement: container,
    restrictInView: true,
    initialValue: { x: 600, y: 20 },
  })
  const { style: trapezoidStyle } = useDraggable(trapezoid, {
    containerElement: container,
    restrictInView: true,
    initialValue: { x: 680, y: 20 },
  })
</script>

<template>
  <div ref="container" class="relative h-128 w-full max-w-7xl rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div ref="square" class="absolute cursor-move touch-none bg-orange-500" :style="[squareStyle, squareSize]" />
    <div
      ref="triangle"
      class="absolute cursor-move touch-none bg-green-500 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"
      :style="[triangleStyle, triangleSize]"
    />
    <div
      ref="hexagon"
      class="absolute cursor-move touch-none bg-yellow-500 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]"
      :style="[hexagonStyle, hexagonSize]"
    />
    <div
      ref="rhombus"
      class="absolute cursor-move touch-none bg-blue-500 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]"
      :style="[rhombusStyle, rhombusSize]"
    />
    <div
      ref="rhombus30"
      class="absolute cursor-move touch-none bg-[#D2B48C] [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]"
      :style="[rhombus30Style, rhombus30Size]"
    />
    <div
      ref="trapezoid"
      class="absolute cursor-move touch-none bg-red-500 [clip-path:polygon(25%_0%,75%_0%,100%_100%,0%_100%)]"
      :style="[trapezoidStyle, trapezoidSize]"
    />
  </div>
</template>

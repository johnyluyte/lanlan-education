<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import { useDraggable } from '@vueuse/core'

  const container = useTemplateRef<HTMLElement>('container')
  const square = useTemplateRef<HTMLElement>('square')
  const triangle = useTemplateRef<HTMLElement>('triangle')
  const hexagon = useTemplateRef<HTMLElement>('hexagon')

  // 三種圖形共用同一單邊長，靠邊界框的寬高比換算出正三角形、正六邊形的實際尺寸
  const SIDE = 100 // px
  const squareSize = { width: `${SIDE}px`, height: `${SIDE}px` }
  const triangleSize = { width: `${SIDE}px`, height: `${(SIDE * Math.sqrt(3)) / 2}px` }
  const hexagonSize = { width: `${SIDE * 2}px`, height: `${SIDE * Math.sqrt(3)}px` }

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
</script>

<template>
  <div ref="container" class="relative h-128 w-full max-w-7xl rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div ref="square" class="absolute cursor-move touch-none bg-blue-500" :style="[squareStyle, squareSize]" />
    <div
      ref="triangle"
      class="absolute cursor-move touch-none bg-green-500 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"
      :style="[triangleStyle, triangleSize]"
    />
    <div
      ref="hexagon"
      class="absolute cursor-move touch-none bg-amber-500 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]"
      :style="[hexagonStyle, hexagonSize]"
    />
  </div>
</template>

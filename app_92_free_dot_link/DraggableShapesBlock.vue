<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import { useDraggable } from '@vueuse/core'

  const container = useTemplateRef<HTMLElement>('container')
  const square = useTemplateRef<HTMLElement>('square')
  const triangle = useTemplateRef<HTMLElement>('triangle')

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
</script>

<template>
  <div ref="container" class="relative h-128 w-full max-w-7xl rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div ref="square" class="absolute h-25 w-25 cursor-move touch-none bg-blue-500" :style="squareStyle" />
    <div
      ref="triangle"
      class="absolute h-25 w-25 cursor-move touch-none bg-green-500 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"
      :style="triangleStyle"
    />
  </div>
</template>

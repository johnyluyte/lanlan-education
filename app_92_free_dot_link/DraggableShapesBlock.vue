<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue'
  import DraggableShape from './DraggableShape.vue'

  const container = useTemplateRef<HTMLElement>('container')
  const selectedId = ref<string | null>(null)

  // 各圖形共用同一單邊長，靠邊界框的寬高比換算出實際尺寸
  const SIDE = 100 // px

  const shapes = [
    {
      id: 'square',
      color: 'bg-orange-500',
      width: SIDE,
      height: SIDE,
      initialX: 20,
      initialY: 20,
    },
    {
      id: 'triangle',
      color: 'bg-green-500',
      clipPath: '[clip-path:polygon(50%_0%,0%_100%,100%_100%)]',
      width: SIDE,
      height: (SIDE * Math.sqrt(3)) / 2,
      initialX: 140,
      initialY: 20,
    },
    {
      id: 'hexagon',
      color: 'bg-yellow-500',
      clipPath: '[clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]',
      width: SIDE * 2,
      height: SIDE * Math.sqrt(3),
      initialX: 260,
      initialY: 20,
    },
    {
      // 菱形內角 60°/120°：長對角線 = 2*SIDE*cos(30°)，短對角線 = 2*SIDE*sin(30°)
      id: 'rhombus-60',
      color: 'bg-blue-500',
      clipPath: '[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]',
      width: SIDE,
      height: SIDE * Math.sqrt(3),
      initialX: 480,
      initialY: 20,
    },
    {
      // 菱形內角 30°/150°：長對角線 = 2*SIDE*cos(15°)，短對角線 = 2*SIDE*sin(15°)
      id: 'rhombus-30',
      color: 'bg-[#D2B48C]',
      clipPath: '[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]',
      width: 2 * SIDE * Math.sin((15 * Math.PI) / 180),
      height: 2 * SIDE * Math.cos((15 * Math.PI) / 180),
      initialX: 600,
      initialY: 20,
    },
    {
      // 等腰梯形：上底 = SIDE、下底 = 2*SIDE，腰與下底內角 60°。
      // 邊界框寬度 = 下底，水平偏移比例固定 25%/75%（由上下底比例決定，與角度無關）；
      // 高度 = 水平偏移量 * tan(60°)，水平偏移量 = (下底 - 上底) / 2 = SIDE / 2
      id: 'trapezoid',
      color: 'bg-red-500',
      clipPath: '[clip-path:polygon(25%_0%,75%_0%,100%_100%,0%_100%)]',
      width: 2 * SIDE,
      height: (SIDE / 2) * Math.tan((60 * Math.PI) / 180),
      initialX: 680,
      initialY: 20,
    },
  ]
</script>

<template>
  <div
    ref="container"
    class="relative h-128 w-full max-w-7xl rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
    @click.self="selectedId = null"
  >
    <DraggableShape
      v-for="shape in shapes"
      :key="shape.id"
      v-bind="shape"
      :container="container"
      :selected="selectedId === shape.id"
      @select="selectedId = shape.id"
    />
  </div>
</template>

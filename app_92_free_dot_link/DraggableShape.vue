<script setup lang="ts">
  import { onBeforeUnmount, ref, useTemplateRef } from 'vue'
  import { useDraggable } from '@vueuse/core'

  const props = defineProps<{
    container: HTMLElement | null
    color: string
    clipPath?: string
    width: number
    height: number
    initialX: number
    initialY: number
    selected: boolean
  }>()

  const emit = defineEmits<{ select: [] }>()

  const wrapper = useTemplateRef<HTMLElement>('wrapper')
  // 旋轉手柄要能獨立於拖拉之外運作，handle 只綁在圖形本體上，手柄按鈕是 wrapper 底下的手足元素、不會觸發拖拉
  const shapeInner = useTemplateRef<HTMLElement>('shapeInner')

  const { style: dragStyle } = useDraggable(wrapper, {
    handle: shapeInner,
    containerElement: () => props.container,
    restrictInView: true,
    initialValue: { x: props.initialX, y: props.initialY },
  })

  const sizeStyle = { width: `${props.width}px`, height: `${props.height}px` }

  const rotation = ref(0)
  let rotating = false

  // 旋轉角度 = 指標位置相對圖形中心的角度，+90 讓手柄在正上方時對應 0 度
  const onRotate = (e: PointerEvent) => {
    if (!rotating || !wrapper.value) return
    const rect = wrapper.value.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotation.value = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90
  }
  const endRotate = () => {
    rotating = false
    window.removeEventListener('pointermove', onRotate)
    window.removeEventListener('pointerup', endRotate)
  }
  const startRotate = () => {
    rotating = true
    window.addEventListener('pointermove', onRotate)
    window.addEventListener('pointerup', endRotate)
  }

  onBeforeUnmount(endRotate)
</script>

<template>
  <div ref="wrapper" class="absolute" :style="[dragStyle, sizeStyle]" @click="emit('select')">
    <div
      ref="shapeInner"
      class="h-full w-full cursor-move touch-none"
      :class="[color, clipPath]"
      :style="{ transform: `rotate(${rotation}deg)` }"
    />
    <button
      v-if="selected"
      type="button"
      aria-label="旋轉"
      class="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-6 cursor-grab touch-none rounded-full border-2 border-white bg-gray-700"
      @pointerdown="startRotate"
    />
    <div v-if="selected" class="pointer-events-none absolute inset-0 ring-2 ring-gray-900 ring-offset-2 dark:ring-white" />
  </div>
</template>

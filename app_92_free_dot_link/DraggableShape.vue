<script setup lang="ts">
  import { computed, onBeforeUnmount, useTemplateRef } from 'vue'
  import { useDraggable } from '@vueuse/core'
  import { useFreeDotLinkStore } from './useFreeDotLinkStore'

  const props = defineProps<{
    id: string
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

  // CSS 沒有內建「旋轉」游標關鍵字，用自訂 SVG 游標圖示取代 cursor-grab
  const ROTATE_CURSOR = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>') 10 10, grab`

  const store = useFreeDotLinkStore()
  store.initShape(props.id, props.initialX, props.initialY)
  const rotation = computed(() => store.shapes[props.id]?.rotation ?? 0)

  const wrapper = useTemplateRef<HTMLElement>('wrapper')
  // 旋轉手柄要能獨立於拖拉之外運作，handle 只綁在圖形本體上，手柄按鈕是 wrapper 底下的手足元素、不會觸發拖拉
  const shapeInner = useTemplateRef<HTMLElement>('shapeInner')

  const { style: dragStyle } = useDraggable(wrapper, {
    handle: shapeInner,
    containerElement: () => props.container,
    restrictInView: true,
    initialValue: { x: props.initialX, y: props.initialY },
    onMove: (pos) => store.setPosition(props.id, pos.x, pos.y),
  })

  const sizeStyle = { width: `${props.width}px`, height: `${props.height}px` }

  let rotating = false
  let startPointerAngle = 0 // 開始拖拉手柄那一刻，指標相對圖形中心的角度
  let startRotation = 0 // 開始拖拉手柄那一刻，圖形當下的旋轉角度

  const pointerAngle = (e: PointerEvent) => {
    if (!wrapper.value) return 0
    const rect = wrapper.value.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
  }
  // 用「指標角度變化量」疊加到拖拉前的旋轉角度，才能接著上次角度繼續轉，而不是每次都跳回以指標位置換算出的絕對角度
  const onRotate = (e: PointerEvent) => {
    if (!rotating) return
    store.setRotation(props.id, startRotation + (pointerAngle(e) - startPointerAngle))
  }
  const endRotate = () => {
    rotating = false
    window.removeEventListener('pointermove', onRotate)
    window.removeEventListener('pointerup', endRotate)
  }
  const startRotate = (e: PointerEvent) => {
    rotating = true
    startPointerAngle = pointerAngle(e)
    startRotation = store.shapes[props.id]?.rotation ?? 0
    window.addEventListener('pointermove', onRotate)
    window.addEventListener('pointerup', endRotate)
  }

  onBeforeUnmount(endRotate)

  // 四個角落的旋轉手柄位置（仿 Photoshop 變形框），靠 Tailwind 的角落定位 + translate 讓手柄中心對齊角落
  const rotateHandleCorners = [
    'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  ]
</script>

<template>
  <div ref="wrapper" class="absolute" :style="[dragStyle, sizeStyle]">
    <div
      ref="shapeInner"
      class="h-full w-full cursor-move touch-none"
      :class="[color, clipPath]"
      :style="{ transform: `rotate(${rotation}deg)` }"
      @click="emit('select')"
    />
    <div v-if="selected" class="pointer-events-none absolute inset-0" :style="{ transform: `rotate(${rotation}deg)` }">
      <div class="absolute inset-0 ring-1 ring-gray-400 ring-offset-2 dark:ring-white" />
      <button
        v-for="corner in rotateHandleCorners"
        :key="corner"
        type="button"
        aria-label="旋轉"
        class="pointer-events-auto absolute h-3 w-3 touch-none rounded-full border-2 border-white bg-gray-700"
        :class="corner"
        :style="{ cursor: ROTATE_CURSOR }"
        @pointerdown="startRotate"
      />
    </div>
  </div>
</template>

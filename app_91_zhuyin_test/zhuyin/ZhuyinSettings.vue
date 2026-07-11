<script setup lang="ts">
  // 控制面板：調整注音符號欄與中文字之間的左右間距。參考 app_14_3d_box/ThreeDBoxSettings.vue 的慣例。
  defineProps<{
    min: number // 間距下限（px）
    max: number // 間距上限（px）
  }>()

  const gapLeft = defineModel<number>('gapLeft', { required: true })
  const gapRight = defineModel<number>('gapRight', { required: true })
  const toneGap = defineModel<number>('toneGap', { required: true })
  const fontSize = defineModel<number>('fontSize', { required: true })
  const lineHeight = defineModel<number>('lineHeight', { required: true })

  // 字級用「相對中文字的倍率（em）」，跟其他 px 間距是不同量級，固定一組合理範圍
  const FONT_SIZE_MIN = 0.2
  const FONT_SIZE_MAX = 1
  const FONT_SIZE_STEP = 0.05
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 p-5">
    <div>
      <span class="text-sm font-medium">注音與中文左邊距離：{{ gapLeft }}px</span>
      <USlider v-model="gapLeft" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">注音與中文右邊距離：{{ gapRight }}px</span>
      <USlider v-model="gapRight" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">一二三四聲與注音的距離：{{ toneGap }}px</span>
      <USlider v-model="toneGap" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">注音字體大小：{{ fontSize }}em</span>
      <USlider v-model="fontSize" :min="FONT_SIZE_MIN" :max="FONT_SIZE_MAX" :step="FONT_SIZE_STEP" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">換行行距：{{ lineHeight }}px</span>
      <USlider v-model="lineHeight" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
  </div>
</template>

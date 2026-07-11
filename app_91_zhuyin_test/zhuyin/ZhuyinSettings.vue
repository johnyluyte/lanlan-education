<script setup lang="ts">
  // 控制面板：調整注音符號欄與中文字之間的左右間距。參考 app_14_3d_box/ThreeDBoxSettings.vue 的慣例。
  defineProps<{
    min: number // 間距下限（px）
    max: number // 間距上限（px）
  }>()

  const gapLeft = defineModel<number>('gapLeft', { required: true })
  const gapRight = defineModel<number>('gapRight', { required: true })
  const toneGap = defineModel<number>('toneGap', { required: true })
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <div>
      <span class="text-sm font-medium">注音與中文左邊距離：{{ gapLeft }}px</span>
      <USlider v-model="gapLeft" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">注音與中文右邊距離：{{ gapRight }}px</span>
      <USlider v-model="gapRight" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">一、二、三、四聲與左邊注音的距離：{{ toneGap }}px</span>
      <USlider v-model="toneGap" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
  </div>
</template>

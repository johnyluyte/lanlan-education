<script setup lang="ts">
  // 控制面板：M（列數）、左右點點之間的距離、上下點點之間的距離。全部用 v-model 雙向綁定。
  defineProps<{
    min: number // rows 下限
    max: number // rows 上限
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const colGap = defineModel<number>('colGap', { required: true })
  const rowGap = defineModel<number>('rowGap', { required: true })
  const dotRadius = defineModel<number>('dotRadius', { required: true })

  // 純 UI 範圍常數
  const COL_GAP_MIN = 12
  const COL_GAP_MAX = 640
  const ROW_GAP_MIN = 12
  const ROW_GAP_MAX = 128
  const DOT_RADIUS_MIN = 4
  const DOT_RADIUS_MAX = 48
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <div>
      <span class="text-sm font-medium">列數 M (rows)：{{ rows }}</span>
      <USlider v-model="rows" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">左右點點之間的距離 (px)：{{ colGap }}</span>
      <USlider v-model="colGap" :min="COL_GAP_MIN" :max="COL_GAP_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">上下點點之間的距離 (px)：{{ rowGap }}</span>
      <USlider v-model="rowGap" :min="ROW_GAP_MIN" :max="ROW_GAP_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">點點半徑 (px)：{{ dotRadius }}</span>
      <USlider v-model="dotRadius" :min="DOT_RADIUS_MIN" :max="DOT_RADIUS_MAX" :step="1" class="mt-3" />
    </div>
  </div>
</template>

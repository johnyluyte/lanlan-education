<script setup lang="ts">
  // 控制面板：M（列數）、N（行數）、格子寬、格子高。全部用 v-model 雙向綁定。
  defineProps<{
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })
  const cellWidth = defineModel<number>('cellWidth', { required: true })
  const cellHeight = defineModel<number>('cellHeight', { required: true })
  const showGrid = defineModel<boolean>('showGrid', { required: true })
  const dotRadius = defineModel<number>('dotRadius', { required: true })

  // 純 UI 範圍常數
  const CELL_MIN = 12
  const CELL_MAX = 128
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
      <span class="text-sm font-medium">行數 N (cols)：{{ cols }}</span>
      <USlider v-model="cols" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">格子寬 (px)：{{ cellWidth }}</span>
      <USlider v-model="cellWidth" :min="CELL_MIN" :max="CELL_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">格子高 (px)：{{ cellHeight }}</span>
      <USlider v-model="cellHeight" :min="CELL_MIN" :max="CELL_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">黃點半徑 (px)：{{ dotRadius }}</span>
      <USlider v-model="dotRadius" :min="DOT_RADIUS_MIN" :max="DOT_RADIUS_MAX" :step="1" class="mt-3" />
    </div>
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">顯示 cell 框線</span>
      <USwitch v-model="showGrid" />
    </div>
  </div>
</template>

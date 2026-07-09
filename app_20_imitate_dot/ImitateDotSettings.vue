<script setup lang="ts">
  // 控制面板：M（列數）、N（行數）、格子寬。全部用 v-model 雙向綁定。
  defineProps<{
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })
  const cellSize = defineModel<number>('cellSize', { required: true })
  const density = defineModel<number>('density', { required: true })
  const weightYellow = defineModel<number>('weightYellow', { required: true })
  const weightRed = defineModel<number>('weightRed', { required: true })
  const weightGreen = defineModel<number>('weightGreen', { required: true })
  const weightBlue = defineModel<number>('weightBlue', { required: true })

  // 純 UI 範圍常數
  const CELL_MIN = 8
  const CELL_MAX = 64
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <div>
      <span class="text-sm font-medium">列數 M (rows)：{{ rows }}</span>
      <USlider v-model="rows" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">行數 N (cols)：{{ cols }}</span>
      <USlider v-model="cols" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">格子寬 (px)：{{ cellSize }}</span>
      <USlider v-model="cellSize" :min="CELL_MIN" :max="CELL_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">點點出現機率：{{ Math.round(density * 100) }}%</span>
      <USlider v-model="density" :min="0" :max="1" :step="0.01" class="mt-3" />
    </div>
    <div class="border-muted flex flex-col gap-4 border-t pt-4">
      <span class="text-sm font-medium">顏色比例（相對權重，不需總和為 1）：</span>
      <div>
        <span class="text-xs text-gray-500">黃色：{{ weightYellow.toFixed(2) }}</span>
        <USlider v-model="weightYellow" :min="0" :max="1" :step="0.01" class="mt-2" />
      </div>
      <div>
        <span class="text-xs text-gray-500">紅色：{{ weightRed.toFixed(2) }}</span>
        <USlider v-model="weightRed" :min="0" :max="1" :step="0.01" class="mt-2" />
      </div>
      <div>
        <span class="text-xs text-gray-500">綠色：{{ weightGreen.toFixed(2) }}</span>
        <USlider v-model="weightGreen" :min="0" :max="1" :step="0.01" class="mt-2" />
      </div>
      <div>
        <span class="text-xs text-gray-500">藍色：{{ weightBlue.toFixed(2) }}</span>
        <USlider v-model="weightBlue" :min="0" :max="1" :step="0.01" class="mt-2" />
      </div>
    </div>
  </div>
</template>

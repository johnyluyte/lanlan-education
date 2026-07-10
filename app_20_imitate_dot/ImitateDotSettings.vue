<script setup lang="ts">
  // 控制面板：M（列數）、N（行數）、格子寬。全部用 v-model 雙向綁定。
  import type { DotKind } from './dotKind'

  defineProps<{
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()
  const emit = defineEmits<{
    regenerate: []
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })
  const cellSize = defineModel<number>('cellSize', { required: true })
  const density = defineModel<number>('density', { required: true })
  // 固定 4 格：每格自帶色碼（色塊點開 UColorPicker）+ 權重（USlider）。dotKinds 是同一個 reactive 陣列，
  // 直接改 dotKinds[i].color / .weight 就會同步回 Page，不需另外 emit。
  const dotKinds = defineModel<DotKind[]>('dotKinds', { required: true })

  // 純 UI 範圍常數
  const CELL_MIN = 25
  const CELL_MAX = 64
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
      <span class="text-sm font-medium">格子寬 (px)：{{ cellSize }}</span>
      <USlider v-model="cellSize" :min="CELL_MIN" :max="CELL_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">點點出現機率：{{ Math.round(density * 100) }}%</span>
      <USlider v-model="density" :min="0" :max="1" :step="0.01" class="mt-3" />
      <UButton
        icon="i-lucide-refresh-cw"
        label="換一個題目"
        color="neutral"
        variant="soft"
        block
        class="mt-3"
        @click="emit('regenerate')"
      />
    </div>
    <div class="border-muted flex flex-col gap-4 border-t pt-4">
      <span class="text-sm font-medium">顏色欄位（色碼可調，權重為相對值、不需總和為 1）：</span>
      <div v-for="(kind, i) in dotKinds" :key="i" class="flex items-center gap-3">
        <UPopover :content="{ side: 'right', align: 'start' }">
          <UButton
            :aria-label="`調整第 ${i + 1} 個顏色`"
            color="neutral"
            variant="outline"
            square
            class="relative size-9 overflow-hidden"
          >
            <span
              class="absolute inset-1 rounded-sm border border-gray-200 dark:border-gray-700"
              :style="{ backgroundColor: kind.color }"
            />
          </UButton>

          <template #content>
            <div class="p-3">
              <UColorPicker v-model="kind.color" />
            </div>
          </template>
        </UPopover>
        <div class="flex-1">
          <span class="text-xs text-gray-500">權重：{{ kind.weight.toFixed(2) }}</span>
          <USlider v-model="kind.weight" :min="0" :max="1" :step="0.01" class="mt-2" />
        </div>
      </div>
    </div>
  </div>
</template>

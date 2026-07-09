<script setup lang="ts">
  // 迷宮控制面板：難度、尺寸、格子寬、動畫時長、換迷宮、顯示/隱藏解答。
  // 尺寸/格子寬/動畫時長用 v-model 雙向綁定；換迷宮、切換解答以事件回報父層。
  import { DIFFICULTIES, type Difficulty } from './useMaze'

  defineProps<{
    showSolution: boolean
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })
  const cellSize = defineModel<number>('cellSize', { required: true })
  const drawTotal = defineModel<number>('drawTotal', { required: true })
  const difficulty = defineModel<Difficulty>('difficulty', { required: true })

  const emit = defineEmits<{
    reroll: []
    toggleSolution: []
  }>()

  // 純 UI 範圍常數
  const CELL_MIN = 8
  const CELL_MAX = 48
  const DRAW_MIN = 0.2
  const DRAW_MAX = 5
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <div>
      <span class="text-sm font-medium">難度：</span>
      <UFieldGroup orientation="horizontal" class="mt-3">
        <UButton
          v-for="d in DIFFICULTIES"
          :key="d.value"
          :color="difficulty === d.value ? 'primary' : 'neutral'"
          :variant="difficulty === d.value ? 'solid' : 'outline'"
          @click="
            () => {
              difficulty = d.value
            }
          "
        >
          {{ d.label }}
        </UButton>
      </UFieldGroup>
    </div>
    <div>
      <span class="text-sm font-medium">列數 (rows)：{{ rows }}</span>
      <USlider v-model="rows" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">行數 (cols)：{{ cols }}</span>
      <USlider v-model="cols" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">格子寬 (px)：{{ cellSize }}</span>
      <USlider v-model="cellSize" :min="CELL_MIN" :max="CELL_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">解答動畫時長 (秒)：{{ drawTotal.toFixed(1) }}</span>
      <USlider v-model="drawTotal" :min="DRAW_MIN" :max="DRAW_MAX" :step="0.1" class="mt-3" />
    </div>
    <UButton icon="i-lucide-dices" color="primary" block @click="emit('reroll')">換一張迷宮</UButton>
    <UButton
      :icon="showSolution ? 'i-lucide-eye-off' : 'i-lucide-route'"
      color="neutral"
      variant="outline"
      block
      @click="emit('toggleSolution')"
    >
      {{ showSolution ? '隱藏解答' : '顯示解答' }}
    </UButton>
  </div>
</template>

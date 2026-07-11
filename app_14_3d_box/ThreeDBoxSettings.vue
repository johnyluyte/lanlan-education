<script setup lang="ts">
  // 控制面板：M（列數）、N（欄數）。參考 app_20_imitate_dot/ImitateDotSettings.vue 的慣例。
  import { ref } from 'vue'
  import ThreeDBoxCellGrid from './ThreeDBoxCellGrid.vue'
  import type { SquareKind } from './squareKind'

  defineProps<{
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })

  const PREVIEW_CELL_SIZE = 28
  const RANDOM_SQUARE_DENSITY = 0.3

  // 固定 4 個顏色欄位，色碼與權重都可調整。參考 app_20_imitate_dot 的預設黃/紅/綠/藍。
  const squareKinds = ref<SquareKind[]>([
    { color: '#facc15', weight: 1 },
    { color: '#f87171', weight: 1 },
    { color: '#4ade80', weight: 1 },
    { color: '#60a5fa', weight: 1 },
  ])

  // 正方形只在按下按鈕後才出現；density 沒變時 computed 不會重算，故用 key 強制重新隨機
  const previewKey = ref(0)
  const previewDensity = ref(0)

  function randomizeSquares() {
    previewDensity.value = RANDOM_SQUARE_DENSITY
    previewKey.value++
  }
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <div>
      <span class="text-sm font-medium">列數 M (rows)：{{ rows }}</span>
      <USlider v-model="rows" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">欄數 N (cols)：{{ cols }}</span>
      <USlider v-model="cols" :min="min" :max="max" :step="1" class="mt-3" />
    </div>

    <div class="border-muted text-muted border-t pt-4 text-sm">
      <div>M x N 的小方格稱為 Cell</div>
      <div>裡面有顏色+數字的格子稱為 Square</div>
      <div>3D 場景內的正方體稱為 Cube</div>
    </div>

    <div class="border-muted flex flex-col items-center gap-3 border-t pt-4">
      <ThreeDBoxCellGrid
        :key="previewKey"
        :rows="rows"
        :cols="cols"
        :cell-size="PREVIEW_CELL_SIZE"
        :density="previewDensity"
        :square-kinds="previewDensity > 0 ? squareKinds : []"
      />
      <UButton icon="i-lucide-sparkles" label="隨機產生正方形" color="neutral" variant="soft" block @click="randomizeSquares" />
    </div>

    <div class="border-muted flex flex-col gap-4 border-t pt-4">
      <span class="text-sm font-medium">顏色欄位（色碼可調，權重為相對值、不需總和為 1）：</span>
      <div v-for="(kind, i) in squareKinds" :key="i" class="flex items-center gap-3">
        <UPopover :content="{ side: 'right', align: 'start' }">
          <UButton :aria-label="`調整第 ${i + 1} 個顏色`" color="neutral" variant="outline" square class="relative size-9 overflow-hidden">
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

<script setup lang="ts">
  // 控制面板：M（列數）、N（欄數）。參考 app_20_imitate_dot/ImitateDotSettings.vue 的慣例。
  import { ref, watch } from 'vue'
  import ThreeDBoxCellGrid from './ThreeDBoxCellGrid.vue'
  import type { SquareKind } from './squareKind'
  import type { SquareCell } from './squareCell'

  defineProps<{
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })
  // 哪些格子有正方形（座標+色碼+數字）。往上暴露給 Page，讓「動態場景」可以拿同一份資料生成 3D cube。
  const squareCells = defineModel<SquareCell[]>('squareCells', { default: () => [] })

  const PREVIEW_CELL_SIZE = 28
  const RANDOM_SQUARE_DENSITY = 0.3

  const MAX_HEIGHT_LOWER_BOUND = 1
  const MAX_HEIGHT_UPPER_BOUND = 5

  // 「隨機產生正方形」產生的 square 高度（value，疊幾個 cube）上限，範圍 1-5
  const maxHeight = ref(3)

  // 固定 4 個顏色欄位，色碼與權重都可調整。參考 app_20_imitate_dot 的預設黃/紅/綠/藍。
  const squareKinds = ref<SquareKind[]>([
    { color: '#facc15', weight: 1 },
    { color: '#f87171', weight: 1 },
    { color: '#4ade80', weight: 1 },
    { color: '#60a5fa', weight: 1 },
  ])

  // 改變 M/N 後舊的格子座標可能超出新範圍，直接清空比較安全
  watch([rows, cols], () => {
    squareCells.value = []
  })

  function randomizeSquares() {
    const total = squareKinds.value.reduce((sum, kind) => sum + kind.weight, 0)

    const cells: SquareCell[] = []
    for (let row = 0; row < rows.value; row++) {
      for (let col = 0; col < cols.value; col++) {
        if (Math.random() >= RANDOM_SQUARE_DENSITY) continue
        if (total <= 0) continue

        let pick = Math.random() * total
        let color = squareKinds.value[0]!.color
        for (const kind of squareKinds.value) {
          pick -= kind.weight
          if (pick <= 0) {
            color = kind.color
            break
          }
        }
        const value = Math.floor(Math.random() * maxHeight.value) + 1
        cells.push({ row, col, color, value })
      }
    }
    squareCells.value = cells
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
      <ThreeDBoxCellGrid :rows="rows" :cols="cols" :cell-size="PREVIEW_CELL_SIZE" :square-cells="squareCells" />
      <div class="w-full">
        <span class="text-sm font-medium">高度上限：{{ maxHeight }}</span>
        <USlider v-model="maxHeight" :min="MAX_HEIGHT_LOWER_BOUND" :max="MAX_HEIGHT_UPPER_BOUND" :step="1" class="mt-3" />
      </div>
      <UButton icon="i-lucide-sparkles" label="隨機產生正方形" color="neutral" variant="soft" block @click="randomizeSquares" />
    </div>

    <div class="border-muted flex flex-col gap-4 border-t pt-4">
      <span class="text-sm font-medium"
        >顏色欄位（色碼可調，權重為相對值、不需總和為 1）Square 顏色若被使用者用色盤調成不在固定 6 色內的自訂色，3D
        端沒有對應面可用，會退回不轉（綠在上）。：</span
      >
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

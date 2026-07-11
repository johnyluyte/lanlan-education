<script setup lang="ts">
  // 控制面板：M（列數）、N（欄數）。參考 app_20_imitate_dot/ImitateDotSettings.vue 的慣例。
  import { ref } from 'vue'
  import ThreeDBoxCellGrid from './ThreeDBoxCellGrid.vue'
  import type { CubeKind } from './cubeKind'

  defineProps<{
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })

  const PREVIEW_CELL_SIZE = 28
  const RANDOM_CUBE_DENSITY = 0.3
  const YELLOW_CUBE_KIND: CubeKind[] = [{ color: '#facc15', weight: 1 }]

  // 方塊只在按下按鈕後才出現；density 沒變時 computed 不會重算，故用 key 強制重新隨機
  const previewKey = ref(0)
  const previewDensity = ref(0)

  function randomizeCubes() {
    previewDensity.value = RANDOM_CUBE_DENSITY
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
    <div class="border-muted flex flex-col items-center gap-3 border-t pt-4">
      <ThreeDBoxCellGrid
        :key="previewKey"
        :rows="rows"
        :cols="cols"
        :cell-size="PREVIEW_CELL_SIZE"
        :density="previewDensity"
        :cube-kinds="previewDensity > 0 ? YELLOW_CUBE_KIND : []"
      />
      <UButton icon="i-lucide-sparkles" label="隨機產生方塊" color="neutral" variant="soft" block @click="randomizeCubes" />
    </div>
  </div>
</template>

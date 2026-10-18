<script setup lang="ts">
  import { ref } from 'vue'
  import ImitateDotSettings from './ImitateDotSettings.vue'
  import ImitateDotBoard from './ImitateDotBoard.vue'
  import type { DotKind } from './dotKind'

  const MIN = 2
  const MAX = 10

  const rows = ref(4) // M：列數
  const cols = ref(4) // N：行數
  const cellSize = ref(64) // 每格正方形邊長 (px)
  const density = ref(0.3) // 每格出現點點的機率
  const questionKey = ref(0)

  // 固定 4 個顏色欄位，色碼與權重都可在 Settings 調整。預設沿用原本黃/紅/綠/藍，且只有黃色欄位有權重，維持先前的視覺效果。
  const dotKinds = ref<DotKind[]>([
    { color: '#facc15', weight: 1 },
    { color: '#f87171', weight: 1 },
    { color: '#4ade80', weight: 1 },
    { color: '#60a5fa', weight: 1 },
  ])
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <ImitateDotSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-size="cellSize"
      v-model:density="density"
      v-model:dot-kinds="dotKinds"
      :min="MIN"
      :max="MAX"
      @regenerate="questionKey++"
    />

    <!-- 題目 -->
    <ImitateDotBoard :key="questionKey" :rows="rows" :cols="cols" :cell-size="cellSize" :density="density" :dot-kinds="dotKinds" />
    <!-- 給小朋友照著畫 -->
    <ImitateDotBoard :rows="rows" :cols="cols" :cell-size="cellSize" :density="0" :dot-kinds="[]" />
  </div>
</template>

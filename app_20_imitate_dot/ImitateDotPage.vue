<script setup lang="ts">
  import { ref } from 'vue'
  import ImitateDotSettings from './ImitateDotSettings.vue'
  import ImitateDotBoard from './ImitateDotBoard.vue'

  const MIN = 2
  const MAX = 40

  const rows = ref(8) // M：列數
  const cols = ref(8) // N：行數
  const cellSize = ref(32) // 每格正方形邊長 (px)
  const density = ref(0.3) // 每格出現黃點的機率
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <ImitateDotSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-size="cellSize"
      v-model:density="density"
      :min="MIN"
      :max="MAX"
    />

    <ImitateDotBoard :rows="rows" :cols="cols" :cell-size="cellSize" :density="density" />
  </div>
</template>

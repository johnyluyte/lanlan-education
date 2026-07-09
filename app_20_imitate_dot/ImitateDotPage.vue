<script setup lang="ts">
  import { ref } from 'vue'
  import ImitateDotSettings from './ImitateDotSettings.vue'
  import ImitateDotBoard from './ImitateDotBoard.vue'

  const MIN = 2
  const MAX = 40

  const rows = ref(8) // M：列數
  const cols = ref(8) // N：行數
  const cellSize = ref(32) // 每格正方形邊長 (px)
  const density = ref(0.3) // 每格出現點點的機率

  // 有點點時，各色的相對權重（不需總和為 1，畫的時候會正規化）。預設全黃，維持先前的視覺效果。
  const weightYellow = ref(1)
  const weightRed = ref(0)
  const weightGreen = ref(0)
  const weightBlue = ref(0)
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <ImitateDotSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-size="cellSize"
      v-model:density="density"
      v-model:weight-yellow="weightYellow"
      v-model:weight-red="weightRed"
      v-model:weight-green="weightGreen"
      v-model:weight-blue="weightBlue"
      :min="MIN"
      :max="MAX"
    />

    <ImitateDotBoard
      :rows="rows"
      :cols="cols"
      :cell-size="cellSize"
      :density="density"
      :weight-yellow="weightYellow"
      :weight-red="weightRed"
      :weight-green="weightGreen"
      :weight-blue="weightBlue"
    />
  </div>
</template>

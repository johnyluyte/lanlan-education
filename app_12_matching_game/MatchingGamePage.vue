<script setup lang="ts">
  import { ref } from 'vue'
  import MatchingGameSettings from './MatchingGameSettings.vue'
  import MatchingGameBoard from './MatchingGameBoard.vue'

  const MIN = 2
  const MAX = 8

  const rows = ref(3) // M：列數
  const cols = ref(3) // N：行數
  const cellSize = ref(32) // 每格正方形邊長 (px)
  const dotRadius = ref(9) // 黃點半徑 (px)，跟 cellSize 分開設定
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <MatchingGameSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-size="cellSize"
      v-model:dot-radius="dotRadius"
      :min="MIN"
      :max="MAX"
    />

    <MatchingGameBoard :rows="rows" :cols="cols" :cell-size="cellSize" :dot-radius="dotRadius" />
  </div>
</template>

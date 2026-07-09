<script setup lang="ts">
  import { ref } from 'vue'
  import ImitateLineSettings from './ImitateLineSettings.vue'
  import ImitateLineBoard from './ImitateLineBoard.vue'

  const MIN = 2
  const MAX = 40

  const rows = ref(8) // M：列數
  const cols = ref(8) // N：行數
  const cellSize = ref(32) // 每格正方形邊長 (px)
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <ImitateLineSettings v-model:rows="rows" v-model:cols="cols" v-model:cell-size="cellSize" :min="MIN" :max="MAX" />

    <ImitateLineBoard :rows="rows" :cols="cols" :cell-size="cellSize" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ImitateLineSettings from './ImitateLineSettings.vue'
  import ImitateLineBoard from './ImitateLineBoard.vue'

  const MIN = 2
  const MAX = 40

  const rows = ref(3) // M：列數
  const cols = ref(3) // N：行數
  const cellSize = ref(32) // 每格正方形邊長 (px)
  const showGrid = ref(false) // 是否顯示 cell 框線，預設關閉
  const dotRadius = ref(9) // 黃點半徑 (px)，跟 cellSize 分開設定
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <ImitateLineSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-size="cellSize"
      v-model:show-grid="showGrid"
      v-model:dot-radius="dotRadius"
      :min="MIN"
      :max="MAX"
    />

    <ImitateLineBoard :rows="rows" :cols="cols" :cell-size="cellSize" :show-grid="showGrid" :dot-radius="dotRadius" />
  </div>
</template>

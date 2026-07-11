<script setup lang="ts">
  import { ref } from 'vue'
  import ImitateLineSettings from './ImitateLineSettings.vue'
  import ImitateLineBoard from './ImitateLineBoard.vue'

  const MIN = 2
  const MAX = 8

  const rows = ref(3) // M：列數
  const cols = ref(3) // N：行數
  const cellWidth = ref(96) // 每格寬 (px)
  const cellHeight = ref(96) // 每格高 (px)
  const showGrid = ref(false) // 是否顯示 cell 框線，預設關閉
  const showLines = ref(true) // 是否顯示相鄰點連線，預設開啟
  const showDiagonals = ref(true) // 是否顯示斜角連線，預設關閉
  const showOtherLines = ref(true) // 是否顯示其餘連線，預設關閉
  const dotRadius = ref(9) // 黃點半徑 (px)，跟 cell 尺寸分開設定
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <ImitateLineSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-width="cellWidth"
      v-model:cell-height="cellHeight"
      v-model:show-grid="showGrid"
      v-model:show-lines="showLines"
      v-model:show-diagonals="showDiagonals"
      v-model:show-other-lines="showOtherLines"
      v-model:dot-radius="dotRadius"
      :min="MIN"
      :max="MAX"
    />

    <ImitateLineBoard
      :rows="rows"
      :cols="cols"
      :cell-width="cellWidth"
      :cell-height="cellHeight"
      :show-grid="showGrid"
      :show-lines="showLines"
      :show-diagonals="showDiagonals"
      :show-other-lines="showOtherLines"
      :dot-radius="dotRadius"
    />
  </div>
</template>

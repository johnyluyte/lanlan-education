<script setup lang="ts">
  import { ref } from 'vue'
  import SpecialChildDotSettings from './SpecialChildDotSettings.vue'
  import SpecialChildDotBoard from './SpecialChildDotBoard.vue'
  import SpecialChildDotOuterBoard from './SpecialChildDotOuterBoard.vue'
  import SpecialChildDotCornerBoard from './SpecialChildDotCornerBoard.vue'

  const MIN = 2
  const MAX = 16

  const rows = ref(10) // M：列數
  const cols = ref(10) // N：行數
  const cellWidth = ref(36) // 每格寬 (px)
  const cellHeight = ref(36) // 每格高 (px)
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <SpecialChildDotSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-width="cellWidth"
      v-model:cell-height="cellHeight"
      :min="MIN"
      :max="MAX"
    />

    <SpecialChildDotBoard :rows="rows" :cols="cols" :cell-width="cellWidth" :cell-height="cellHeight" />
    <SpecialChildDotOuterBoard :rows="rows" :cols="cols" :cell-width="cellWidth" :cell-height="cellHeight" />
    <SpecialChildDotCornerBoard :rows="rows" :cols="cols" :cell-width="cellWidth" :cell-height="cellHeight" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { exampleData } from './example-data'
  import MatchingGameSettings from './MatchingGameSettings.vue'
  import MatchingGameBoard from './MatchingGameBoard.vue'

  const MIN = 2
  const MAX = 8

  const items = ref(exampleData.slice(0, MAX).map((item) => ({ ...item }))) // 清單，初始取前 MAX 筆，複製 exampleData 避免直接改到原始常數；M：列數由 items 筆數決定
  const colGap = ref(360) // 兩個區塊之間的距離 (px)
  const rowGap = ref(80) // 相鄰點之間的距離 (px)
  const dotRadius = ref(9) // 黃點半徑 (px)，跟 colGap/rowGap 分開設定
  const orientation = ref<'horizontal' | 'vertical'>('horizontal') // 排列方向，垂直模式待後續實作，目前 Board 仍固定畫左右連線
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <MatchingGameSettings
      v-model:items="items"
      v-model:col-gap="colGap"
      v-model:row-gap="rowGap"
      v-model:dot-radius="dotRadius"
      v-model:orientation="orientation"
      :min="MIN"
      :max="MAX"
    />

    <MatchingGameBoard :items="items" :col-gap="colGap" :row-gap="rowGap" :dot-radius="dotRadius" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { exampleData } from './example-data'
  import MatchingGameSettings from './MatchingGameSettings.vue'
  import MatchingGameBoard from './MatchingGameBoard.vue'

  const MIN = 2
  const MAX = 8

  const items = ref(exampleData.slice(0, MAX).map((item) => ({ ...item }))) // 清單，初始取前 MAX 筆，複製 exampleData 避免直接改到原始常數；M：列數由 items 筆數決定
  const colGap = ref(32) // 左右點點之間的距離 (px)
  const rowGap = ref(32) // 上下點點之間的距離 (px)
  const dotRadius = ref(9) // 黃點半徑 (px)，跟 colGap/rowGap 分開設定
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <MatchingGameSettings
      v-model:items="items"
      v-model:col-gap="colGap"
      v-model:row-gap="rowGap"
      v-model:dot-radius="dotRadius"
      :min="MIN"
      :max="MAX"
    />

    <MatchingGameBoard :items="items" :col-gap="colGap" :row-gap="rowGap" :dot-radius="dotRadius" />
  </div>
</template>

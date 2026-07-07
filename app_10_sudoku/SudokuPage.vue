<script setup lang="ts">
  import { computed, ref } from 'vue'
  import SudokuBoard from './SudokuBoard.vue'

  // 唯一資料來源：正確解答（4x4，數字 1~4）
  const answer = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ]

  const HOLE_COUNT = 8 // 要挖空的格子數

  // 從 0~15 隨機挑 HOLE_COUNT 個 flat index（不重複）
  function randomHoles() {
    const all = [...Array(16).keys()] // 0~15
    // Fisher-Yates 洗牌後取前 HOLE_COUNT 個
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = all[i]!
      all[i] = all[j]!
      all[j] = tmp
    }
    return new Set(all.slice(0, HOLE_COUNT))
  }

  // 要挖空的格子（flat index = row * 4 + col）；題目由此遮蓋答案而來
  const holes = ref(randomHoles())

  // 重新出題：重抽 mask
  function reroll() {
    holes.value = randomHoles()
  }

  // 題目：命中 holes 的格子填 0（留空），其餘沿用答案
  const puzzle = computed(() => answer.map((row, r) => row.map((v, c) => (holes.value.has(r * 4 + c) ? 0 : v))))
</script>

<template>
  <div class="flex flex-col items-center gap-8 p-8">
    <UButton icon="i-lucide-shuffle" @click="reroll">固定答案，隨機出題</UButton>

    <div class="flex items-start justify-center gap-12">
      <section>
        <h2 class="mb-4 text-center text-xl font-bold">題目</h2>
        <SudokuBoard :grid="puzzle" />
      </section>

      <section>
        <h2 class="mb-4 text-center text-xl font-bold">解答</h2>
        <SudokuBoard :grid="answer" color="#2563eb" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SudokuBoard from './SudokuBoard.vue'

  // 固定題目：4x4 幼兒數獨（數字只有 1~4），0 代表留空
  const puzzle = [
    [1, 0, 0, 4],
    [0, 4, 1, 0],
    [0, 1, 4, 0],
    [4, 0, 0, 1],
  ]

  // 正確解答
  const answer = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ]
</script>

<template>
  <div class="flex items-start justify-center gap-12 p-8">
    <section>
      <h2 class="mb-4 text-center text-xl font-bold">題目</h2>
      <SudokuBoard :grid="puzzle" />
    </section>

    <section>
      <h2 class="mb-4 text-center text-xl font-bold">解答</h2>
      <SudokuBoard :grid="answer" color="#2563eb" />
    </section>
  </div>
</template>

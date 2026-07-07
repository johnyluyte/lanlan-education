<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import SudokuBoard from './SudokuBoard.vue'
  import { countSolutions, generateSolution } from './sudoku'

  const BASE = 2 // 宮邊長；4x4 幼兒版 → base=2

  // 唯一資料來源：正確解答（4x4，數字 1~4），演算法 A 隨機產生
  const answer = ref(generateSolution(BASE))

  // 換新答案：重新產生一組完整解
  function newAnswer() {
    answer.value = generateSolution(BASE)
  }

  const TOTAL = 16 // 4x4 總格數
  const MIN_SHOWN = 4 // 顯示格子數下限（太少會難以推算解答）

  // 要顯示（不挖空）的格子數，可由 Slider 調整
  const shownCount = ref(8)

  // 從 0~15 隨機挑 count 個 flat index（不重複）作為要挖空的格子
  function randomHoles(count: number) {
    const all = [...Array(TOTAL).keys()] // 0~15
    // Fisher-Yates 洗牌後取前 count 個
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = all[i]!
      all[i] = all[j]!
      all[j] = tmp
    }
    return new Set(all.slice(0, count))
  }

  // 要挖空的格子（flat index = row * 4 + col）；題目由此遮蓋答案而來
  // 挖空數 = 總數 − 顯示數
  const holes = ref(randomHoles(TOTAL - shownCount.value))

  // 重新出題：依目前顯示數重抽 mask
  function reroll() {
    holes.value = randomHoles(TOTAL - shownCount.value)
  }

  // 調整顯示數時自動重抽
  watch(shownCount, reroll)

  // 題目：命中 holes 的格子填 0（留空），其餘沿用答案
  const puzzle = computed(() => answer.value.map((row, r) => row.map((v, c) => (holes.value.has(r * 4 + c) ? 0 : v))))

  // 檢查目前題目是否為「唯一解」；非唯一時老師難以批改，需提醒
  const isUnique = computed(() => countSolutions(puzzle.value, BASE) === 1)
</script>

<template>
  <div class="flex flex-col items-center gap-8 p-8">
    <div class="flex w-64 flex-col gap-2">
      <span class="text-center text-sm font-medium">顯示格子數：{{ shownCount }} / {{ TOTAL }}</span>
      <USlider v-model="shownCount" :min="MIN_SHOWN" :max="TOTAL" :step="1" />
    </div>

    <div class="flex gap-4">
      <UButton icon="i-lucide-dices" color="primary" @click="newAnswer">換新答案</UButton>
      <UButton icon="i-lucide-shuffle" color="neutral" @click="reroll">不調整答案，僅切換題目遮罩</UButton>
    </div>

    <!-- 唯一解檢查：非唯一時老師無法確定標準答案，需老實提醒 -->
    <p v-if="!isUnique" class="flex items-center gap-1 text-sm font-medium text-amber-600">
      在這個題目遮罩下，除了目前答案外，也會有其他的正確解答，請老師注意批改。
      <br />
      若想要確保只有唯一解，請調整「顯示格子數」或換新答案。
    </p>

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

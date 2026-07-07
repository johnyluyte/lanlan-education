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
  <div class="relative flex justify-center p-8">
    <div>
      <div class="flex items-start justify-center gap-12">
        <section>
          <h2 class="mb-4 text-center text-xl font-bold">原始題目(解答)</h2>
          <SudokuBoard :grid="answer" color="#2563eb" />
        </section>

        <section>
          <h2 class="mb-4 text-center text-xl font-bold">遮罩後的題目(給學生寫)</h2>
          <SudokuBoard :grid="puzzle" />
        </section>
      </div>

      <p v-if="!isUnique" class="mt-6 flex items-center gap-1 text-sm font-medium text-amber-600">
        在這個題目遮罩下，除了目前答案外也會有其他的正確解答。
        <br />
        若想要確保只有唯一解，請調整「顯示格子數」或換新答案。
      </p>
    </div>

    <div class="absolute top-8 right-8 flex w-64 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="border-muted border-b pb-2 text-center text-base font-bold">設定</h2>

      <h3 class="text-base">題目</h3>
      <div class="flex flex-col gap-6">
        <div>
          <span class="text-sm font-medium">大小：3 x 3</span>
          <USlider v-model="shownCount" :min="MIN_SHOWN" :max="TOTAL" :step="1" class="mt-3" />
        </div>
        <UButton icon="i-lucide-dices" color="primary" block @click="newAnswer">換新題目</UButton>
      </div>

      <h3 class="mt-6 text-base">遮罩</h3>
      <div class="flex flex-col gap-6">
        <div>
          <span class="text-sm font-medium">顯示格子數：{{ shownCount }} / {{ TOTAL }}</span>
          <USlider v-model="shownCount" :min="MIN_SHOWN" :max="TOTAL" :step="1" class="mt-3" />
        </div>
        <UButton icon="i-lucide-shuffle" color="neutral" block @click="reroll">僅切換遮罩</UButton>
      </div>
    </div>
  </div>
</template>

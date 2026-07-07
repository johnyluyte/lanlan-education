<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import SudokuBoard from './SudokuBoard.vue'
  import { countSolutions, generateSolution } from './sudoku'

  // ── 題目大小 ──
  // base = 宮邊長：2 → 4×4、3 → 9×9。上限暫定 3，因 countSolutions 在更大盤會過慢。
  const MIN_BASE = 2
  const MAX_BASE = 3
  const base = ref(2)
  const side = computed(() => base.value * base.value) // 盤面邊長 N
  const total = computed(() => side.value * side.value) // 總格數 N²
  const minShown = computed(() => side.value) // 顯示下限（太少難以推算）

  // 可選的題目大小（base 值列表）：MIN_BASE..MAX_BASE
  const baseOptions = computed(() => Array.from({ length: MAX_BASE - MIN_BASE + 1 }, (_, i) => MIN_BASE + i))

  // 唯一資料來源：正確解答，演算法 A 隨機產生
  const answer = ref(generateSolution(base.value))

  // 換新題目：以目前大小重新產生一組完整解
  function newAnswer() {
    answer.value = generateSolution(base.value)
  }

  // ── 遮罩（要顯示、不挖空的格子數）──
  const shownCount = ref(8)

  // 從 0..total-1 隨機挑 count 個 flat index（不重複）作為要挖空的格子
  function randomHoles(count: number) {
    const all = [...Array(total.value).keys()]
    // Fisher-Yates 洗牌後取前 count 個
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = all[i]!
      all[i] = all[j]!
      all[j] = tmp
    }
    return new Set(all.slice(0, count))
  }

  // 要挖空的格子（flat index = row * side + col）；挖空數 = 總數 − 顯示數
  const holes = ref(randomHoles(total.value - shownCount.value))

  // 重新出題：依目前顯示數重抽 mask
  function reroll() {
    holes.value = randomHoles(total.value - shownCount.value)
  }

  watch(shownCount, reroll) // 調整顯示數時自動重抽

  // 換大小時：clamp 顯示數到新範圍 → 換新答案 → 重抽遮罩
  watch(base, () => {
    shownCount.value = Math.min(Math.max(shownCount.value, minShown.value), total.value)
    newAnswer()
    reroll()
  })

  // 題目：命中 holes 的格子填 0（留空），其餘沿用答案
  const puzzle = computed(() => answer.value.map((row, r) => row.map((v, c) => (holes.value.has(r * side.value + c) ? 0 : v))))

  // 檢查目前題目是否為「唯一解」；非唯一時老師難以批改，需提醒
  const isUnique = computed(() => countSolutions(puzzle.value, base.value) === 1)
</script>

<template>
  <div class="relative flex justify-center p-8">
    <div>
      <div class="flex items-start justify-center gap-12">
        <section>
          <h2 class="mb-4 text-center text-xl font-bold">原始題目(解答)</h2>
          <SudokuBoard :grid="answer" :base="base" color="#2563eb" />
        </section>

        <section>
          <h2 class="mb-4 text-center text-xl font-bold">遮罩後的題目(給學生寫)</h2>
          <SudokuBoard :grid="puzzle" :base="base" />
        </section>
      </div>

      <p v-if="!isUnique" class="mt-6 flex items-center gap-1 text-sm font-medium text-amber-600">
        在這個題目遮罩下，除了目前答案外也會有其他的正確解答。
        <br />
        若想要確保只有唯一解，請調整「顯示格子數」或「切換遮罩」或「換新題目/答案」。
      </p>
    </div>

    <div class="absolute top-8 left-8 flex w-64 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="border-muted border-b pb-2 text-center text-base font-bold">題目設定</h2>

      <h3 class="text-base">題目</h3>
      <div class="flex flex-col gap-6">
        <div>
          <span class="text-sm font-medium">大小：</span>
          <UFieldGroup orientation="horizontal" class="mt-3 flex-wrap">
            <UButton
              v-for="b in baseOptions"
              :key="b"
              :color="base === b ? 'primary' : 'neutral'"
              :variant="base === b ? 'solid' : 'outline'"
              @click="
                () => {
                  base = b
                }
              "
            >
              {{ b * b }} × {{ b * b }}
            </UButton>
          </UFieldGroup>
        </div>
        <UButton icon="i-lucide-dices" color="primary" block @click="newAnswer">換新題目</UButton>
      </div>

      <h3 class="mt-6 text-base">遮罩</h3>
      <div class="flex flex-col gap-6">
        <div>
          <span class="text-sm font-medium">顯示格子數：{{ shownCount }} / {{ total }}</span>
          <USlider v-model="shownCount" :min="minShown" :max="total" :step="1" class="mt-3" />
        </div>
        <UButton icon="i-lucide-shuffle" color="neutral" block @click="reroll">僅切換遮罩</UButton>
      </div>
    </div>

    <div class="absolute top-8 right-8 flex w-64 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="border-muted border-b pb-2 text-center text-base font-bold">樣式設定</h2>

      <h3 class="text-base">格子尺寸</h3>
      <!-- 之後再做 -->
      <h3 class="text-base">字體大小</h3>
      <!-- 之後再做 -->
      <h3 class="text-base">粗框線寬度</h3>
      <!-- 之後再做 -->
      <h3 class="text-base">細框線寬度</h3>
      <!-- 之後再做 -->
      <h3 class="text-base">數字顏色</h3>
      <!-- 之後再做 -->
    </div>
  </div>
</template>

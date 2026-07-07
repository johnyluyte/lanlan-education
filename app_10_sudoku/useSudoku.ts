import { computed, ref, watch } from 'vue'
import { countSolutions, generateSolution } from './generator'

// 數獨題目的核心狀態與操作。
// 大小(base)、答案(answer)、遮罩(holes) 三者高度耦合（換大小要一起重設），
// 故合為單一 composable 管理，而非硬拆成多個互相依賴的 composable。
export function useSudoku() {
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

  // ── 答案 ──
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

  // 套用目前的「顯示格子數」重抽 mask。
  // 注意：拖曳 slider 只改 shownCount 數字，不會動題目；要呼叫此函式才套用。
  // 這樣拖曳期間不會每 tick 觸發昂貴的 puzzle/countSolutions 重算，避免瀏覽器卡住。
  function reroll() {
    holes.value = randomHoles(total.value - shownCount.value)
  }

  // 換大小時：clamp 顯示數到新範圍 → 換新答案 → 重抽遮罩
  watch(base, () => {
    shownCount.value = Math.min(Math.max(shownCount.value, minShown.value), total.value)
    newAnswer()
    reroll()
  })

  // ── 衍生：題目 & 唯一解 ──
  // 題目：命中 holes 的格子填 0（留空），其餘沿用答案
  const puzzle = computed(() => answer.value.map((row, r) => row.map((v, c) => (holes.value.has(r * side.value + c) ? 0 : v))))

  // 檢查目前題目是否為「唯一解」；非唯一時老師難以批改，需提醒
  const isUnique = computed(() => countSolutions(puzzle.value, base.value) === 1)

  return {
    // 狀態
    base,
    side,
    total,
    minShown,
    baseOptions,
    answer,
    puzzle,
    isUnique,
    shownCount,
    // 操作
    newAnswer,
    reroll,
  }
}

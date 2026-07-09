<script setup lang="ts">
  import { useMaze } from './useMaze'
  import type { Cell } from './generator'

  const { rows, cols, grid, reroll, showSolution, solutionIndex, solutionLength, toggleSolution, MIN, MAX } = useMaze()

  const CELL = 24 // 每格邊長 (px)

  // 依步序回傳彩虹 hue 底色：沿路徑由藍漸變到桃紅
  function pathColor(index: number, len: number) {
    const t = len <= 1 ? 0 : index / (len - 1)
    const hue = 200 + t * 140 // 200°(藍) → 340°(桃紅)
    return `hsl(${hue} 85% 55% / 0.55)`
  }

  // 牆用 border 畫。為避免相鄰兩格把共用牆各畫一次（線變兩倍粗），
  // 每格只畫 top / left；最右欄、最底列再補畫外框的 right / bottom。
  // 這樣每道牆恰好畫一次，粗細一致。詳見 docs/maze-algorithm.md
  function cellStyle(cell: Cell, r: number, c: number) {
    const wall = '2px solid currentColor'
    const none = '2px solid transparent'
    const isStart = r === 0 && c === 0
    const isEnd = r === rows.value - 1 && c === cols.value - 1
    const idx = solutionIndex.value.get(`${r},${c}`)
    const onPath = idx !== undefined && !isStart && !isEnd // 起終點用 class 綠/紅，不設 inline bg
    return {
      width: `${CELL}px`,
      height: `${CELL}px`,
      borderTop: cell.top ? wall : none,
      borderLeft: cell.left ? wall : none,
      borderRight: c === cols.value - 1 && cell.right ? wall : none,
      borderBottom: r === rows.value - 1 && cell.bottom ? wall : none,
      ...(onPath ? { backgroundColor: pathColor(idx, solutionLength.value) } : {}),
    }
  }
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <!-- 控制面板 -->
    <div class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
      <div>
        <span class="text-sm font-medium">列數 (rows)：{{ rows }}</span>
        <USlider v-model="rows" :min="MIN" :max="MAX" :step="1" class="mt-3" />
      </div>
      <div>
        <span class="text-sm font-medium">行數 (cols)：{{ cols }}</span>
        <USlider v-model="cols" :min="MIN" :max="MAX" :step="1" class="mt-3" />
      </div>
      <UButton icon="i-lucide-dices" color="primary" block @click="reroll">換一張迷宮</UButton>
      <UButton :icon="showSolution ? 'i-lucide-eye-off' : 'i-lucide-route'" color="neutral" variant="outline" block @click="toggleSolution">
        {{ showSolution ? '隱藏解答' : '顯示解答' }}
      </UButton>
    </div>

    <!-- 迷宮 -->
    <div class="max-w-full overflow-auto">
      <div
        class="text-gray-800 dark:text-gray-200"
        :style="{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${CELL}px)`, width: 'max-content' }"
      >
        <template v-for="(row, r) in grid" :key="r">
          <div
            v-for="(cell, c) in row"
            :key="`${r}-${c}`"
            class="box-border"
            :class="{
              'bg-green-400/40': r === 0 && c === 0,
              'bg-red-400/40': r === rows - 1 && c === cols - 1,
            }"
            :style="cellStyle(cell, r, c)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

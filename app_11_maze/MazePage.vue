<script setup lang="ts">
  import { ref } from 'vue'
  import { useMaze, DIFFICULTIES } from './useMaze'
  import type { Cell } from './generator'

  const { rows, cols, difficulty, setDifficulty, grid, reroll, showSolution, solutionIndex, solutionLength, toggleSolution, MIN, MAX } =
    useMaze()

  // 每格小正方形邊長 (px)，使用者可調。只影響繪製、不影響迷宮生成
  const cellSize = ref(24)
  const CELL_MIN = 8
  const CELL_MAX = 48

  // 依步序回傳彩虹 hue 底色：沿路徑由藍漸變到桃紅
  function pathColor(index: number, len: number) {
    const t = len <= 1 ? 0 : index / (len - 1)
    const hue = 200 + t * 140 // 200°(藍) → 340°(桃紅)
    return `hsl(${hue} 85% 55% / 0.55)`
  }

  // 牆用 border 畫，每格畫「自己的 4 個 bool」。共用牆會被兩格各畫一次，
  // 靠 margin-right / -bottom: -2px 讓相鄰格重疊 2px → 兩條疊成單條、不會雙倍粗。
  // 好處：轉角一定填滿——L 形凹角那格同時擁有兩道牆，自己的兩條 border 同色 miter
  // 收在角落，不再有 "_|" 的缺口。詳見 docs/maze-algorithm.md
  function cellStyle(cell: Cell, r: number, c: number) {
    const wall = '2px solid currentColor'
    const none = '0'
    const isStart = r === 0 && c === 0
    const isEnd = r === rows.value - 1 && c === cols.value - 1
    const idx = solutionIndex.value.get(`${r},${c}`)
    const onPath = idx !== undefined && !isStart && !isEnd // 起終點用 class 綠/紅，不設 inline bg
    return {
      width: `${cellSize.value}px`,
      height: `${cellSize.value}px`,
      marginRight: '-2px', // 與右鄰重疊 2px，共用垂直牆收成單條
      borderTop: cell.top ? wall : none,
      borderRight: cell.right ? wall : none,
      borderBottom: cell.bottom ? wall : none,
      borderLeft: cell.left ? wall : none,
      ...(onPath ? { backgroundColor: pathColor(idx, solutionLength.value) } : {}),
    }
  }
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <!-- 控制面板 -->
    <div class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
      <div>
        <span class="text-sm font-medium">難度：</span>
        <UFieldGroup orientation="horizontal" class="mt-3">
          <UButton
            v-for="d in DIFFICULTIES"
            :key="d.value"
            :color="difficulty === d.value ? 'primary' : 'neutral'"
            :variant="difficulty === d.value ? 'solid' : 'outline'"
            @click="setDifficulty(d.value)"
          >
            {{ d.label }}
          </UButton>
        </UFieldGroup>
      </div>
      <div>
        <span class="text-sm font-medium">列數 (rows)：{{ rows }}</span>
        <USlider v-model="rows" :min="MIN" :max="MAX" :step="1" class="mt-3" />
      </div>
      <div>
        <span class="text-sm font-medium">行數 (cols)：{{ cols }}</span>
        <USlider v-model="cols" :min="MIN" :max="MAX" :step="1" class="mt-3" />
      </div>
      <div>
        <span class="text-sm font-medium">格子寬 (px)：{{ cellSize }}</span>
        <USlider v-model="cellSize" :min="CELL_MIN" :max="CELL_MAX" :step="1" class="mt-3" />
      </div>
      <UButton icon="i-lucide-dices" color="primary" block @click="reroll">換一張迷宮</UButton>
      <UButton :icon="showSolution ? 'i-lucide-eye-off' : 'i-lucide-route'" color="neutral" variant="outline" block @click="toggleSolution">
        {{ showSolution ? '隱藏解答' : '顯示解答' }}
      </UButton>
    </div>

    <!-- 迷宮：用 flex 逐列排，列間 margin-bottom:-2px 重疊 2px（收掉共用水平牆的雙倍） -->
    <div class="overflow-visible">
      <div class="box-border w-max text-gray-800 dark:text-gray-200">
        <div v-for="(row, r) in grid" :key="r" class="flex" :style="{ marginBottom: '-2px' }">
          <div
            v-for="(cell, c) in row"
            :key="`${r}-${c}`"
            class="box-border shrink-0"
            :class="{
              'bg-green-400/40': r === 0 && c === 0,
              'bg-red-400/40': r === rows - 1 && c === cols - 1,
            }"
            :style="cellStyle(cell, r, c)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useMaze } from './useMaze'
  import MazeSettings from './MazeSettings.vue'
  import MazeBoard from './MazeBoard.vue'

  const { rows, cols, difficulty, grid, reroll, showSolution, solutionPath, toggleSolution, MIN, MAX } = useMaze()

  // 純繪製狀態（不影響迷宮生成），由 Page 持有、同時餵給 Settings 調整與 Board 繪製
  const cellSize = ref(24) // 每格小正方形邊長 (px)
  const drawTotal = ref(1.6) // 解答逐段畫出的總秒數

  const clickedCell = ref<[number, number] | null>(null) // Board 回報的最後點擊格
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <MazeSettings
      v-model:rows="rows"
      v-model:cols="cols"
      v-model:cell-size="cellSize"
      v-model:draw-total="drawTotal"
      v-model:difficulty="difficulty"
      :show-solution="showSolution"
      :min="MIN"
      :max="MAX"
      @reroll="reroll"
      @toggle-solution="toggleSolution"
    />

    <MazeBoard
      :grid="grid"
      :solution-path="solutionPath"
      :show-solution="showSolution"
      :cell-size="cellSize"
      :draw-total="drawTotal"
      @cell-click="
        (r, c) => {
          clickedCell = [r, c]
        }
      "
    />

    <p class="text-sm text-gray-600 dark:text-gray-400">
      目前點擊格：{{ clickedCell ? `第 ${clickedCell[0]} 列，第 ${clickedCell[1]} 行` : '（尚未點擊）' }}
    </p>
  </div>
</template>

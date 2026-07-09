<script setup lang="ts">
  import { ref } from 'vue'
  import { useMaze } from './useMaze'
  import MazeSettings from './MazeSettings.vue'
  import MazeBoard from './MazeBoard.vue'

  const { rows, cols, difficulty, grid, reroll, showSolution, solutionPath, toggleSolution, MIN, MAX } = useMaze()

  // 純繪製狀態（不影響迷宮生成），由 Page 持有、同時餵給 Settings 調整與 Board 繪製
  const cellSize = ref(24) // 每格小正方形邊長 (px)
  const drawTotal = ref(1.6) // 解答逐段畫出的總秒數

  const clickedCell = ref<[number, number] | null>(null) // Board 回報的最後「左鍵」點擊格
  const rightClickedCell = ref<[number, number] | null>(null) // 最後「右鍵」點擊格

  const fmt = (cell: [number, number] | null) => (cell ? `第 ${cell[0]} 列，第 ${cell[1]} 行` : '（尚未點擊）')
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
      @cell-right-click="
        (r, c) => {
          rightClickedCell = [r, c]
        }
      "
    />

    <div class="text-sm text-gray-600 dark:text-gray-400">
      <p>左鍵點擊格：{{ fmt(clickedCell) }}</p>
      <p>右鍵點擊格：{{ fmt(rightClickedCell) }}</p>
    </div>
  </div>
</template>

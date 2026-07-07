<script setup lang="ts">
  import SudokuBoard from './SudokuBoard.vue'
  import PuzzleSettings from './PuzzleSettings.vue'
  import StyleSettings from './StyleSettings.vue'
  import { useSudoku } from './useSudoku'

  const { base, total, minShown, baseOptions, answer, puzzle, isUnique, shownCount, newAnswer, reroll } = useSudoku()
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

    <PuzzleSettings
      v-model:base="base"
      v-model:shown-count="shownCount"
      :base-options="baseOptions"
      :min-shown="minShown"
      :total="total"
      class="absolute top-8 left-8"
      @new-answer="newAnswer"
      @reroll="reroll"
    />

    <StyleSettings class="absolute top-8 right-8" />
  </div>
</template>

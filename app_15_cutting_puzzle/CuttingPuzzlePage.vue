<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import CuttingPuzzleSettings from './CuttingPuzzleSettings.vue'
  import exampleImage from './example.jpg'

  const MIN_GRID_SIZE = 2
  const MAX_GRID_SIZE = 10

  const rows = ref(4) // M：列數
  const columns = ref(4) // N：欄數

  const pieces = computed(() =>
    Array.from({ length: columns.value * rows.value }, (_, index) => {
      const col = index % columns.value
      const row = Math.floor(index / columns.value)

      return {
        style: {
          backgroundImage: `url(${exampleImage})`,
          backgroundSize: `${columns.value * 100}% ${rows.value * 100}%`,
          backgroundPosition: `${columns.value > 1 ? (col / (columns.value - 1)) * 100 : 0}% ${rows.value > 1 ? (row / (rows.value - 1)) * 100 : 0}%`,
        },
      }
    }),
  )

  function createOrderedIndexes() {
    return Array.from({ length: columns.value * rows.value }, (_, index) => index)
  }

  const order = ref(createOrderedIndexes())

  watch([columns, rows], () => {
    order.value = createOrderedIndexes()
  })

  function shuffleOrder() {
    const shuffled = [...order.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    order.value = shuffled
  }

  function restoreOrder() {
    order.value = createOrderedIndexes()
  }
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <CuttingPuzzleSettings v-model:rows="rows" v-model:cols="columns" :min="MIN_GRID_SIZE" :max="MAX_GRID_SIZE" />

    <div class="flex flex-1 flex-col items-center gap-6">
      <div class="flex flex-wrap items-center gap-4">
        <UButton icon="i-lucide-shuffle" label="打亂順序" color="neutral" variant="soft" @click="shuffleOrder" />
        <UButton icon="i-lucide-rotate-ccw" label="恢復順序" color="neutral" variant="outline" @click="restoreOrder" />
      </div>

      <div
        class="grid aspect-1215/717 w-full max-w-3xl gap-1 bg-slate-300 dark:bg-slate-700"
        :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }"
      >
        <div v-for="pieceIndex in order" :key="pieceIndex" class="relative bg-cover" :style="pieces[pieceIndex]!.style">
          <span class="absolute top-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-xs font-semibold text-white">
            {{ pieceIndex + 1 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

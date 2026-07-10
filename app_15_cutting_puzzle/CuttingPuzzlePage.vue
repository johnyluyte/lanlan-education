<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import exampleImage from './example.jpg'

  const MIN_GRID_SIZE = 1
  const MAX_GRID_SIZE = 10

  const columns = ref(4)
  const rows = ref(4)

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
  <div class="flex flex-col items-center gap-6 p-8">
    <div class="flex flex-wrap items-end gap-4 rounded-md bg-white/85 p-4 shadow-sm dark:bg-gray-950/80">
      <UFormField label="欄數 (m)">
        <UInputNumber v-model="columns" :min="MIN_GRID_SIZE" :max="MAX_GRID_SIZE" class="w-32" />
      </UFormField>
      <UFormField label="列數 (n)">
        <UInputNumber v-model="rows" :min="MIN_GRID_SIZE" :max="MAX_GRID_SIZE" class="w-32" />
      </UFormField>
      <UButton icon="i-lucide-shuffle" label="打亂順序" color="neutral" variant="soft" @click="shuffleOrder" />
      <UButton icon="i-lucide-rotate-ccw" label="恢復順序" color="neutral" variant="outline" @click="restoreOrder" />
    </div>

    <div
      class="grid aspect-1215/717 w-full max-w-3xl gap-1 bg-slate-300 dark:bg-slate-700"
      :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }"
    >
      <div v-for="pieceIndex in order" :key="pieceIndex" class="bg-cover" :style="pieces[pieceIndex]!.style" />
    </div>
  </div>
</template>

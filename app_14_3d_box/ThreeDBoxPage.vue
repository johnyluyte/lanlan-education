<script setup lang="ts">
  import { ref } from 'vue'
  import ThreeDBoxSettings from './ThreeDBoxSettings.vue'
  import ThreeDBoxScene from './ThreeDBoxScene.vue'

  const MIN_GRID_SIZE = 2
  const MAX_GRID_SIZE = 10

  const rows = ref(4) // M：列數
  const cols = ref(4) // N：欄數
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <ThreeDBoxSettings v-model:rows="rows" v-model:cols="cols" :min="MIN_GRID_SIZE" :max="MAX_GRID_SIZE" />

    <ThreeDBoxScene class="h-[calc(100vh-8rem)] w-full flex-1" />
  </div>
</template>

<script setup lang="ts">
  import DraggableShapesBlock from './DraggableShapesBlock.vue'
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <!-- <svg class="h-40 w-40 text-gray-900 dark:text-gray-200" viewBox="0 0 100 100" role="img" aria-label="正方形">
      <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round" />
    </svg> -->
    <DraggableShapesBlock />
  </div>
</template>

<script setup lang="ts">
  //
</script>

<template>
  <div class="flex w-full gap-2 p-12">
    <div class="flex h-screen w-screen flex-col items-center justify-center gap-12 overflow-y-auto">
      <UButton color="secondary" to="/"> {{ $t('common.cancel') }} </UButton>
      <UButton color="secondary" to="/"> {{ $t('common.delete') }} </UButton>
      <UButton color="secondary" to="/sudoku"> Sudoku </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LayoutHeader from '#alias-shared/LayoutHeader.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <div class="flex flex-1 flex-col overflow-hidden">
      <LayoutHeader />

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

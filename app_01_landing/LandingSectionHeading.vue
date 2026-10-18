<script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()
</script>

<template>
  <div class="max-w-2xl">
    <!-- break-keep：標題只在標點處換行，避免把「在治療室」這類詞拆開；太長放不下時才由 wrap-break-word 強制斷行 -->
    <h2
      class="font-display text-highlighted text-[1.75rem] leading-snug tracking-[0.04em] text-balance wrap-break-word break-keep sm:text-4xl sm:leading-tight"
    >
      {{ title }}
    </h2>
    <p v-if="description" class="text-toned mt-4 text-lg leading-[1.8]">{{ description }}</p>
  </div>
</template>

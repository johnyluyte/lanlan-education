<script setup lang="ts">
  import { brand } from '#alias-landing/landingContent'
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <!-- 標誌：寫在田字格裡的「蘭」 -->
    <span
      class="landing-tianzige font-display border-brand-400 text-brand-700 grid size-9 place-items-center rounded-[3px] border-2 bg-white text-[1.375rem] leading-none"
      aria-hidden="true"
      >蘭</span
    >
    <span class="font-display text-highlighted text-xl tracking-[0.08em]">{{ brand.name }}</span>
  </span>
</template>

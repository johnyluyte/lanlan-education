<script setup lang="ts">
  import LandingPage from '#alias-landing/LandingPage.vue'

  // Landing 的配色只設計了淺色版，進到這頁一律用淺色（離開後恢復使用者原本的設定）
  definePageMeta({ colorMode: 'light' })
</script>

<template>
  <LandingPage />
</template>

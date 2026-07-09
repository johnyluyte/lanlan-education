<script setup lang="ts">
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
  import LayoutDrawerDesktop from '#alias-shared/LayoutDrawerDesktop.vue'
  import LayoutDrawerMobile from '#alias-shared/LayoutDrawerMobile.vue'

  // lg (1024px) 以下走手機殼
  const isMobile = useBreakpoints(breakpointsTailwind).smaller('lg')
</script>

<template>
  <LayoutDrawerMobile v-if="isMobile">
    <slot />
  </LayoutDrawerMobile>
  <LayoutDrawerDesktop v-else>
    <slot />
  </LayoutDrawerDesktop>
</template>

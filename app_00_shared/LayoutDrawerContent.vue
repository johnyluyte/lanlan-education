<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  defineProps<{
    // 桌機收合時，UNavigationMenu 只顯示圖示（rail）
    collapsed?: boolean
  }>()

  // 手機情境點選項後要關閉 slideover；桌機不需理會
  const emit = defineEmits<{ select: [] }>()

  const { t } = useI18n()

  const items = computed<NavigationMenuItem[]>(() => [
    { label: t('nav.home'), icon: 'i-lucide-home', to: '/', onSelect: () => emit('select') },
    { label: t('nav.sudoku'), icon: 'i-lucide-grid-3x3', to: '/sudoku', onSelect: () => emit('select') },
    { label: t('nav.maze'), icon: 'i-game-icons-maze', to: '/maze', onSelect: () => emit('select') },
    { label: t('nav.imitateDot'), icon: 'i-lucide-copy', to: '/imitate-dot', onSelect: () => emit('select') },
    { label: t('nav.imitateLine'), icon: 'i-lucide-route', to: '/imitate-line', onSelect: () => emit('select') },
    { label: t('nav.paperStaging'), icon: 'i-lucide-layout-template', to: '/paper-staging', onSelect: () => emit('select') },
    { label: t('nav.matchingGame'), icon: 'i-game-icons-card-pick', to: '/matching-game', onSelect: () => emit('select') },
    { label: t('nav.connectTheDots'), icon: 'i-lucide-dot', to: '/connect-the-dots', onSelect: () => emit('select') },
    { label: t('nav.tileMatching'), icon: 'i-game-icons-domino-tiles', to: '/tile-matching', onSelect: () => emit('select') },
  ])
</script>

<template>
  <UNavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" class="w-full" />
</template>

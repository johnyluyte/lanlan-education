<script setup lang="ts">
  import LayoutHeader from '#alias-shared/LayoutHeader.vue'
  import LayoutDrawerContent from '#alias-shared/LayoutDrawerContent.vue'
  import { useLayoutDrawer } from '#alias-shared/useLayoutDrawer'

  const { isMobileOpen, toggleMobile, closeMobile } = useLayoutDrawer()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <LayoutHeader>
      <template #leading>
        <UButton icon="i-lucide-menu" color="neutral" variant="ghost" square @click="toggleMobile" />
      </template>
    </LayoutHeader>

    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <USlideover v-model:open="isMobileOpen" side="left" title="選單">
      <template #content>
        <div class="p-2">
          <LayoutDrawerContent @select="closeMobile" />
        </div>
      </template>
    </USlideover>
  </div>
</template>

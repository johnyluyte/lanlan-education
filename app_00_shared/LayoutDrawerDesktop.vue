<script setup lang="ts">
  import LayoutHeader from '#alias-shared/LayoutHeader.vue'
  import LayoutDrawerContent from '#alias-shared/LayoutDrawerContent.vue'
  import { useLayoutDrawer } from '#alias-shared/useLayoutDrawer'

  const { isDesktopCollapsed, toggleDesktopCollapsed } = useLayoutDrawer()
</script>

<template>
  <div class="flex min-h-screen">
    <aside
      class="border-muted/90 bg-default shrink-0 border-r p-2 transition-[width] duration-200"
      :class="isDesktopCollapsed ? 'w-12' : 'w-44'"
    >
      <LayoutDrawerContent :collapsed="isDesktopCollapsed" />
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <LayoutHeader>
        <template #leading>
          <UTooltip :text="isDesktopCollapsed ? '展開側欄' : '收合側欄'">
            <UButton icon="i-lucide-panel-left" color="neutral" variant="ghost" square @click="toggleDesktopCollapsed" />
          </UTooltip>
        </template>
      </LayoutHeader>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

// 手機 slideover 開關（暫態，全 app 共享一份）
const isMobileOpen = ref(false)

// 桌機側欄收合狀態（記住在 localStorage）
const isDesktopCollapsed = useLocalStorage('layout-drawer-collapsed', false)

export function useLayoutDrawer() {
  function toggleMobile() {
    isMobileOpen.value = !isMobileOpen.value
  }

  function closeMobile() {
    isMobileOpen.value = false
  }

  function toggleDesktopCollapsed() {
    isDesktopCollapsed.value = !isDesktopCollapsed.value
  }

  return {
    isMobileOpen,
    isDesktopCollapsed,
    toggleMobile,
    closeMobile,
    toggleDesktopCollapsed,
  }
}

<script setup lang="ts">
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')
  function toggleDark() {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }

  const { t, locale, setLocale } = useI18n()
  function toggleLocale() {
    setLocale(locale.value === 'zh-TW' ? 'en-US' : 'zh-TW')
  }

  function handleLogout() {
    console.log('logout')
  }
</script>

<template>
  <header class="border-muted/90 bg-default flex h-12 shrink-0 items-center border-b px-2 lg:pr-2 lg:pl-3.5">
    <div class="flex flex-1 items-center gap-2">
      <slot name="leading" />

      <span class="text-highlighted text-sm font-medium">蘭芳教育</span>

      <UTooltip text="回到首頁">
        <UButton icon="i-lucide-home" color="neutral" variant="ghost" square to="/" />
      </UTooltip>
      <UTooltip text="回上一頁">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" square @click="$router.back()" />
      </UTooltip>
    </div>

    <div class="flex items-center justify-end gap-1">
      <UTooltip :text="t('userSetting.toggleTheme')">
        <UButton :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" color="neutral" variant="ghost" square @click="toggleDark" />
      </UTooltip>

      <UTooltip :text="t('userSetting.toggleLocale')">
        <UButton color="neutral" variant="ghost" @click="toggleLocale">
          <UIcon :name="locale === 'zh-TW' ? 'i-twemoji-flag-taiwan' : 'i-twemoji-flag-united-states'" class="size-4 shrink-0" />
          <span class="font-mono text-sm font-semibold">{{ locale === 'zh-TW' ? 'TW' : 'EN' }}</span>
        </UButton>
      </UTooltip>

      <UTooltip :text="t('common.logout')">
        <UButton color="neutral" variant="ghost" @click="handleLogout">
          <UIcon name="i-lucide-log-out" class="size-4 shrink-0" />
        </UButton>
      </UTooltip>
    </div>
  </header>
</template>

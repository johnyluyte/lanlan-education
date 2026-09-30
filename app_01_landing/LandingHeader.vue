<script setup lang="ts">
  import LandingLogo from '#alias-landing/LandingLogo.vue'
  import { brand, headerLinks, navLinks } from '#alias-landing/landingContent'
</script>

<template>
  <UHeader mode="slideover" :ui="{ root: 'bg-default/85', body: 'p-6' }">
    <template #left>
      <NuxtLink to="/landing" :aria-label="`${brand.name}首頁`" class="shrink-0">
        <LandingLogo />
      </NuxtLink>
    </template>

    <nav aria-label="主要導覽" class="flex items-center gap-8">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="text-toned hover:text-highlighted text-[0.9375rem] tracking-[0.04em] transition-colors"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <template #right>
      <UButton :to="headerLinks.login.to" :label="headerLinks.login.label" color="neutral" variant="ghost" class="hidden sm:inline-flex" />
      <UButton :to="headerLinks.signup.to" :label="headerLinks.signup.label" />
    </template>

    <template #toggle="{ open, toggle }">
      <UButton
        :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
        :aria-label="open ? '關閉選單' : '開啟選單'"
        color="neutral"
        variant="ghost"
        class="-me-1.5 lg:hidden"
        @click="toggle"
      />
    </template>

    <template #body>
      <nav aria-label="主要導覽" class="flex flex-col">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-display text-highlighted border-default border-b py-4 text-xl"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <UButton :to="headerLinks.login.to" :label="headerLinks.login.label" color="neutral" variant="outline" size="lg" block class="mt-8" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
  import LandingLogo from '#alias-landing/LandingLogo.vue'
  import { brand, footer } from '#alias-landing/landingContent'

  const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-default border-t">
    <UContainer class="grid gap-12 py-16 lg:grid-cols-12">
      <div class="lg:col-span-5">
        <NuxtLink to="/landing" :aria-label="`${brand.name}首頁`" class="inline-block">
          <LandingLogo />
        </NuxtLink>
        <p class="text-toned mt-5 max-w-[20em] leading-[1.8]">{{ brand.tagline }}</p>
        <div class="mt-6 flex gap-1">
          <UButton
            v-for="social in footer.socials"
            :key="social.label"
            :to="social.to"
            :icon="social.icon"
            :aria-label="social.label"
            color="neutral"
            variant="ghost"
            size="lg"
          />
        </div>
      </div>

      <nav aria-label="頁尾導覽" class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
        <div v-for="column in footer.columns" :key="column.title">
          <h2 class="text-highlighted text-sm font-medium tracking-[0.06em]">{{ column.title }}</h2>
          <ul class="mt-4 space-y-3">
            <li v-for="link in column.links" :key="link.label">
              <NuxtLink :to="link.to" class="text-toned hover:text-highlighted transition-colors">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </UContainer>

    <div class="border-default border-t">
      <UContainer class="text-muted py-6 text-sm">© {{ year }} {{ brand.name }}</UContainer>
    </div>
  </footer>
</template>

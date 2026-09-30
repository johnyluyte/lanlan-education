<script setup lang="ts">
  import LandingGridHeadline from '#alias-landing/LandingGridHeadline.vue'
  import { brand, comingSoon } from '#alias-landing/landingContent'

  useHead({ title: `${comingSoon.title}｜${brand.name}` })
</script>

<template>
  <section class="relative isolate overflow-hidden">
    <div class="landing-grid-paper absolute inset-0 -z-10 mask-radial-from-10% mask-radial-to-70%" aria-hidden="true" />

    <UContainer class="flex flex-col items-center py-24 text-center sm:py-32">
      <!-- 容器寬度要大於 30rem 才會顯示注音格（見 LandingGridHeadline 的 container query） -->
      <h1 class="w-full max-w-xl">
        <span class="sr-only">{{ comingSoon.title }}</span>
        <LandingGridHeadline :rows="comingSoon.rows" :max-unit="7" animate class="[&_.gh-grid]:mx-auto" />
      </h1>

      <p class="font-display text-highlighted mt-10 text-2xl tracking-[0.04em] wrap-break-word break-keep">{{ comingSoon.heading }}</p>
      <p class="text-toned mt-3 max-w-[28em] leading-[1.8]">{{ comingSoon.description }}</p>

      <div class="mt-9 flex flex-wrap justify-center gap-3">
        <UButton :to="comingSoon.primary.to" :label="comingSoon.primary.label" size="xl" class="px-6" />
        <UButton
          :to="comingSoon.secondary.to"
          :label="comingSoon.secondary.label"
          size="xl"
          color="neutral"
          variant="outline"
          class="px-6"
        />
      </div>
    </UContainer>
  </section>
</template>

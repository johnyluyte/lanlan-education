<script setup lang="ts">
  import { cta } from '#alias-landing/landingContent'
</script>

<template>
  <section class="pt-4 pb-20 sm:pb-28">
    <UContainer>
      <!-- 主色很淺，區塊內文字與按鈕改用墨色 -->
      <div
        class="landing-grid-paper bg-brand-300 text-ink relative isolate overflow-hidden rounded-[2rem] px-6 py-16 text-center [--grid-line:rgb(255_255_255/0.35)] sm:px-12 sm:py-20"
      >
        <h2 class="font-display text-[1.75rem] leading-snug tracking-[0.04em] text-balance wrap-break-word break-keep sm:text-4xl">
          {{ cta.title }}
        </h2>
        <p class="text-ink/80 mx-auto mt-4 max-w-[28em] text-lg leading-[1.8]">{{ cta.description }}</p>

        <div class="mt-9 flex flex-wrap justify-center gap-3">
          <UButton :to="cta.primary.to" :label="cta.primary.label" size="xl" color="neutral" class="px-6" />
          <UButton
            :to="cta.secondary.to"
            :label="cta.secondary.label"
            size="xl"
            color="neutral"
            variant="outline"
            class="text-ink ring-ink/35 bg-transparent px-6 hover:bg-white/30"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>

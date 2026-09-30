<script setup lang="ts">
  import LandingSectionHeading from '#alias-landing/LandingSectionHeading.vue'
  import { stories } from '#alias-landing/landingContent'
</script>

<template>
  <section id="stories" class="bg-brand-50 scroll-mt-24 py-20 sm:py-28">
    <UContainer>
      <LandingSectionHeading :title="stories.title" :description="stories.description" />

      <div class="mt-14 grid gap-8 md:grid-cols-3">
        <!-- 聯絡簿內頁：橫線 + 左側邊線，文字行高對齊 2rem 的橫線 -->
        <figure
          v-for="story in stories.items"
          :key="story.name"
          class="landing-ruled ring-brand-100 before:bg-coral-300 relative flex flex-col rounded-xl bg-white px-6 pt-8 pb-8 pl-9 shadow-[0_1px_0_rgb(43_33_64/0.04),0_18px_30px_-22px_rgb(43_33_64/0.45)] ring-1 before:absolute before:inset-y-0 before:left-5 before:w-px"
        >
          <blockquote class="font-display text-ink text-lg leading-8 tracking-[0.03em]">「{{ story.quote }}」</blockquote>
          <figcaption class="text-muted mt-auto pt-8 text-sm leading-8">
            <span class="text-highlighted font-medium">{{ story.name }}</span>
            <span class="px-1.5" aria-hidden="true">｜</span>
            {{ story.role }}
          </figcaption>
        </figure>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
  import LandingSectionHeading from '#alias-landing/LandingSectionHeading.vue'
  import { audiences } from '#alias-landing/landingContent'
</script>

<template>
  <section id="audiences" class="scroll-mt-24 py-20 sm:py-28">
    <UContainer>
      <LandingSectionHeading :title="audiences.title" :description="audiences.description" />

      <div class="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-3">
        <article v-for="item in audiences.items" :key="item.id" class="flex flex-col">
          <img
            :src="item.image.src"
            :alt="item.image.alt"
            :width="item.image.width"
            :height="item.image.height"
            loading="lazy"
            decoding="async"
            class="aspect-4/3 w-full rounded-2xl object-cover"
          />

          <h3 class="font-display text-highlighted mt-7 flex items-center gap-2.5 text-2xl tracking-[0.04em]">
            <UIcon :name="item.icon" class="text-brand-600 size-6 shrink-0" />
            {{ item.title }}
          </h3>
          <p class="text-toned mt-2 leading-[1.8]">{{ item.lead }}</p>

          <ul class="mt-5 space-y-3">
            <li v-for="point in item.points" :key="point" class="flex gap-3 leading-[1.7]">
              <!-- 老師批改用的紅筆勾 -->
              <svg viewBox="0 0 24 24" class="text-redpen mt-0.5 size-5 shrink-0" aria-hidden="true">
                <path
                  d="M4 13.2c2.1 1.5 3.8 3.3 5.1 5.5 2.9-6.6 6.4-11.3 11-14.4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ point }}</span>
            </li>
          </ul>

          <NuxtLink
            :to="item.link.to"
            class="text-brand-700 decoration-brand-300 mt-7 self-start font-medium underline underline-offset-[6px] transition-colors hover:decoration-current"
          >
            {{ item.link.label }}
          </NuxtLink>
        </article>
      </div>
    </UContainer>
  </section>
</template>

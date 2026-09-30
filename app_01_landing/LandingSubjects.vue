<script setup lang="ts">
  import LandingSectionHeading from '#alias-landing/LandingSectionHeading.vue'
  import { subjects } from '#alias-landing/landingContent'
</script>

<template>
  <section id="subjects" class="border-default scroll-mt-24 border-y bg-white py-20 sm:py-28">
    <UContainer>
      <LandingSectionHeading :title="subjects.title" :description="subjects.description" />

      <div class="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
        <article v-for="item in subjects.items" :key="item.id" class="bg-default border-default relative rounded-2xl border">
          <!-- 分頁標籤（像作業簿的分科索引） -->
          <span
            class="font-display text-ink absolute -top-[1.625rem] left-6 rounded-t-lg px-3.5 pt-1 pb-1.5 text-[0.9375rem] tracking-[0.06em]"
            :class="item.tabClass"
          >
            {{ item.tab }}
          </span>

          <div class="grid gap-5 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6 sm:p-6">
            <img
              :src="item.image.src"
              :alt="item.image.alt"
              :width="item.image.width"
              :height="item.image.height"
              loading="lazy"
              decoding="async"
              class="aspect-16/10 w-full rounded-xl object-cover sm:aspect-3/4"
            />

            <div class="flex flex-col">
              <h3 class="font-display text-highlighted text-2xl tracking-[0.04em]">{{ item.title }}</h3>
              <p class="text-muted mt-1 text-sm">適合 {{ item.ages }}</p>
              <p class="text-toned mt-3 leading-[1.8]">{{ item.description }}</p>

              <ul class="mt-auto flex flex-wrap gap-2 pt-5" :aria-label="`${item.title}的活動`">
                <li
                  v-for="activity in item.activities"
                  :key="activity"
                  class="rounded-full border px-3 py-1 text-sm"
                  :class="item.chipClass"
                >
                  {{ activity }}
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </UContainer>
  </section>
</template>

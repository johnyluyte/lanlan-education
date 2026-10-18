<script setup lang="ts">
  import LandingSectionHeading from '#alias-landing/LandingSectionHeading.vue'
  import { steps } from '#alias-landing/landingContent'
</script>

<template>
  <section id="steps" class="scroll-mt-24 py-20 sm:py-28">
    <UContainer>
      <LandingSectionHeading :title="steps.title" :description="steps.description" />

      <!-- 串起步驟的鉛筆虛線：手機直向（before），桌機橫向（after），最後一步不畫 -->
      <ol class="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        <li
          v-for="(step, index) in steps.items"
          :key="step.title"
          class="before:border-brand-300 after:border-brand-300 relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 before:absolute before:top-16 before:-bottom-8 before:left-7 before:border-l-2 before:border-dashed after:absolute after:top-7 after:-right-6 after:left-16 after:hidden after:border-t-2 after:border-dashed last:before:hidden md:block md:before:hidden md:after:block md:last:after:hidden"
        >
          <!-- 步驟編號寫在田字格裡 -->
          <span
            class="landing-tianzige font-display text-ink border-brand-300 relative z-10 grid size-14 place-items-center border-2 bg-white text-3xl leading-none"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>
          <div class="md:mt-6">
            <h3 class="font-display text-highlighted text-2xl tracking-[0.04em]">
              <span class="sr-only">第 {{ index + 1 }} 步：</span>{{ step.title }}
            </h3>
            <p class="text-toned mt-2 leading-[1.8]">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </UContainer>
  </section>
</template>

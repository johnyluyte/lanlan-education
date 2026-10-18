<script setup lang="ts">
  import LandingGridHeadline from '#alias-landing/LandingGridHeadline.vue'
  import LandingStamp from '#alias-landing/LandingStamp.vue'
  import LandingTapedPhoto from '#alias-landing/LandingTapedPhoto.vue'
  import { hero } from '#alias-landing/landingContent'
</script>

<template>
  <section class="relative isolate overflow-hidden">
    <div class="landing-grid-paper absolute inset-0 -z-10 mask-b-from-45% mask-b-to-100%" aria-hidden="true" />

    <UContainer class="pt-12 pb-20 sm:pt-16 lg:pt-14 lg:pb-16">
      <!-- 主標：寬度上限剛好等於 7 組格子的最大寬度，讓獎勵章能對齊格子的右上角 -->
      <div class="relative max-w-[57rem]">
        <h1>
          <span class="sr-only">{{ hero.title }}</span>
          <LandingGridHeadline :rows="hero.rows" :max-unit="8" animate />
        </h1>
        <!-- 字寫完後，老師在第一列最後的空格蓋章 -->
        <LandingStamp
          :text="hero.stamp"
          class="landing-anim-stamp pointer-events-none absolute -top-10 -right-2 size-20 -rotate-12 sm:-top-12 sm:-right-1 sm:size-28 lg:-top-14 lg:-right-14 lg:size-36"
        />
      </div>

      <div class="mt-10 grid gap-x-12 gap-y-14 lg:mt-12 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <p class="text-toned max-w-[33em] text-lg leading-[1.85]">{{ hero.description }}</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <UButton :to="hero.primaryCta.to" :label="hero.primaryCta.label" size="xl" class="px-6" />
            <UButton :to="hero.secondaryCta.to" :label="hero.secondaryCta.label" size="xl" color="neutral" variant="outline" class="px-6" />
          </div>
        </div>

        <!-- 貼在作業簿上的照片：手機上下交疊，桌機左右交疊 -->
        <div class="relative mx-auto w-full max-w-md pb-28 sm:pb-36 lg:col-span-7 lg:max-w-none lg:pb-6">
          <LandingTapedPhoto :image="hero.photos.main" :tilt="-1.5" priority class="lg:w-[62%]" />
          <LandingTapedPhoto
            :image="hero.photos.detail"
            :caption="hero.photos.detail.caption"
            :tilt="3.5"
            :tape-tilt="-4"
            priority
            class="absolute right-0 bottom-0 w-[58%] lg:top-14 lg:bottom-auto lg:w-[46%]"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>

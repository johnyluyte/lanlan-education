<script setup lang="ts">
  import type { LandingImage } from '#alias-landing/landingContent'

  // 用紙膠帶貼在作業簿上的照片（白邊＋膠帶＋微傾斜）
  withDefaults(
    defineProps<{
      image: LandingImage
      caption?: string
      // 照片傾斜角度（deg）
      tilt?: number
      // 膠帶傾斜角度（deg）
      tapeTilt?: number
      // 首屏圖片：不延遲載入並提高下載優先序
      priority?: boolean
    }>(),
    {
      caption: '',
      tilt: 0,
      tapeTilt: -3,
      priority: false,
    },
  )
</script>

<template>
  <!-- 根元素不設 position，讓外層可以用 absolute 擺放；膠帶改以內層 relative 定位 -->
  <figure
    class="bg-white p-2.5 shadow-[0_1px_0_rgb(43_33_64/0.05),0_22px_34px_-20px_rgb(43_33_64/0.5)] ring-1 ring-[rgb(43_33_64/0.06)]"
    :style="{ rotate: `${tilt}deg` }"
  >
    <div class="relative">
      <span
        class="landing-tape absolute -top-6 left-1/2 z-10 h-7 w-24 -translate-x-1/2"
        :style="{ rotate: `${tapeTilt}deg` }"
        aria-hidden="true"
      />
      <img
        :src="image.src"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
        class="block aspect-3/2 w-full object-cover"
      />
    </div>
    <figcaption v-if="caption" class="font-display text-toned pt-2 text-center text-sm">{{ caption }}</figcaption>
  </figure>
</template>

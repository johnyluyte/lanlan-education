<script setup lang="ts">
  import LandingFooter from '#alias-landing/LandingFooter.vue'
  import LandingHeader from '#alias-landing/LandingHeader.vue'

  // 登入前的公開頁面版型（由 nuxt.config 的 routeRules 指定給 /landing/**）
  // html.landing-theme 會套用 landing 專用的配色（見 app_01_landing/landing.css），離開此版型時自動移除
  useHead({
    htmlAttrs: { class: 'landing-theme' },
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Huninn&family=Noto+Sans+TC:wght@400;500;700&display=swap' },
    ],
  })
</script>

<template>
  <!-- text-pretty 會繼承下去，避免段落最後一行只剩一個字 -->
  <div class="bg-default text-default min-h-dvh tracking-[0.02em] text-pretty">
    <LandingHeader />
    <main>
      <slot />
    </main>
    <LandingFooter />
  </div>
</template>

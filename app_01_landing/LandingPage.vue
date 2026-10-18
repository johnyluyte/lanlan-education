<script setup lang="ts">
  import LandingAudiences from '#alias-landing/LandingAudiences.vue'
  import LandingCta from '#alias-landing/LandingCta.vue'
  import LandingFaq from '#alias-landing/LandingFaq.vue'
  import LandingHero from '#alias-landing/LandingHero.vue'
  import LandingSteps from '#alias-landing/LandingSteps.vue'
  import LandingStories from '#alias-landing/LandingStories.vue'
  import LandingSubjects from '#alias-landing/LandingSubjects.vue'
  import { brand, hero } from '#alias-landing/landingContent'

  useHead({
    title: brand.pageTitle,
    meta: [{ name: 'description', content: hero.description }],
  })
</script>

<template>
  <LandingHero />
  <LandingAudiences />
  <LandingSubjects />
  <LandingSteps />
  <LandingStories />
  <LandingFaq />
  <LandingCta />
</template>

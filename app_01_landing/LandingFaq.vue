<script setup lang="ts">
  import LandingSectionHeading from '#alias-landing/LandingSectionHeading.vue'
  import { faq } from '#alias-landing/landingContent'
</script>

<template>
  <section id="faq" class="scroll-mt-24 py-20 sm:py-28">
    <UContainer class="grid gap-x-12 gap-y-10 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <LandingSectionHeading :title="faq.title" :description="faq.description" />
        <UButton :to="faq.contact.to" :label="faq.contact.label" color="neutral" variant="outline" size="xl" class="mt-8 px-6" />
      </div>

      <UAccordion
        :items="faq.items"
        :ui="{
          root: 'lg:col-span-8 border-t border-default',
          item: 'border-b border-default',
          trigger: 'py-5 text-base sm:text-lg text-highlighted tracking-[0.03em] gap-4',
          trailingIcon: 'text-muted',
          body: 'pb-6 pe-10 text-base text-toned leading-[1.8]',
        }"
      />
    </UContainer>
  </section>
</template>

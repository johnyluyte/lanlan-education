<script setup lang="ts">
  // 老師的獎勵章：雙圈＋文字＋兩顆星，用雜訊濾鏡做出蓋章時的斑駁墨色
  defineProps<{
    text: string
  }>()
</script>

<template>
  <svg viewBox="0 0 120 120" class="text-brand-600" aria-hidden="true">
    <defs>
      <filter id="landing-stamp-ink" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 3.4" result="speckle" />
        <feComposite in="SourceGraphic" in2="speckle" operator="in" />
      </filter>
    </defs>

    <g filter="url(#landing-stamp-ink)">
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="5" />
      <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" stroke-width="1.5" />
      <text x="60" y="71" text-anchor="middle" font-size="31" fill="currentColor" class="font-display">{{ text }}</text>
      <path
        v-for="y in [27, 94]"
        :key="y"
        :transform="`translate(60 ${y})`"
        d="M0 -6L1.53 -2.1L5.71 -1.85L2.47 0.8L3.53 4.85L0 2.6L-3.53 4.85L-2.47 0.8L-5.71 -1.85L-1.53 -2.1Z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { toZhuyinSegments } from '#alias-shared/zhuyin/zhuyin'

  const props = defineProps<{
    text: string
  }>()

  const segments = computed(() => toZhuyinSegments(props.text))
</script>

<template>
  <span class="inline-flex flex-wrap items-end">
    <template v-for="(segment, index) in segments" :key="index">
      <span v-if="segment.symbols" class="inline-flex items-center">
        <span>{{ segment.char }}</span>
        <span class="relative ml-0.5 inline-flex flex-col justify-center text-[0.4em] leading-none">
          <span v-for="(symbol, symbolIndex) in segment.symbols" :key="symbolIndex">{{ symbol }}</span>
          <!-- 輕聲：點標在符號欄左上角 -->
          <span v-if="segment.tone === '˙'" class="absolute -top-1 -left-1">{{ segment.tone }}</span>
          <!-- 二、三、四聲：貼在符號欄右側置中 -->
          <span v-else-if="segment.tone" class="absolute top-1/2 -right-1 -translate-y-1/2">{{ segment.tone }}</span>
        </span>
      </span>
      <span v-else>{{ segment.char }}</span>
    </template>
  </span>
</template>

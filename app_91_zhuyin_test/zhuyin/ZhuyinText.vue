<script setup lang="ts">
  import { computed } from 'vue'
  import { toZhuyinSegments } from '#alias-zhuyin-test/zhuyin/zhuyin'

  const props = withDefaults(
    defineProps<{
      text: string
      gapLeft?: number // 中文字與注音符號欄之間的左邊距離（px）
      gapRight?: number // 注音符號欄右側距離（px），影響跟下一個字之間的間距
      toneGap?: number // 二、三、四聲聲調符號與左邊注音符號欄的距離（px）
    }>(),
    {
      gapLeft: 2,
      gapRight: 0,
      toneGap: 4,
    },
  )

  const segments = computed(() => toZhuyinSegments(props.text))
</script>

<template>
  <span class="inline-flex flex-wrap items-end">
    <template v-for="(segment, index) in segments" :key="index">
      <span v-if="segment.symbols" class="inline-flex items-center">
        <span>{{ segment.char }}</span>
        <span
          class="relative inline-flex flex-col justify-center text-[0.4em] leading-none"
          :style="{ marginLeft: `${gapLeft}px`, marginRight: `${gapRight}px` }"
        >
          <span v-for="(symbol, symbolIndex) in segment.symbols" :key="symbolIndex">{{ symbol }}</span>
          <!-- 輕聲：點標在符號欄左上角 -->
          <span v-if="segment.tone === '˙'" class="absolute -top-1 -left-1">{{ segment.tone }}</span>
          <!-- 二、三、四聲：貼在符號欄右側置中 -->
          <span v-else-if="segment.tone" class="absolute top-1/2 -translate-y-1/2" :style="{ right: `-${toneGap}px` }">{{
            segment.tone
          }}</span>
        </span>
      </span>
      <span v-else>{{ segment.char }}</span>
    </template>
  </span>
</template>

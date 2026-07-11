<script setup lang="ts">
  import { computed } from 'vue'
  import { toZhuyinSegments } from '#alias-zhuyin-test/zhuyin/zhuyin'

  const props = withDefaults(
    defineProps<{
      text: string
      gapLeft?: number // 中文字與注音符號欄之間的左邊距離（px）
      gapRight?: number // 注音符號欄右側距離（px），影響跟下一個字之間的間距
      toneGap?: number // 二、三、四聲聲調符號與左邊注音符號欄的距離（px）
      fontSize?: number // 注音符號字體大小，相對中文字級的倍率（em）
      lineHeight?: number // 換行時，行與行之間的間距（px）；注音字體變大時，行距要跟著加大避免重疊
      charFontSize?: number // 中文字級大小（px）；注音字級是相對這個值的倍率，改這個會連帶影響注音大小
      symbolScaleY?: number // 注音符號垂直縮放比例（1 = 不縮放）；只壓縮高度、不影響寬度，類似 Photoshop 非等比縮放
    }>(),
    {
      gapLeft: 2,
      gapRight: 0,
      toneGap: 4,
      fontSize: 0.4,
      lineHeight: 8,
      charFontSize: 24,
      symbolScaleY: 1,
    },
  )

  const segments = computed(() => toZhuyinSegments(props.text))

  function getSymbolStyle(symbols: string[]) {
    if (symbols.length === 0) {
      return
    } else if (symbols.length === 1) {
      return { transform: `scaleY(${props.symbolScaleY}) translateY(1px)`, marginTop: `` }
    } else if (symbols.length === 2) {
      return { transform: `scaleY(${props.symbolScaleY}) translateY(0.5px)`, marginTop: `2px` }
    } else if (symbols.length === 3) {
      return { transform: `scaleY(${props.symbolScaleY}) translateY(1px)`, marginTop: `-1px` }
    }
  }
</script>

<template>
  <span class="inline-flex flex-wrap items-end" :style="{ rowGap: `${lineHeight}px`, fontSize: `${charFontSize}px` }">
    <template v-for="(segment, index) in segments" :key="index">
      <span v-if="segment.symbols" class="inline-flex items-center">
        <span>{{ segment.char }}</span>
        <span
          class="relative inline-flex flex-col items-center justify-center leading-none font-semibold"
          :style="{ marginLeft: `${gapLeft}px`, marginRight: `${gapRight}px`, fontSize: `${fontSize}em` }"
        >
          <span v-for="(symbol, symbolIndex) in segment.symbols" :key="symbolIndex" :style="getSymbolStyle(segment.symbols)">{{
            symbol
          }}</span>
          <!-- 輕聲：點標在符號欄左上角 -->
          <span v-if="segment.tone === '˙'" class="absolute -top-1 left-0.5">{{ segment.tone }}</span>
          <!-- 二、三、四聲：貼在符號欄右側置中 -->
          <span v-else-if="segment.tone" class="absolute top-1/2 -translate-y-1/11" :style="{ right: `-${toneGap}px` }">{{
            segment.tone
          }}</span>
        </span>
      </span>
      <span v-else>{{ segment.char }}</span>
    </template>
  </span>
</template>

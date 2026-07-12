<script setup lang="ts">
  import type { BmiCategory } from './bmi'

  const props = defineProps<{
    bmi: number | null
    category: BmiCategory | null
  }>()

  // 四級 → 顯示標籤與 UBadge 顏色
  const CATEGORY_META: Record<BmiCategory, { label: string; color: 'info' | 'success' | 'warning' | 'error' }> = {
    underweight: { label: '過輕', color: 'info' },
    normal: { label: '正常', color: 'success' },
    overweight: { label: '過重', color: 'warning' },
    obese: { label: '肥胖', color: 'error' },
  }

  const meta = computed(() => (props.category ? CATEGORY_META[props.category] : null))
  const bmiText = computed(() => (props.bmi == null ? '—' : props.bmi.toFixed(1)))
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-gray-200 p-6 dark:border-gray-700">
    <span class="text-sm text-gray-500 dark:text-gray-400">你的 BMI</span>
    <span class="text-5xl font-bold tabular-nums">{{ bmiText }}</span>
    <UBadge v-if="meta" :color="meta.color" variant="subtle" size="lg" class="text-base">
      {{ meta.label }}
    </UBadge>
    <span v-else class="text-sm text-gray-400">請輸入身高體重</span>
  </div>
</template>

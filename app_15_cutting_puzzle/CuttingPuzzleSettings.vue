<script setup lang="ts">
  // 控制面板：M（列數）、N（欄數）。參考 app_20_imitate_dot/ImitateDotSettings.vue 的慣例。
  defineProps<{
    min: number // rows/cols 下限
    max: number // rows/cols 上限
  }>()
  const emit = defineEmits<{
    shuffle: []
    restore: []
  }>()

  const rows = defineModel<number>('rows', { required: true })
  const cols = defineModel<number>('cols', { required: true })
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <div>
      <span class="text-sm font-medium">列數 M (rows)：{{ rows }}</span>
      <USlider v-model="rows" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">欄數 N (cols)：{{ cols }}</span>
      <USlider v-model="cols" :min="min" :max="max" :step="1" class="mt-3" />
    </div>
    <div class="border-muted flex flex-col gap-3 border-t pt-4">
      <UButton icon="i-lucide-shuffle" label="打亂順序" color="neutral" variant="soft" block @click="emit('shuffle')" />
      <UButton icon="i-lucide-rotate-ccw" label="恢復順序" color="neutral" variant="outline" block @click="emit('restore')" />
    </div>
  </div>
</template>

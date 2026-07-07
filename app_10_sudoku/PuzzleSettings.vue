<script setup lang="ts">
  // 題目設定面板：控制題目大小、換新題目、遮罩顯示格子數。
  // base / shownCount 用 v-model 雙向綁定；換新題目、套用遮罩以事件回報父層。
  defineProps<{
    baseOptions: number[]
    minShown: number
    total: number
  }>()

  const base = defineModel<number>('base', { required: true })
  const shownCount = defineModel<number>('shownCount', { required: true })

  const emit = defineEmits<{
    newAnswer: []
    reroll: []
  }>()
</script>

<template>
  <div class="flex w-64 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <h2 class="border-muted border-b pb-2 text-center text-base font-bold">題目設定</h2>

    <h3 class="text-base">題目</h3>
    <div class="flex flex-col gap-6">
      <div>
        <span class="text-sm font-medium">大小：</span>
        <UFieldGroup orientation="horizontal" class="mt-3 flex-wrap">
          <UButton
            v-for="b in baseOptions"
            :key="b"
            :color="base === b ? 'primary' : 'neutral'"
            :variant="base === b ? 'solid' : 'outline'"
            @click="
              () => {
                base = b
              }
            "
          >
            {{ b * b }} × {{ b * b }}
          </UButton>
        </UFieldGroup>
      </div>
      <UButton icon="i-lucide-dices" color="primary" block @click="emit('newAnswer')">換新題目</UButton>
    </div>

    <h3 class="mt-6 text-base">遮罩</h3>
    <div class="flex flex-col gap-6">
      <div>
        <span class="text-sm font-medium">顯示格子數：{{ shownCount }} / {{ total }}</span>
        <USlider v-model="shownCount" :min="minShown" :max="total" :step="1" class="mt-3" />
      </div>
      <UButton icon="i-lucide-shuffle" color="neutral" block @click="emit('reroll')">套用遮罩設定</UButton>
    </div>
  </div>
</template>

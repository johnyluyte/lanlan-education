<script setup lang="ts">
  // 控制面板：3D 場景相關控制（重置視角、目前是否選取到方塊）。跟 ThreeDBox2DSettings.vue 同一套卡片樣式。
  defineProps<{
    isCubeSelected: boolean
  }>()

  defineEmits<{ reset: [] }>()
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <span class="text-sm font-medium">3D 場景控制</span>
    <UButton icon="i-lucide-rotate-ccw" label="重置視角" color="neutral" variant="outline" block @click="$emit('reset')" />
    <UBadge :color="isCubeSelected ? 'primary' : 'neutral'" variant="soft" class="w-fit">
      {{ isCubeSelected ? '已點選正方體' : '未點選正方體' }}
    </UBadge>
  </div>
</template>

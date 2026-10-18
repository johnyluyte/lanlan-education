<script setup lang="ts">
  // 控制面板：3D 場景相關控制（重置視角、切換場景、目前是否選取到方塊）。跟 ThreeDBox2DSettings.vue 同一套卡片樣式。
  defineProps<{
    isCubeSelected: boolean
    sceneMode: 'default' | 'dynamic'
    showCompass: boolean
  }>()

  defineEmits<{ reset: []; selectScene: ['default' | 'dynamic']; screenshot: []; toggleCompass: [] }>()
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <span class="text-sm font-medium">3D 場景控制</span>

    <UButton icon="i-lucide-rotate-ccw" label="重置視角" color="neutral" variant="outline" block @click="$emit('reset')" />
    <UButton icon="i-lucide-camera" label="截圖" color="neutral" variant="outline" block @click="$emit('screenshot')" />
    <UButton
      :icon="showCompass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
      :label="showCompass ? '隱藏東南西北字樣' : '顯示東南西北字樣'"
      color="neutral"
      variant="outline"
      block
      @click="$emit('toggleCompass')"
    />

    <div class="flex flex-col gap-2">
      <UButton
        label="預設場景"
        :color="sceneMode === 'default' ? 'primary' : 'neutral'"
        :variant="sceneMode === 'default' ? 'solid' : 'outline'"
        block
        @click="$emit('selectScene', 'default')"
      />
      <UButton
        label="動態場景"
        :color="sceneMode === 'dynamic' ? 'primary' : 'neutral'"
        :variant="sceneMode === 'dynamic' ? 'solid' : 'outline'"
        block
        @click="$emit('selectScene', 'dynamic')"
      />
    </div>

    <UBadge :color="isCubeSelected ? 'primary' : 'neutral'" variant="soft" class="w-fit">
      {{ isCubeSelected ? '已點選正方體' : '未點選正方體' }}
    </UBadge>
  </div>
</template>

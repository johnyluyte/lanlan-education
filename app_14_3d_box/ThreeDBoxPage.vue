<script setup lang="ts">
  import { ref } from 'vue'
  import ThreeDBox2DSettings from './ThreeDBox2DSettings.vue'
  import ThreeDBox3DSettings from './ThreeDBox3DSettings.vue'
  import ThreeDBoxScene from './ThreeDBoxScene.vue'
  import type { SquareCell } from './squareCell'

  const MIN_GRID_SIZE = 2
  const MAX_GRID_SIZE = 10

  const rows = ref(4) // M：列數
  const cols = ref(4) // N：欄數
  const squareCells = ref<SquareCell[]>([]) // 哪些 cell 有 square；動態場景依此生成 cube

  const isCubeSelected = ref(false)
  const sceneMode = ref<'default' | 'dynamic'>('default')
  const showCompass = ref(true)
  const sceneRef = ref<InstanceType<typeof ThreeDBoxScene> | null>(null)

  function resetView() {
    sceneRef.value?.resetView()
  }

  function captureScreenshot() {
    sceneRef.value?.captureScreenshot()
  }
</script>

<template>
  <div class="flex items-start gap-6 p-8">
    <div class="flex flex-col gap-6">
      <ThreeDBox2DSettings
        v-model:rows="rows"
        v-model:cols="cols"
        v-model:square-cells="squareCells"
        :min="MIN_GRID_SIZE"
        :max="MAX_GRID_SIZE"
      />
      <ThreeDBox3DSettings
        :is-cube-selected="isCubeSelected"
        :scene-mode="sceneMode"
        :show-compass="showCompass"
        @reset="resetView"
        @select-scene="(mode) => (sceneMode = mode)"
        @screenshot="captureScreenshot"
        @toggle-compass="showCompass = !showCompass"
      />
    </div>

    <ThreeDBoxScene
      ref="sceneRef"
      v-model:is-cube-selected="isCubeSelected"
      :scene-mode="sceneMode"
      :rows="rows"
      :cols="cols"
      :square-cells="squareCells"
      :show-compass="showCompass"
      class="h-[calc(100vh-8rem)] w-full flex-1"
    />
  </div>
</template>

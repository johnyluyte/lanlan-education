<script setup lang="ts">
  import { onMounted, ref, shallowRef } from 'vue'
  import { createEdgeCanvas } from './createEdgeCanvas'
  import PotraceOutlineDemo from './PotraceOutlineDemo.vue'
  import ImageTracerOutlineDemo from './ImageTracerOutlineDemo.vue'
  import exampleImage from './example3.png'

  const threshold = ref(120)
  const edgeCanvas = shallowRef<HTMLCanvasElement | null>(null)
  const edgeDataUrl = ref('')
  const isGenerating = ref(false)

  async function generateEdgeCanvas() {
    isGenerating.value = true
    const canvas = await createEdgeCanvas(threshold.value)
    edgeCanvas.value = canvas
    edgeDataUrl.value = canvas.toDataURL()
    isGenerating.value = false
  }

  onMounted(generateEdgeCanvas)
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <div class="flex w-full max-w-3xl flex-wrap items-end gap-4 rounded-md bg-white/85 p-4 shadow-sm dark:bg-gray-950/80">
      <UFormField label="邊緣偵測閾值" class="w-64">
        <USlider v-model="threshold" :min="20" :max="400" :step="10" />
      </UFormField>
      <UButton icon="i-lucide-refresh-cw" label="重新產生外框" color="primary" :loading="isGenerating" @click="generateEdgeCanvas" />
    </div>

    <div class="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="flex flex-col items-center gap-2">
        <h3 class="text-sm font-semibold text-gray-500">原圖</h3>
        <img :src="exampleImage" alt="原圖" class="aspect-1215/717 w-full rounded border object-cover" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h3 class="text-sm font-semibold text-gray-500">邊緣偵測（共用輸入）</h3>
        <img
          v-if="edgeDataUrl"
          :src="edgeDataUrl"
          alt="邊緣偵測結果"
          class="aspect-1215/717 w-full rounded border bg-white object-contain"
        />
      </div>

      <PotraceOutlineDemo :source="edgeCanvas" />
      <ImageTracerOutlineDemo :source="edgeCanvas" />
    </div>
  </div>
</template>

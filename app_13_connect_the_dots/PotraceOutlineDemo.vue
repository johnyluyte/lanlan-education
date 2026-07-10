<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { potrace, init } from 'esm-potrace-wasm'
  import { useSvgObjectUrl } from './useSvgObjectUrl'

  const props = defineProps<{ source: HTMLCanvasElement | null }>()

  const { url: svgUrl, setSvgMarkup } = useSvgObjectUrl()
  const isLoading = ref(false)
  const elapsedMs = ref<number | null>(null)
  const errorMessage = ref('')

  let isInitialized = false

  watch(
    () => props.source,
    async (canvas) => {
      if (!canvas) return

      isLoading.value = true
      errorMessage.value = ''

      try {
        if (!isInitialized) {
          await init()
          isInitialized = true
        }

        const startTime = performance.now()
        const result = await potrace(canvas, {
          turdsize: 2,
          turnpolicy: 4,
          alphamax: 1,
          opticurve: 1,
          opttolerance: 0.2,
          pathonly: false,
          extractcolors: false,
          posterizelevel: 1,
          posterizationalgorithm: 0,
        })
        setSvgMarkup(Array.isArray(result) ? result.join('') : result)
        elapsedMs.value = Math.round(performance.now() - startTime)
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : String(error)
      } finally {
        isLoading.value = false
      }
    },
    { immediate: true },
  )
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <h3 class="text-sm font-semibold text-gray-500">potrace (esm-potrace-wasm)</h3>
    <div class="aspect-1215/717 w-full rounded border bg-white">
      <div v-if="isLoading" class="flex h-full items-center justify-center">
        <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-gray-400" />
      </div>
      <div v-else-if="errorMessage" class="flex h-full items-center justify-center p-2 text-center text-xs text-red-500">
        {{ errorMessage }}
      </div>
      <img v-else :src="svgUrl" alt="potrace 外框結果" class="h-full w-full object-contain" />
    </div>
    <span v-if="elapsedMs !== null" class="text-xs text-gray-400">{{ elapsedMs }} ms</span>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import ImageTracer from 'imagetracerjs'
  import { useSvgObjectUrl } from './useSvgObjectUrl'

  const props = defineProps<{ source: HTMLCanvasElement | null }>()

  const { url: svgUrl, setSvgMarkup } = useSvgObjectUrl()
  const elapsedMs = ref<number | null>(null)
  const errorMessage = ref('')

  watch(
    () => props.source,
    (canvas) => {
      if (!canvas) return

      errorMessage.value = ''

      try {
        const imageData = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)

        const startTime = performance.now()
        const svgMarkup = ImageTracer.imagedataToSVG(imageData, {
          ltres: 1,
          qtres: 1,
          pathomit: 4,
          numberofcolors: 2,
        })
        setSvgMarkup(svgMarkup)
        elapsedMs.value = Math.round(performance.now() - startTime)
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : String(error)
      }
    },
    { immediate: true },
  )
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <h3 class="text-sm font-semibold text-gray-500">imagetracerjs</h3>
    <div class="aspect-1215/717 w-full rounded border bg-white">
      <div v-if="errorMessage" class="flex h-full items-center justify-center p-2 text-center text-xs text-red-500">
        {{ errorMessage }}
      </div>
      <img v-else :src="svgUrl" alt="imagetracerjs 外框結果" class="h-full w-full object-contain" />
    </div>
    <span v-if="elapsedMs !== null" class="text-xs text-gray-400">{{ elapsedMs }} ms</span>
  </div>
</template>

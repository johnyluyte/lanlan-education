<script setup lang="ts">
  // 場景外殼（相機／燈光／地板／格線／控制器），Cube 已拆成獨立元件。改用 TresJS 宣告式寫法，不再手動管理 renderer/scene/animate loop。
  // 注意：useTres()/useTresContext() 只能在 <TresCanvas> 底下的子元件呼叫；這裡跟 <TresCanvas> 同層，
  // 故相機/控制器改用 template ref 直接拿底層 Three.js 物件，resize 監聽沿用 useResizeObserver。
  import { ref } from 'vue'
  import { useResizeObserver } from '@vueuse/core'
  import Cube from './Cube.vue'

  const isCubeSelected = ref(false)
  const viewportEl = ref<HTMLElement | null>(null)
  const cameraRef = ref()
  const controlsRef = ref()

  useResizeObserver(viewportEl, () => {
    if (!viewportEl.value || !cameraRef.value) return

    const { width, height } = viewportEl.value.getBoundingClientRect()
    if (width <= 0 || height <= 0) return

    cameraRef.value.aspect = width / height
    cameraRef.value.updateProjectionMatrix()
  })

  function resetView() {
    if (!cameraRef.value || !controlsRef.value) return

    cameraRef.value.position.set(5, 5, 5)
    controlsRef.value.instance.target.set(0, 0, 0)
    controlsRef.value.instance.update()
  }
</script>

<template>
  <div ref="viewportEl" class="relative overflow-hidden bg-slate-100 dark:bg-slate-950">
    <TresCanvas
      shadows
      shadow-map-type="PCFShadowMap"
      clear-color="#eef2ff"
      :dpr="[1, 2]"
      preserve-drawing-buffer
      @pointermissed="isCubeSelected = false"
    >
      <TresPerspectiveCamera ref="cameraRef" :position-x="5" :position-y="5" :position-z="5" :args="[45, 1, 0.1, 100]" />
      <OrbitControls ref="controlsRef" make-default :enable-damping="true" :enable-pan="false" :min-distance="3.5" :max-distance="9" />

      <TresHemisphereLight :args="['#ffffff', '#94a3b8', 1.8]" />
      <TresDirectionalLight :args="['#ffffff', 2.8]" :position-x="4" :position-y="6" :position-z="5" cast-shadow />

      <Cube @click="isCubeSelected = true" />

      <TresMesh :rotation-x="-Math.PI / 2" :position-y="-1.35" receive-shadow @click="isCubeSelected = false">
        <TresCircleGeometry :args="[2.4, 72]" />
        <TresMeshStandardMaterial color="#f8fafc" :roughness="0.72" :metalness="0" />
      </TresMesh>

      <TresGridHelper :args="[7, 14, '#94a3b8', '#cbd5e1']" :position-y="-1.34" />
    </TresCanvas>

    <div class="absolute top-4 left-4 flex items-center gap-2 rounded-md bg-white/85 p-2 shadow-sm backdrop-blur dark:bg-gray-950/80">
      <UButton icon="i-lucide-rotate-ccw" label="重置" color="neutral" variant="outline" @click="resetView" />
      <UBadge :color="isCubeSelected ? 'primary' : 'neutral'" variant="soft">
        {{ isCubeSelected ? '已點選正方體' : '未點選正方體' }}
      </UBadge>
    </div>
  </div>
</template>

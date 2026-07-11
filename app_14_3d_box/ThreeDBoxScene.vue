<script setup lang="ts">
  // 場景外殼（相機／燈光／地板／格線／控制器），Cube 已拆成獨立元件。改用 TresJS 宣告式寫法，不再手動管理 renderer/scene/animate loop。
  // 注意：useTres()/useTresContext() 只能在 <TresCanvas> 底下的子元件呼叫；這裡跟 <TresCanvas> 同層，
  // 故相機/控制器改用 template ref 直接拿底層 Three.js 物件，resize 監聽沿用 useResizeObserver。
  import { ref } from 'vue'
  import { useResizeObserver } from '@vueuse/core'
  import { CanvasTexture, SRGBColorSpace } from 'three'
  import Cube from './Cube.vue'

  // 畫一張圓角底 + 文字的貼圖，給 TresSprite 當 map 用。Sprite 會自動一直面向鏡頭（billboard），
  // 純 Three.js 原生做法，不牽涉 DOM-in-3D 橋接（那套會跟 Nuxt 的 Vue runtime 衝突，整個 app 會掛掉）。
  function createLabelTexture(text: string) {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128

    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.beginPath()
    ctx.roundRect(4, 4, 120, 120, 24)
    ctx.fill()

    ctx.fillStyle = '#111827'
    ctx.font = 'bold 72px "Noto Sans TC", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 64, 68)

    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }

  const isCubeSelected = ref(false)
  const viewportEl = ref<HTMLElement | null>(null)
  const cameraRef = ref()
  const controlsRef = ref()

  const DEFAULT_CAMERA_POSITION: [number, number, number] = [15, 10, 18]

  // 方位約定：-Z 為北（畫面深處、離相機較遠），+Z 為南。目前場景沒有指北針之類的 UI，這是暫定的慣例。
  // 顏色用 Cube.vue 預設的固定色盤（不覆寫 colors）——顏色是油漆在實體面上的，
  // 對面關係固定不變（黃(+X)↔紅(-X)、綠(+Y)↔藍(-Y)、紫(+Z)↔橘(-Z)）。要哪色朝上只能靠旋轉整個方塊達成，
  // 這樣「黃在上時紅必定在下」才會自動成立，而不是每個 cube 各自换贴一套顏色。
  const cubes: { position: [number, number, number]; rotation: [number, number, number] }[] = [
    { position: [-2, 0, 0], rotation: [0, 0, Math.PI / 2] }, // 繞 Z 轉 90 度：+X(黃) 轉到上面，-X(紅) 自動到下面
    { position: [0, 0, 0], rotation: [0, 0, 0] }, // 預設姿態：+Y(綠) 在上，-Y(藍) 在下
    { position: [2, 0, 0], rotation: [Math.PI, 0, 0] }, // 繞 X 轉 180 度：-Y(藍) 轉到上面，+Y(綠) 自動到下面
    { position: [2, 0, -2], rotation: [Math.PI / 2, 0, 0] }, // 藍在上那個 cube 的北方；繞 X 轉 90 度：-Z(橘) 轉到上面，+Z(紫) 自動到下面
    { position: [4, 0, 0], rotation: [0, 0, 0] }, // 藍在上那個 cube 的東方；預設姿態：+Y(綠) 在上
    { position: [6, 0, 0], rotation: [-Math.PI / 2, 0, 0] }, // 再往東一格；繞 X 轉 -90 度：+Z(紫) 轉到上面，-Z(橘) 自動到下面
  ]

  // 東南西北字樣，放在地板邊緣（跟 floor 半徑對齊），方便使用者理解方位約定
  const COMPASS_LABEL_DISTANCE = 8.5
  const compassLabels = [
    { label: '北', position: [0, 0, -COMPASS_LABEL_DISTANCE] as [number, number, number], texture: createLabelTexture('北') },
    { label: '南', position: [0, 0, COMPASS_LABEL_DISTANCE] as [number, number, number], texture: createLabelTexture('南') },
    { label: '東', position: [COMPASS_LABEL_DISTANCE, 0, 0] as [number, number, number], texture: createLabelTexture('東') },
    { label: '西', position: [-COMPASS_LABEL_DISTANCE, 0, 0] as [number, number, number], texture: createLabelTexture('西') },
  ]

  useResizeObserver(viewportEl, () => {
    if (!viewportEl.value || !cameraRef.value) return

    const { width, height } = viewportEl.value.getBoundingClientRect()
    if (width <= 0 || height <= 0) return

    cameraRef.value.aspect = width / height
    cameraRef.value.updateProjectionMatrix()
  })

  function resetView() {
    if (!cameraRef.value || !controlsRef.value) return

    cameraRef.value.position.set(...DEFAULT_CAMERA_POSITION)
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
      <TresPerspectiveCamera
        ref="cameraRef"
        :position-x="DEFAULT_CAMERA_POSITION[0]"
        :position-y="DEFAULT_CAMERA_POSITION[1]"
        :position-z="DEFAULT_CAMERA_POSITION[2]"
        :args="[45, 1, 0.1, 100]"
      />
      <OrbitControls ref="controlsRef" make-default :enable-damping="true" :enable-pan="false" :min-distance="5" :max-distance="32" />

      <TresHemisphereLight :args="['#ffffff', '#94a3b8', 1.8]" />
      <TresDirectionalLight :args="['#ffffff', 2.8]" :position-x="4" :position-y="6" :position-z="5" cast-shadow />

      <Cube v-for="(cube, i) in cubes" :key="i" :position="cube.position" :rotation="cube.rotation" @click="isCubeSelected = true" />

      <TresMesh :rotation-x="-Math.PI / 2" :position-y="-1.35" receive-shadow @click="isCubeSelected = false">
        <TresCircleGeometry :args="[8.5, 72]" />
        <TresMeshStandardMaterial color="#f8fafc" :roughness="0.72" :metalness="0" />
      </TresMesh>

      <TresGridHelper :args="[20, 40, '#94a3b8', '#cbd5e1']" :position-y="-1.34" />

      <TresSprite
        v-for="compass in compassLabels"
        :key="compass.label"
        :position-x="compass.position[0]"
        :position-y="compass.position[1]"
        :position-z="compass.position[2]"
        :scale-x="1.4"
        :scale-y="1.4"
        :scale-z="1.4"
      >
        <TresSpriteMaterial :map="compass.texture" transparent :depth-test="false" />
      </TresSprite>
    </TresCanvas>

    <div class="absolute top-4 left-4 flex items-center gap-2 rounded-md bg-white/85 p-2 shadow-sm backdrop-blur dark:bg-gray-950/80">
      <UButton icon="i-lucide-rotate-ccw" label="重置" color="neutral" variant="outline" @click="resetView" />
      <UBadge :color="isCubeSelected ? 'primary' : 'neutral'" variant="soft">
        {{ isCubeSelected ? '已點選正方體' : '未點選正方體' }}
      </UBadge>
    </div>
  </div>
</template>

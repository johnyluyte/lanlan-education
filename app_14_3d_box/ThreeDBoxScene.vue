<script setup lang="ts">
  // 場景外殼（相機／燈光／地板／格線／控制器），Cube 已拆成獨立元件。改用 TresJS 宣告式寫法，不再手動管理 renderer/scene/animate loop。
  // 注意：useTres()/useTresContext() 只能在 <TresCanvas> 底下的子元件呼叫；這裡跟 <TresCanvas> 同層，
  // 故相機/控制器改用 template ref 直接拿底層 Three.js 物件，resize 監聽沿用 useResizeObserver。
  import { computed, ref } from 'vue'
  import { useResizeObserver } from '@vueuse/core'
  import { CanvasTexture, SRGBColorSpace } from 'three'
  import Cube from './Cube.vue'
  import type { SquareCell } from './squareCell'

  type SceneMode = 'default' | 'dynamic'
  type CubeConfig = { position: [number, number, number]; rotation: [number, number, number] }

  const props = withDefaults(
    defineProps<{ sceneMode?: SceneMode; rows?: number; cols?: number; squareCells?: SquareCell[]; showCompass?: boolean }>(),
    {
      sceneMode: 'default',
      rows: 1,
      cols: 1,
      squareCells: () => [],
      showCompass: true,
    },
  )

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

  const isCubeSelected = defineModel<boolean>('isCubeSelected', { default: false })
  const viewportEl = ref<HTMLElement | null>(null)
  const cameraRef = ref()
  const controlsRef = ref()

  // 方位約定：-Z 為北（畫面深處、離相機較遠），+Z 為南。目前場景沒有指北針之類的 UI，這是暫定的慣例。
  // 顏色用 Cube.vue 預設的固定色盤（不覆寫 colors）——顏色是油漆在實體面上的，
  // 對面關係固定不變（黃(+X)↔紅(-X)、綠(+Y)↔藍(-Y)、紫(+Z)↔橘(-Z)）。要哪色朝上只能靠旋轉整個方塊達成，
  // 這樣「黃在上時紅必定在下」才會自動成立，而不是每個 cube 各自换贴一套顏色。
  const DEFAULT_SCENE_CUBES: CubeConfig[] = [
    { position: [-2, 0, 0], rotation: [0, 0, Math.PI / 2] }, // 繞 Z 轉 90 度：+X(黃) 轉到上面，-X(紅) 自動到下面
    { position: [0, 0, 0], rotation: [0, 0, 0] }, // 預設姿態：+Y(綠) 在上，-Y(藍) 在下
    { position: [2, 0, 0], rotation: [Math.PI, 0, 0] }, // 繞 X 轉 180 度：-Y(藍) 轉到上面，+Y(綠) 自動到下面
    { position: [2, 0, -2], rotation: [Math.PI / 2, 0, 0] }, // 藍在上那個 cube 的北方；繞 X 轉 90 度：-Z(橘) 轉到上面，+Z(紫) 自動到下面
    { position: [6, 0, 0], rotation: [-Math.PI / 2, 0, 0] }, // 繞 X 轉 -90 度：+Z(紫) 轉到上面，-Z(橘) 自動到下面
  ]

  // 顏色 → 讓該色轉到頂面所需的旋轉，對應 Cube.vue 固定色盤：黃(+X)/紅(-X)/綠(+Y)/藍(-Y)/紫(+Z)/橘(-Z)。
  // 若 square 顏色不在這 6 色內（例如使用者自訂色碼），沒有對應的 cube 面可用，退回不轉（綠在上）。
  const TOP_ROTATION_BY_COLOR: Record<string, [number, number, number]> = {
    '#facc15': [0, 0, Math.PI / 2], // 黃
    '#f87171': [0, 0, -Math.PI / 2], // 紅
    '#4ade80': [0, 0, 0], // 綠
    '#60a5fa': [Math.PI, 0, 0], // 藍
    '#c084fc': [-Math.PI / 2, 0, 0], // 紫
    '#fb923c': [Math.PI / 2, 0, 0], // 橘
  }
  const DEFAULT_TOP_ROTATION: [number, number, number] = [0, 0, 0]
  const CUBE_SPACING = 2 // 跟 Cube 預設 size 一致，邊對邊相鄰

  // 動態場景：依 ThreeDBox2DSettings 產生的 squareCells 生成對應 cube（top-down 視角）。
  // col 對應 X（西→東）、row 對應 Z（北→南），整個 M x N 網格置中在原點。
  // value 代表該格要疊幾個 cube（例如 2 就疊 2 個），沿 Y 軸一個接一個往上疊，顏色（頂面朝向）都跟 cell 一致。
  const dynamicSceneCubes = computed<CubeConfig[]>(() =>
    props.squareCells.flatMap((cell) => {
      const x = (cell.col - (props.cols - 1) / 2) * CUBE_SPACING
      const z = (cell.row - (props.rows - 1) / 2) * CUBE_SPACING
      const rotation = TOP_ROTATION_BY_COLOR[cell.color] ?? DEFAULT_TOP_ROTATION

      return Array.from({ length: cell.value }, (_, layer) => ({
        position: [x, layer * CUBE_SPACING, z] as [number, number, number],
        rotation,
      }))
    }),
  )

  const cubes = computed(() => (props.sceneMode === 'dynamic' ? dynamicSceneCubes.value : DEFAULT_SCENE_CUBES))

  // 場景實際範圍：依目前顯示的 cubes 算出離原點最遠的角落距離，地板／格線／指標字樣／可拉遠距離都依此縮放，
  // 這樣不管是「預設場景」還是「動態場景」的 M x N 多大，畫面都會自動放得下。
  const CUBE_HALF_SIZE = 1 // Cube 預設 size=2
  const MIN_SCENE_EXTENT = 3 // 沒有任何 cube 時（例如動態場景剛清空）地板仍保留最小尺寸，不會縮成一個點
  const FLOOR_MARGIN = 2.5

  const sceneExtent = computed(() => {
    let maxDist = 0
    for (const cube of cubes.value) {
      const [x, , z] = cube.position
      maxDist = Math.max(
        maxDist,
        Math.hypot(x - CUBE_HALF_SIZE, z - CUBE_HALF_SIZE),
        Math.hypot(x + CUBE_HALF_SIZE, z - CUBE_HALF_SIZE),
        Math.hypot(x - CUBE_HALF_SIZE, z + CUBE_HALF_SIZE),
        Math.hypot(x + CUBE_HALF_SIZE, z + CUBE_HALF_SIZE),
      )
    }
    return Math.max(maxDist, MIN_SCENE_EXTENT)
  })

  const floorRadius = computed(() => sceneExtent.value + FLOOR_MARGIN)
  const gridSize = computed(() => Math.ceil((floorRadius.value * 2) / 2) * 2) // 取偶數，維持 0.5 單位間距
  const gridDivisions = computed(() => gridSize.value * 2)
  const orbitMaxDistance = computed(() => floorRadius.value * 3.5)

  // 相機位置比例：沿用原本 [15,10,18]（對應 floorRadius 8.5）的視角比例，依新的 floorRadius 等比縮放
  const CAMERA_DISTANCE_FACTORS: [number, number, number] = [15 / 8.5, 10 / 8.5, 18 / 8.5]
  function cameraPositionForRadius(radius: number): [number, number, number] {
    return [radius * CAMERA_DISTANCE_FACTORS[0], radius * CAMERA_DISTANCE_FACTORS[1], radius * CAMERA_DISTANCE_FACTORS[2]]
  }

  // 只在 setup 當下取一次快照當初始相機位置；場景之後變大不會自動搬相機（避免跟使用者手動拖曳的 OrbitControls 打架），
  // 要重新置中請按「重置視角」，屆時會依當下實際場景範圍重新計算。
  const initialCameraPosition = cameraPositionForRadius(floorRadius.value)

  // 東南西北字樣，放在地板邊緣（跟 floor 半徑對齊），方便使用者理解方位約定
  const compassTextures = {
    north: createLabelTexture('北'),
    south: createLabelTexture('南'),
    east: createLabelTexture('東'),
    west: createLabelTexture('西'),
  }
  const compassLabels = computed(() => [
    { label: '北', position: [0, 0, -floorRadius.value] as [number, number, number], texture: compassTextures.north },
    { label: '南', position: [0, 0, floorRadius.value] as [number, number, number], texture: compassTextures.south },
    { label: '東', position: [floorRadius.value, 0, 0] as [number, number, number], texture: compassTextures.east },
    { label: '西', position: [-floorRadius.value, 0, 0] as [number, number, number], texture: compassTextures.west },
  ])

  useResizeObserver(viewportEl, () => {
    if (!viewportEl.value || !cameraRef.value) return

    const { width, height } = viewportEl.value.getBoundingClientRect()
    if (width <= 0 || height <= 0) return

    cameraRef.value.aspect = width / height
    cameraRef.value.updateProjectionMatrix()
  })

  function resetView() {
    if (!cameraRef.value || !controlsRef.value) return

    cameraRef.value.position.set(...cameraPositionForRadius(floorRadius.value))
    controlsRef.value.instance.target.set(0, 0, 0)
    controlsRef.value.instance.update()
  }

  // TresCanvas 底下就是標準 <canvas>（renderer.domElement），截圖靠原生 canvas.toDataURL 即可，
  // 不需要 three.js 額外的 API；能截到畫面全靠 <TresCanvas> 已加的 preserve-drawing-buffer。
  function captureScreenshot() {
    const canvas = viewportEl.value?.querySelector('canvas')
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `3d-box-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  defineExpose({ resetView, captureScreenshot })
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
        :position-x="initialCameraPosition[0]"
        :position-y="initialCameraPosition[1]"
        :position-z="initialCameraPosition[2]"
        :args="[45, 1, 0.1, 100]"
      />
      <OrbitControls
        ref="controlsRef"
        make-default
        :enable-damping="true"
        :enable-pan="false"
        :min-distance="5"
        :max-distance="orbitMaxDistance"
      />

      <TresHemisphereLight :args="['#ffffff', '#94a3b8', 1.8]" />
      <TresDirectionalLight :args="['#ffffff', 2.8]" :position-x="4" :position-y="6" :position-z="5" cast-shadow />

      <Cube v-for="(cube, i) in cubes" :key="i" :position="cube.position" :rotation="cube.rotation" @click="isCubeSelected = true" />

      <TresMesh :rotation-x="-Math.PI / 2" :position-y="-1.35" receive-shadow @click="isCubeSelected = false">
        <TresCircleGeometry :args="[floorRadius, 72]" />
        <TresMeshStandardMaterial color="#f8fafc" :roughness="0.72" :metalness="0" />
      </TresMesh>

      <TresGridHelper :args="[gridSize, gridDivisions, '#94a3b8', '#cbd5e1']" :position-y="-1.34" />

      <template v-if="showCompass">
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
      </template>
    </TresCanvas>
  </div>
</template>

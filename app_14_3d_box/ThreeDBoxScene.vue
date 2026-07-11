<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

  const viewportEl = ref<HTMLElement | null>(null)
  const isCubeSelected = ref(false)

  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let controls: OrbitControls | null = null
  let cube: THREE.Group | null = null
  let cubeMesh: THREE.Mesh | null = null
  let animationId: number | null = null

  const materials: THREE.Material[] = []
  const disposables: Array<{ dispose: () => void }> = []
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  function handleClick(event: MouseEvent) {
    if (!renderer || !camera || !cubeMesh) return

    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    isCubeSelected.value = raycaster.intersectObject(cubeMesh).length > 0
  }

  function resizeScene() {
    if (!viewportEl.value || !renderer || !camera) return

    const { width, height } = viewportEl.value.getBoundingClientRect()
    if (width <= 0 || height <= 0) return

    renderer.setSize(width, height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  function resetView() {
    if (!camera || !controls || !cube) return

    cube.position.set(0, 0, 0)
    cube.rotation.set(0, 0, 0)
    camera.position.set(5, 5, 5)
    controls.target.set(0, 0, 0)
    controls.update()
  }

  function animate() {
    if (!renderer || !scene || !camera || !controls || !cube) return

    controls.update()
    renderer.render(scene, camera)
    animationId = window.requestAnimationFrame(animate)
  }

  useResizeObserver(viewportEl, resizeScene)

  onMounted(() => {
    if (!viewportEl.value) return

    scene = new THREE.Scene()
    scene.background = new THREE.Color('#eef2ff')

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.className = 'block h-full w-full'
    viewportEl.value.appendChild(renderer.domElement)

    const ambientLight = new THREE.HemisphereLight('#ffffff', '#94a3b8', 1.8)
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.8)
    keyLight.position.set(4, 6, 5)
    keyLight.castShadow = true
    scene.add(ambientLight, keyLight)

    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const faceMaterials = ['#facc15', '#f87171', '#4ade80', '#60a5fa', '#c084fc', '#fb923c'].map((color) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.08,
      })
      materials.push(material)
      return material
    })

    const mesh = new THREE.Mesh(geometry, faceMaterials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    cubeMesh = mesh

    const edgesGeometry = new THREE.EdgesGeometry(geometry)
    const edgesMaterial = new THREE.LineBasicMaterial({ color: '#111827', linewidth: 2 })
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)

    cube = new THREE.Group()
    cube.add(mesh, edges)
    scene.add(cube)

    const floorGeometry = new THREE.CircleGeometry(2.4, 72)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.72,
      metalness: 0,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -1.35
    floor.receiveShadow = true
    scene.add(floor)

    const grid = new THREE.GridHelper(7, 14, '#94a3b8', '#cbd5e1')
    grid.position.y = -1.34
    scene.add(grid)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 3.5
    controls.maxDistance = 9

    renderer.domElement.addEventListener('click', handleClick)

    disposables.push(geometry, edgesGeometry, edgesMaterial, floorGeometry, floorMaterial, grid.geometry)
    if (Array.isArray(grid.material)) disposables.push(...grid.material)
    else disposables.push(grid.material)
    resetView()
    resizeScene()
    animate()
  })

  onBeforeUnmount(() => {
    if (animationId !== null) window.cancelAnimationFrame(animationId)
    controls?.dispose()
    materials.forEach((material) => material.dispose())
    disposables.forEach((item) => item.dispose())

    if (renderer) {
      renderer.domElement.removeEventListener('click', handleClick)
      renderer.dispose()
      renderer.domElement.remove()
    }

    renderer = null
    scene = null
    camera = null
    controls = null
    cube = null
    cubeMesh = null
  })
</script>

<template>
  <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-950">
    <div ref="viewportEl" class="absolute inset-0" />

    <div class="absolute top-4 left-4 flex items-center gap-2 rounded-md bg-white/85 p-2 shadow-sm backdrop-blur dark:bg-gray-950/80">
      <UButton icon="i-lucide-rotate-ccw" label="重置" color="neutral" variant="outline" @click="resetView" />
      <UBadge :color="isCubeSelected ? 'primary' : 'neutral'" variant="soft">
        {{ isCubeSelected ? '已點選正方體' : '未點選正方體' }}
      </UBadge>
    </div>
  </div>
</template>

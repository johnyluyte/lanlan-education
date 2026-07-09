<script setup lang="ts">
  // 迷宮繪製：SVG 三圖層（起終點標記 → 牆壁 → 解答），疊序 = 文件順序，不用 z-index。
  import { ref, computed, watch, toRef } from 'vue'
  import type { ContextMenuItem } from '@nuxt/ui'
  import type { Cell } from './generator'
  import { useCellPointer } from './useCellPointer'

  const props = defineProps<{
    grid: Cell[][]
    solutionPath: [number, number][]
    decorations: [number, number][] // 要放黃圓的格座標
    showSolution: boolean
    cellSize: number
    drawTotal: number // 解答逐段畫出的總秒數
  }>()

  const emit = defineEmits<{
    cellClick: [row: number, col: number]
    cellRightClick: [row: number, col: number]
  }>()

  const STROKE = 2 // 牆線寬

  const R = computed(() => props.grid.length)
  const C = computed(() => props.grid[0]?.length ?? 0)

  // SVG 尺寸；外圈牆的 stroke 有一半會超出邊界，故 viewBox 往外留半個 stroke
  const dims = computed(() => ({ w: C.value * props.cellSize, h: R.value * props.cellSize }))
  const viewBox = computed(() => `${-STROKE / 2} ${-STROKE / 2} ${dims.value.w + STROKE} ${dims.value.h + STROKE}`)

  // 【圖層：牆壁】把每道牆湊成一條 path。每道牆只由一格畫（top/left；最右欄補 right、最底列補 bottom），
  // SVG 的線畫在格線正中心、同座標重疊也不變粗，故無 border 的缺角/雙倍粗問題。
  const wallsD = computed(() => {
    const cell = props.cellSize
    let d = ''
    for (let r = 0; r < R.value; r++) {
      for (let c = 0; c < C.value; c++) {
        const x = c * cell
        const y = r * cell
        const w = props.grid[r]![c]!
        if (w.top) d += `M${x} ${y}L${x + cell} ${y}`
        if (w.left) d += `M${x} ${y}L${x} ${y + cell}`
        if (c === C.value - 1 && w.right) d += `M${x + cell} ${y}L${x + cell} ${y + cell}`
        if (r === R.value - 1 && w.bottom) d += `M${x} ${y + cell}L${x + cell} ${y + cell}`
      }
    }
    return d
  })

  // 【圖層：解答】把最短路拆成一段段連線，每段依步序上彩虹 hue（沿走向由藍漸變到桃紅），
  // 並帶 delay（正規化到 drawTotal 秒）做「逐段畫出」動畫
  const solStroke = computed(() => Math.max(2, props.cellSize * 0.28))
  const solutionSegments = computed(() => {
    const cell = props.cellSize
    const p = props.solutionPath
    const center = ([r, c]: [number, number]): [number, number] => [c * cell + cell / 2, r * cell + cell / 2]
    const segs: { x1: number; y1: number; x2: number; y2: number; color: string; delay: number }[] = []
    for (let i = 0; i < p.length - 1; i++) {
      const [x1, y1] = center(p[i]!)
      const [x2, y2] = center(p[i + 1]!)
      const t = p.length <= 1 ? 0 : i / (p.length - 1)
      segs.push({ x1, y1, x2, y2, color: `hsl(${200 + t * 140} 85% 55% / 0.75)`, delay: t * props.drawTotal })
    }
    return segs
  })

  // 解答重算或調動畫時長時遞增，用作 <g> 的 key → 重掛整層 → 動畫重播
  const drawKey = ref(0)
  watch(
    () => [props.solutionPath, props.drawTotal],
    () => {
      drawKey.value++
    },
  )

  // 滑鼠命中測試（座標→格、左/右鍵、highlight 狀態）抽到 useCellPointer；
  // clicked/rightClicked 給下方 highlight 用，命中時 emit 給父層
  const { clicked, rightClicked, onClick, onContextMenu } = useCellPointer({
    cellSize: toRef(props, 'cellSize'),
    rows: R,
    cols: C,
    onClick: (r, c) => emit('cellClick', r, c),
    onRightClick: (r, c) => emit('cellRightClick', r, c),
  })

  // 右鍵選單項目（暫時不做事）
  const menuItems: ContextMenuItem[] = [{ label: 'button1' }, { label: 'button2' }]
</script>

<template>
  <UContextMenu :items="menuItems">
    <svg
      :width="dims.w + STROKE"
      :height="dims.h + STROKE"
      :viewBox="viewBox"
      class="cursor-pointer text-gray-800 dark:text-gray-200"
      @click="onClick"
      @contextmenu="onContextMenu"
    >
      <!-- 圖層 1：起終點標記 -->
      <g class="layer-markers">
        <rect :x="0" :y="0" :width="cellSize" :height="cellSize" fill="rgb(74 222 128 / 0.4)" />
        <rect :x="(C - 1) * cellSize" :y="(R - 1) * cellSize" :width="cellSize" :height="cellSize" fill="rgb(248 113 113 / 0.4)" />
      </g>

      <!-- 圖層 1.5：左鍵點擊格（琥珀）、右鍵點擊格（紫），證明偵測到哪一格 -->
      <rect
        v-if="clicked"
        :x="clicked[1] * cellSize"
        :y="clicked[0] * cellSize"
        :width="cellSize"
        :height="cellSize"
        fill="rgb(251 191 36 / 0.45)"
      />
      <rect
        v-if="rightClicked"
        :x="rightClicked[1] * cellSize"
        :y="rightClicked[0] * cellSize"
        :width="cellSize"
        :height="cellSize"
        fill="rgb(168 85 247 / 0.45)"
      />

      <!-- 圖層 2：牆壁 -->
      <path class="layer-walls" :d="wallsD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

      <!-- 圖層 2.5：裝飾（隨機黃圓） -->
      <g class="layer-decorations">
        <circle
          v-for="([r, c], i) in decorations"
          :key="i"
          :cx="c * cellSize + cellSize / 2"
          :cy="r * cellSize + cellSize / 2"
          :r="cellSize * 0.28"
          fill="rgb(250 204 21)"
        />
      </g>

      <!-- 圖層 3：解答（彩虹最短路，逐段畫出）。key=drawKey → 重算時重掛重播動畫 -->
      <g v-if="showSolution" :key="drawKey" class="layer-solution">
        <line
          v-for="(s, i) in solutionSegments"
          :key="i"
          class="sol-seg"
          :x1="s.x1"
          :y1="s.y1"
          :x2="s.x2"
          :y2="s.y2"
          :stroke="s.color"
          :stroke-width="solStroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          :style="{
            strokeDasharray: cellSize,
            strokeDashoffset: cellSize,
            animationDelay: `${s.delay}s`,
          }"
        />
      </g>
    </svg>
  </UContextMenu>
</template>

<style scoped>
  /* 逐段畫出：每段從「完全縮排」補到 0，露出整條線；delay 由 inline style 決定先後 */
  .sol-seg {
    animation: sol-draw 0.14s linear forwards;
  }

  @keyframes sol-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sol-seg {
      animation: none;
      stroke-dashoffset: 0 !important;
    }
  }
</style>

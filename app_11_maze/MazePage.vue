<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useMaze, DIFFICULTIES } from './useMaze'

  const { rows, cols, difficulty, setDifficulty, grid, reroll, showSolution, solutionPath, toggleSolution, MIN, MAX } = useMaze()

  // 每格小正方形邊長 (px)，使用者可調。只影響繪製、不影響迷宮生成
  const cellSize = ref(24)
  const CELL_MIN = 8
  const CELL_MAX = 48

  const STROKE = 2 // 牆線寬

  // SVG 尺寸；外圈牆的 stroke 有一半會超出邊界，故 viewBox 往外留半個 stroke
  const dims = computed(() => ({ w: cols.value * cellSize.value, h: rows.value * cellSize.value }))
  const viewBox = computed(() => `${-STROKE / 2} ${-STROKE / 2} ${dims.value.w + STROKE} ${dims.value.h + STROKE}`)

  // 【圖層：牆壁】把每道牆湊成一條 path。每道牆只由一格畫（top/left；最右欄補 right、最底列補 bottom），
  // SVG 的線畫在格線正中心、同座標重疊也不變粗，故無 border 的缺角/雙倍粗問題。
  const wallsD = computed(() => {
    const cell = cellSize.value
    const R = rows.value
    const C = cols.value
    let d = ''
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const x = c * cell
        const y = r * cell
        const w = grid.value[r]![c]!
        if (w.top) d += `M${x} ${y}L${x + cell} ${y}`
        if (w.left) d += `M${x} ${y}L${x} ${y + cell}`
        if (c === C - 1 && w.right) d += `M${x + cell} ${y}L${x + cell} ${y + cell}`
        if (r === R - 1 && w.bottom) d += `M${x} ${y + cell}L${x + cell} ${y + cell}`
      }
    }
    return d
  })

  // 【圖層：解答】把最短路拆成一段段連線，每段依步序上彩虹 hue（沿走向由藍漸變到桃紅），
  // 並帶一個 delay（正規化到 drawTotal 秒）做「逐段畫出」動畫
  const drawTotal = ref(1.6) // 整條路畫完的總秒數，使用者可調
  const DRAW_MIN = 0.2
  const DRAW_MAX = 5
  const solStroke = computed(() => Math.max(2, cellSize.value * 0.28))
  const solutionSegments = computed(() => {
    const cell = cellSize.value
    const p = solutionPath.value
    const center = ([r, c]: [number, number]): [number, number] => [c * cell + cell / 2, r * cell + cell / 2]
    const segs: { x1: number; y1: number; x2: number; y2: number; color: string; delay: number }[] = []
    for (let i = 0; i < p.length - 1; i++) {
      const [x1, y1] = center(p[i]!)
      const [x2, y2] = center(p[i + 1]!)
      const t = p.length <= 1 ? 0 : i / (p.length - 1)
      segs.push({ x1, y1, x2, y2, color: `hsl(${200 + t * 140} 85% 55% / 0.75)`, delay: t * drawTotal.value })
    }
    return segs
  })

  // 解答重算（換迷宮/切難度/重開）或調動畫時長時遞增，用作 <g> 的 key → 重掛整層 → 動畫重播
  const drawKey = ref(0)
  watch([solutionPath, drawTotal], () => {
    drawKey.value++
  })
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8">
    <!-- 控制面板 -->
    <div class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
      <div>
        <span class="text-sm font-medium">難度：</span>
        <UFieldGroup orientation="horizontal" class="mt-3">
          <UButton
            v-for="d in DIFFICULTIES"
            :key="d.value"
            :color="difficulty === d.value ? 'primary' : 'neutral'"
            :variant="difficulty === d.value ? 'solid' : 'outline'"
            @click="setDifficulty(d.value)"
          >
            {{ d.label }}
          </UButton>
        </UFieldGroup>
      </div>
      <div>
        <span class="text-sm font-medium">列數 (rows)：{{ rows }}</span>
        <USlider v-model="rows" :min="MIN" :max="MAX" :step="1" class="mt-3" />
      </div>
      <div>
        <span class="text-sm font-medium">行數 (cols)：{{ cols }}</span>
        <USlider v-model="cols" :min="MIN" :max="MAX" :step="1" class="mt-3" />
      </div>
      <div>
        <span class="text-sm font-medium">格子寬 (px)：{{ cellSize }}</span>
        <USlider v-model="cellSize" :min="CELL_MIN" :max="CELL_MAX" :step="1" class="mt-3" />
      </div>
      <div>
        <span class="text-sm font-medium">解答動畫時長 (秒)：{{ drawTotal.toFixed(1) }}</span>
        <USlider v-model="drawTotal" :min="DRAW_MIN" :max="DRAW_MAX" :step="0.1" class="mt-3" />
      </div>
      <UButton icon="i-lucide-dices" color="primary" block @click="reroll">換一張迷宮</UButton>
      <UButton :icon="showSolution ? 'i-lucide-eye-off' : 'i-lucide-route'" color="neutral" variant="outline" block @click="toggleSolution">
        {{ showSolution ? '隱藏解答' : '顯示解答' }}
      </UButton>
    </div>

    <!-- 迷宮：SVG 分三個圖層（由下到上：起終點標記 → 牆壁 → 解答），疊序 = 文件順序 -->
    <svg :width="dims.w + STROKE" :height="dims.h + STROKE" :viewBox="viewBox" class="text-gray-800 dark:text-gray-200">
      <!-- 圖層 1：起終點標記 -->
      <g class="layer-markers">
        <rect :x="0" :y="0" :width="cellSize" :height="cellSize" fill="rgb(74 222 128 / 0.4)" />
        <rect :x="(cols - 1) * cellSize" :y="(rows - 1) * cellSize" :width="cellSize" :height="cellSize" fill="rgb(248 113 113 / 0.4)" />
      </g>

      <!-- 圖層 2：牆壁 -->
      <path class="layer-walls" :d="wallsD" fill="none" stroke="currentColor" :stroke-width="STROKE" stroke-linecap="square" />

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
  </div>
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

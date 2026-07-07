<script setup lang="ts">
  import { computed } from 'vue'

  // 純顯示元件：由外面餵 grid（N×N，0 代表留空）與 base（宮邊長，side = base²）
  const props = defineProps<{
    grid: number[][]
    base: number
    // 選填：數字顏色（例如解答用藍色）
    color?: string
  }>()

  const side = computed(() => props.grid.length) // 盤面邊長 N

  // 格子尺寸/字級暫時固定（之後再開放使用者調整）
  const CELL_SIZE = '4rem'
  const FONT_SIZE = '2rem'

  // 外框粗線由 container 的上/左邊界畫；每格只畫右/下邊界，避免雙線重疊
  const boardStyle = computed(() => ({
    gridTemplateColumns: `repeat(${side.value}, ${CELL_SIZE})`,
    gridTemplateRows: `repeat(${side.value}, ${CELL_SIZE})`,
    borderTop: '3px solid #333',
    borderLeft: '3px solid #333',
    fontSize: FONT_SIZE,
  }))

  const THICK = '3px solid #333'
  const THIN = '1px solid #bbb'

  // 每格：宮分界（含最外緣）用粗線，其餘細線
  function cellStyle(r: number, c: number) {
    return {
      borderRight: (c + 1) % props.base === 0 ? THICK : THIN,
      borderBottom: (r + 1) % props.base === 0 ? THICK : THIN,
      color: props.color,
    }
  }
</script>

<template>
  <div class="grid" :style="boardStyle">
    <template v-for="(row, r) in grid" :key="r">
      <div v-for="(value, c) in row" :key="c" class="flex items-center justify-center font-bold" :style="cellStyle(r, c)">
        {{ value === 0 ? '' : value }}
      </div>
    </template>
  </div>
</template>

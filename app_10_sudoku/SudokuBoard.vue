<script setup lang="ts">
  // 純顯示元件：由外面餵 grid（4x4，0 代表留空）
  defineProps<{
    grid: number[][]
    // 選填：數字顏色（例如解答用藍色）
    color?: string
  }>()
</script>

<template>
  <div class="grid grid-cols-[repeat(4,4rem)] grid-rows-[repeat(4,4rem)] border-[3px] border-gray-800">
    <!-- 2x2 宮格粗邊界：col2(第4n+2格) 右邊、row2(第5~8格) 下邊 -->
    <div
      v-for="(cell, i) in grid.flat()"
      :key="i"
      class="flex items-center justify-center border border-gray-300 text-[2rem] font-bold nth-[4n+2]:border-r-[3px] nth-[4n+2]:border-r-gray-800 nth-[n+5]:nth-[-n+8]:border-b-[3px] nth-[n+5]:nth-[-n+8]:border-b-gray-800"
      :style="{ color }"
    >
      {{ cell === 0 ? '' : cell }}
    </div>
  </div>
</template>

<script setup lang="ts">
  // 控制面板：items（清單，列數 M 由清單長度決定）、左右點點之間的距離、上下點點之間的距離。全部用 v-model 雙向綁定。
  import { exampleData, type ExampleData } from './example-data'

  defineProps<{
    min: number // items 筆數下限
    max: number // items 筆數上限
  }>()

  const items = defineModel<ExampleData[]>('items', { required: true })
  const colGap = defineModel<number>('colGap', { required: true })
  const rowGap = defineModel<number>('rowGap', { required: true })
  const dotRadius = defineModel<number>('dotRadius', { required: true })

  // 純 UI 範圍常數
  const COL_GAP_MIN = 12
  const COL_GAP_MAX = 640
  const ROW_GAP_MIN = 12
  const ROW_GAP_MAX = 128
  const DOT_RADIUS_MIN = 4
  const DOT_RADIUS_MAX = 48

  // 從 exampleData 中尚未加入 items 的項目（以 eName 判斷是否重複）隨機選一筆
  function addItem() {
    const candidates = exampleData.filter((data) => !items.value.some((item) => item.eName === data.eName))
    if (candidates.length === 0) {
      alert('已無可新增的項目')
      return
    }
    const next = candidates[Math.floor(Math.random() * candidates.length)]
    if (!next) return
    items.value.push({ ...next })
  }

  function removeItem(index: number) {
    items.value.splice(index, 1)
  }
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
    <div>
      <span class="text-sm font-medium">左右點點之間的距離 (px)：{{ colGap }}</span>
      <USlider v-model="colGap" :min="COL_GAP_MIN" :max="COL_GAP_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">上下點點之間的距離 (px)：{{ rowGap }}</span>
      <USlider v-model="rowGap" :min="ROW_GAP_MIN" :max="ROW_GAP_MAX" :step="1" class="mt-3" />
    </div>
    <div>
      <span class="text-sm font-medium">點點半徑 (px)：{{ dotRadius }}</span>
      <USlider v-model="dotRadius" :min="DOT_RADIUS_MIN" :max="DOT_RADIUS_MAX" :step="1" class="mt-3" />
    </div>
    <div class="border-muted my-2 h-0.5 w-full border-t"></div>
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">項目清單 items：{{ items.length }}</span>
        <UButton icon="i-lucide-plus" label="新增" color="neutral" variant="soft" :disabled="items.length >= max" @click="addItem" />
      </div>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="flex items-center gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700"
        >
          <img v-if="item.img" :src="item.img" class="size-6 shrink-0 rounded object-cover" />
          <span class="flex-1 truncate text-sm">{{ item.cName || '（未命名）' }} / {{ item.eName || '(untitled)' }}</span>
          <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" square />
          <UButton icon="i-lucide-trash" color="error" variant="ghost" square :disabled="items.length <= min" @click="removeItem(index)" />
        </li>
      </ul>
    </div>
  </div>
</template>

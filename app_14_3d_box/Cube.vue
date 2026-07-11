<script setup lang="ts">
  // 單一正方體，用 TresJS 宣告式元件寫成，之後可在畫面上放多個（每個給不同 position 即可）。
  withDefaults(
    defineProps<{
      position?: [number, number, number]
      size?: number
      colors?: string[] // 依 BoxGeometry 面順序：+X, -X, +Y, -Y, +Z, -Z（右左上下前後）
    }>(),
    {
      position: () => [0, 0, 0],
      size: 2,
      colors: () => ['#facc15', '#f87171', '#4ade80', '#60a5fa', '#c084fc', '#fb923c'],
    },
  )

  defineEmits<{ click: [] }>()
</script>

<template>
  <TresMesh
    :position-x="position[0]"
    :position-y="position[1]"
    :position-z="position[2]"
    cast-shadow
    receive-shadow
    @click="$emit('click')"
  >
    <TresBoxGeometry :args="[size, size, size]" />
    <TresMeshStandardMaterial
      v-for="(color, i) in colors"
      :key="i"
      :attach="`material-${i}`"
      :color="color"
      :roughness="0.5"
      :metalness="0.08"
    />
    <Edges color="#111827" />
  </TresMesh>
</template>

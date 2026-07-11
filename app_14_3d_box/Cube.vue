<script setup lang="ts">
  // 單一正方體，用 TresJS 宣告式元件寫成，之後可在畫面上放多個（每個給不同 position 即可）。
  // colors 是「油漆在實體方塊上」的固定色，不會因為方向而換色；要換哪面朝上請用 rotation 轉動整個方塊，
  // 對面的顏色會自動跟著轉過去（例如黃在上時，紅一定在下，因為兩者是 BoxGeometry 的 +X/-X 對面）。
  withDefaults(
    defineProps<{
      position?: [number, number, number]
      rotation?: [number, number, number]
      size?: number
      colors?: string[] // 依 BoxGeometry 面順序：+X, -X, +Y, -Y, +Z, -Z。對面固定：(+X,-X)/(+Y,-Y)/(+Z,-Z)
    }>(),
    {
      position: () => [0, 0, 0],
      rotation: () => [0, 0, 0],
      size: 2,
      // 上綠(+Y)／下藍(-Y)；側面環繞順序 紅(-X) → 紫(+Z) → 黃(+X) → 橘(-Z)
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
    :rotation-x="rotation[0]"
    :rotation-y="rotation[1]"
    :rotation-z="rotation[2]"
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

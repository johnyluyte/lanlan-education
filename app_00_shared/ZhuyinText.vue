<script setup lang="ts">
  import { computed } from 'vue'
  import { toZhuyinSegments } from '#alias-shared/zhuyin'

  const props = defineProps<{
    text: string
  }>()

  const segments = computed(() => toZhuyinSegments(props.text))
</script>

<template>
  <span>
    <template v-for="(segment, index) in segments" :key="index">
      <ruby v-if="segment.zhuyin">
        {{ segment.char }}
        <rt>{{ segment.zhuyin }}</rt>
      </ruby>
      <template v-else>{{ segment.char }}</template>
    </template>
  </span>
</template>

<style scoped>
  ruby {
    ruby-position: over;
  }

  rt {
    font-size: 0.5em;
    user-select: none;
  }
</style>

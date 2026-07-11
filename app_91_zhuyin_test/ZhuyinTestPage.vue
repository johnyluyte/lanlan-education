<script setup lang="ts">
  import { ref } from 'vue'
  import ZhuyinText from '#alias-zhuyin-test/zhuyin/ZhuyinText.vue'
  import ZhuyinSettings from '#alias-zhuyin-test/zhuyin/ZhuyinSettings.vue'

  const inputText = ref('')
  const gapLeft = ref(2)
  const gapRight = ref(0)
  const toneGap = ref(4)
</script>

<template>
  <div class="flex h-full w-full justify-center bg-gray-200 p-8">
    <div class="w-240 space-y-6 bg-white p-6 shadow">
      <ZhuyinSettings v-model:gap-left="gapLeft" v-model:gap-right="gapRight" v-model:tone-gap="toneGap" :min="0" :max="20" />
      <UTextarea v-model="inputText" placeholder="輸入文字，下方會即時套用注音" :rows="4" class="w-full" />
      <div class="text-2xl"><ZhuyinText :text="inputText" :gap-left="gapLeft" :gap-right="gapRight" :tone-gap="toneGap" /></div>
      <div class="text-2xl">
        <ZhuyinText text="能不能在中文旁邊加上注音" :gap-left="gapLeft" :gap-right="gapRight" :tone-gap="toneGap" />
      </div>
      <div class="text-2xl">
        <ZhuyinText text="小蘭說每題之間可以加上粗線，因為特生眼睛不好" :gap-left="gapLeft" :gap-right="gapRight" :tone-gap="toneGap" />
      </div>
    </div>
  </div>
</template>

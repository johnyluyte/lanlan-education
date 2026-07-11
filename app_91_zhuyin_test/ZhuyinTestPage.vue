<script setup lang="ts">
  import { ref } from 'vue'
  import ZhuyinText from '#alias-zhuyin-test/zhuyin/ZhuyinText.vue'
  import ZhuyinSettings from '#alias-zhuyin-test/zhuyin/ZhuyinSettings.vue'

  const inputText = ref('')
  const gapLeft = ref(2)
  const gapRight = ref(6)
  const toneGap = ref(6)
  const fontSize = ref(0.4)
  const lineHeight = ref(8)
</script>

<template>
  <div class="flex h-full w-full justify-center bg-gray-200">
    <div class="border-muted border-r bg-white">
      <ZhuyinSettings
        v-model:gap-left="gapLeft"
        v-model:gap-right="gapRight"
        v-model:tone-gap="toneGap"
        v-model:font-size="fontSize"
        v-model:line-height="lineHeight"
        :min="0"
        :max="20"
      />
    </div>

    <div class="flex-1 space-y-6 bg-white p-6 shadow">
      <UTextarea v-model="inputText" placeholder="輸入文字，下方會即時套用注音" :rows="4" class="w-full" />
      <div class="text-2xl">
        <ZhuyinText
          :text="inputText"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
        />
      </div>
      <div class="text-2xl">
        <ZhuyinText
          text="能不能在中文旁邊加上注音"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
        />
      </div>
      <div class="text-2xl">
        <ZhuyinText
          text="小蘭說每題之間可以加上粗線，因為特生眼睛不好"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
        />
      </div>
    </div>
  </div>
</template>

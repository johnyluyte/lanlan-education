<script setup lang="ts">
  import { ref } from 'vue'
  import ZhuyinText from '#alias-zhuyin-test/zhuyin/ZhuyinText.vue'
  import ZhuyinSettings from '#alias-zhuyin-test/zhuyin/ZhuyinSettings.vue'

  const inputText = ref('')
  const gapLeft = ref(2)
  const gapRight = ref(8)
  const toneGap = ref(5)
  const fontSize = ref(0.33)
  const lineHeight = ref(8)
  const charFontSize = ref(24)
  const symbolScaleY = ref(1)

  const bo = [
    '八',
    '拔',
    '把',
    '爸',
    '。',
    '播',
    '伯',
    '跛',
    '擘',
    '。',
    '掰',
    '白',
    '擺',
    '拜',
    '。',
    '杯',
    '北',
    '貝',
    '背',
    '。',
    '包',
    '薄',
    '飽',
    '抱',
    '。',
    '班',
    '板',
    '辦',
    '。',
    '奔',
    '本',
    '笨',
    '。',
    '幫',
    '綁',
    '棒',
    '。',
    '崩',
    '甭',
    '繃',
    '蹦',
    '。',
    '逼',
    '鼻',
    '比',
    '必',
    '。',
    '鱉',
    '別',
    '癟',
    '彆',
    '。',
    '標',
    '	',
    '	',
    '。',
    '邊',
    '	',
    '扁',
    '變',
    '。',
    '賓',
    '稟',
    '鬢',
    '。',
    '冰',
    '	',
    '丙',
    '並',
    '。',
    '餔',
    '不',
  ]
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
        v-model:char-font-size="charFontSize"
        v-model:symbol-scale-y="symbolScaleY"
        :min="0"
        :max="20"
      />
    </div>

    <div class="flex-1 space-y-6 bg-white p-6 shadow">
      <UTextarea v-model="inputText" placeholder="輸入文字，下方會即時套用注音" :rows="4" class="w-full" />
      <div>
        <ZhuyinText
          :text="inputText"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
          :char-font-size="charFontSize"
          :symbol-scale-y="symbolScaleY"
        />
      </div>

      <div class="border-muted h-2 w-full border-t"></div>

      <div>
        <ZhuyinText
          :text="bo.join('')"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
          :char-font-size="charFontSize"
          :symbol-scale-y="symbolScaleY"
        />
      </div>
      <div>
        <ZhuyinText
          text="青蛙"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
          :char-font-size="charFontSize"
          :symbol-scale-y="symbolScaleY"
        />
      </div>
      <div>
        <ZhuyinText
          text="能不能在中文旁邊加上注音"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
          :char-font-size="charFontSize"
          :symbol-scale-y="symbolScaleY"
        />
      </div>
      <div>
        <ZhuyinText
          text="小蘭說每題之間可以加上粗線，因為特生眼睛不好"
          :gap-left="gapLeft"
          :gap-right="gapRight"
          :tone-gap="toneGap"
          :font-size="fontSize"
          :line-height="lineHeight"
          :char-font-size="charFontSize"
          :symbol-scale-y="symbolScaleY"
        />
      </div>
    </div>
  </div>
</template>

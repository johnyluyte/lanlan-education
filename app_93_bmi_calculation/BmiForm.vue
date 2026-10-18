<script setup lang="ts">
  import type { Gender } from './bmi'

  // 表單欄位以 defineModel 雙向綁定（參考 app_91 ZhuyinSettings 慣例）
  const mode = defineModel<'adult' | 'child'>('mode', { required: true })
  const height = defineModel<number | null>('height', { required: true })
  const weight = defineModel<number | null>('weight', { required: true })
  const ageYears = defineModel<number>('ageYears', { required: true })
  const ageMonths = defineModel<number>('ageMonths', { required: true })
  const gender = defineModel<Gender>('gender', { required: true })

  const modeItems = [
    { label: '成人', value: 'adult' },
    { label: '兒童', value: 'child' },
  ]

  const genderItems = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ]
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-5">
    <!-- 模式切換：成人 / 兒童 -->
    <UTabs v-model="mode" :items="modeItems" :content="false" color="primary" class="w-full" />

    <UFormField label="身高（公分）">
      <UInputNumber v-model="height" :min="0" :step="0.1" placeholder="例如 170" class="w-full" />
    </UFormField>

    <UFormField label="體重（公斤）">
      <UInputNumber v-model="weight" :min="0" :step="0.1" placeholder="例如 65" class="w-full" />
    </UFormField>

    <!-- 兒童模式才需要年齡與性別（決定分級門檻） -->
    <template v-if="mode === 'child'">
      <div class="flex gap-3">
        <UFormField label="年齡（歲）" class="flex-1">
          <UInputNumber v-model="ageYears" :min="0" :max="17" :step="1" class="w-full" />
        </UFormField>
        <UFormField label="月" class="flex-1">
          <UInputNumber v-model="ageMonths" :min="0" :max="11" :step="1" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="性別">
        <URadioGroup v-model="gender" :items="genderItems" orientation="horizontal" />
      </UFormField>
    </template>
  </div>
</template>

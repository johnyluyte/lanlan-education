<script setup lang="ts">
  import BmiForm from './BmiForm.vue'
  import BmiResultCard from './BmiResultCard.vue'
  import { calcBmi, classifyAdult, classifyChild, type BmiCategory, type Gender } from './bmi'

  const mode = ref<'adult' | 'child'>('adult')
  const height = ref<number | null>(null)
  const weight = ref<number | null>(null)
  const ageYears = ref<number>(6)
  const ageMonths = ref<number>(0)
  const gender = ref<Gender>('male')

  // 即時計算：輸入變動就重算
  const bmi = computed(() => (height.value != null && weight.value != null ? calcBmi(weight.value, height.value) : null))

  const category = computed<BmiCategory | null>(() => {
    if (bmi.value == null) return null
    return mode.value === 'child' ? classifyChild(bmi.value, ageYears.value, ageMonths.value, gender.value) : classifyAdult(bmi.value)
  })
</script>

<template>
  <div class="flex flex-col items-center gap-8 p-8">
    <h1 class="text-2xl font-bold">BMI 計算</h1>
    <div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
      <BmiForm
        v-model:mode="mode"
        v-model:height="height"
        v-model:weight="weight"
        v-model:age-years="ageYears"
        v-model:age-months="ageMonths"
        v-model:gender="gender"
      />
      <BmiResultCard :bmi="bmi" :category="category" />
    </div>
    <p v-if="mode === 'child'" class="max-w-md text-center text-xs text-gray-400">
      兒童分級依衛生福利部國民健康署「兒童及青少年生長 BMI 建議值」（男女、半歲級距）判定；18 歲以上請改用成人模式。
    </p>
  </div>
</template>

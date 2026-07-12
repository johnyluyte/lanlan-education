import { describe, it, expect } from 'vitest'
import { calcBmi, classifyAdult, classifyChild } from '#alias-bmi-calculation/bmi'
import { resolveChildAgeBucket } from '#alias-bmi-calculation/childBmiTable'

describe('calcBmi', () => {
  it('計算 BMI = kg / m²', () => {
    // 70kg / 1.75m² = 22.857...
    expect(calcBmi(70, 175)).toBeCloseTo(22.857, 3)
  })

  it('身高體重非正值回傳 null', () => {
    expect(calcBmi(0, 175)).toBeNull()
    expect(calcBmi(70, 0)).toBeNull()
    expect(calcBmi(-5, 175)).toBeNull()
    expect(calcBmi(70, -175)).toBeNull()
  })

  it('非有限數回傳 null', () => {
    expect(calcBmi(Number.NaN, 175)).toBeNull()
    expect(calcBmi(70, Number.POSITIVE_INFINITY)).toBeNull()
  })
})

describe('classifyAdult（台灣四級）', () => {
  it('過輕 BMI < 18.5', () => {
    expect(classifyAdult(18.4)).toBe('underweight')
  })
  it('正常 18.5 ≤ BMI < 24', () => {
    expect(classifyAdult(18.5)).toBe('normal')
    expect(classifyAdult(23.9)).toBe('normal')
  })
  it('過重 24 ≤ BMI < 27', () => {
    expect(classifyAdult(24)).toBe('overweight')
    expect(classifyAdult(26.9)).toBe('overweight')
  })
  it('肥胖 BMI ≥ 27', () => {
    expect(classifyAdult(27)).toBe('obese')
    expect(classifyAdult(35)).toBe('obese')
  })
})

describe('resolveChildAgeBucket（半歲級距對應）', () => {
  it('7 歲涵蓋 6 歲 10 個月至 7 歲 3 個月', () => {
    expect(resolveChildAgeBucket(6, 10)).toBe(7.0)
    expect(resolveChildAgeBucket(7, 0)).toBe(7.0)
    expect(resolveChildAgeBucket(7, 3)).toBe(7.0)
  })
  it('7 歲 4 個月落到 7.5 歲級距', () => {
    expect(resolveChildAgeBucket(7, 4)).toBe(7.5)
  })
  it('0 歲整落到 0.0 級距', () => {
    expect(resolveChildAgeBucket(0, 0)).toBe(0.0)
  })
  it('超過上限夾到 17.5', () => {
    expect(resolveChildAgeBucket(20, 0)).toBe(17.5)
  })
})

describe('classifyChild（衛福部建議值表）', () => {
  // 7 歲男性門檻：under 13.8 / over 17.9 / obese 20.3
  it('7 歲男性各級判定正確', () => {
    expect(classifyChild(13.7, 7, 0, 'male')).toBe('underweight')
    expect(classifyChild(13.8, 7, 0, 'male')).toBe('normal')
    expect(classifyChild(17.8, 7, 0, 'male')).toBe('normal')
    expect(classifyChild(17.9, 7, 0, 'male')).toBe('overweight')
    expect(classifyChild(20.2, 7, 0, 'male')).toBe('overweight')
    expect(classifyChild(20.3, 7, 0, 'male')).toBe('obese')
  })

  // 7 歲女性門檻：under 13.4 / over 17.7 / obese 19.6
  it('7 歲女性各級判定正確', () => {
    expect(classifyChild(13.3, 7, 0, 'female')).toBe('underweight')
    expect(classifyChild(15.0, 7, 0, 'female')).toBe('normal')
    expect(classifyChild(17.7, 7, 0, 'female')).toBe('overweight')
    expect(classifyChild(19.6, 7, 0, 'female')).toBe('obese')
  })

  it('年齡月份會換算級距（7 歲 3 月仍用 7.0 級距門檻）', () => {
    // 7.0 male over=17.9；7.5 male over=18.6。BMI 18.0 在 7.0 級距屬過重，在 7.5 級距屬正常。
    expect(classifyChild(18.0, 7, 3, 'male')).toBe('overweight')
    expect(classifyChild(18.0, 7, 4, 'male')).toBe('normal')
  })
})

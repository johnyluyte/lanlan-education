// BMI 計算與分級純邏輯（無 UI 依賴，供單元測試）。
import { getChildThresholds, resolveChildAgeBucket } from './childBmiTable'

/** 四級體位分類（成人與兒童共用同一組標籤 / 顏色）。 */
export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese'

export type Gender = 'male' | 'female'

/**
 * 計算 BMI = 體重(kg) / 身高(m)²。
 * 身高以公分傳入。輸入非正值時回傳 null（無法計算）。
 */
export function calcBmi(weightKg: number, heightCm: number): number | null {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return null
  if (weightKg <= 0 || heightCm <= 0) return null
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

/**
 * 成人分級（台灣四級，衛福部國健署）：
 *   過輕 BMI < 18.5；正常 18.5 ≤ BMI < 24；過重 24 ≤ BMI < 27；肥胖 BMI ≥ 27。
 */
export function classifyAdult(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 24) return 'normal'
  if (bmi < 27) return 'overweight'
  return 'obese'
}

/**
 * 兒童 / 青少年分級（衛福部建議值表，依年齡半歲級距 + 性別查門檻）。
 * years/months 會換算成半歲級距並夾在表格範圍（0.0 ~ 17.5 歲）。
 */
export function classifyChild(bmi: number, years: number, months: number, gender: Gender): BmiCategory {
  const bucketAge = resolveChildAgeBucket(years, months)
  const thresholds = getChildThresholds(bucketAge, gender)
  // 對照表已涵蓋整個範圍，理論上必有值；防禦性 fallback 給成人標準。
  if (!thresholds) return classifyAdult(bmi)
  if (bmi < thresholds.under) return 'underweight'
  if (bmi < thresholds.over) return 'normal'
  if (bmi < thresholds.obese) return 'overweight'
  return 'obese'
}

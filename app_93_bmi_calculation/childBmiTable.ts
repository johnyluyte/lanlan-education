// 兒童及青少年生長身體質量指數（BMI）建議值
// 資料來源：衛生福利部國民健康署，102 年 6 月 11 日公布
//   （依據陳偉德醫師及張美惠醫師 2010 年發表之研究成果；0-5 歲採 WHO 標準，7-18 歲採台閩地區體適能資料）
// 官方頁面：https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=542&pid=9547
//
// 每列的三個門檻（單位 kg/m²）：
//   under = 過輕上限（BMI < under 為過輕，同時是正常範圍下限）
//   over  = 過重下限（BMI ≥ over 為過重）
//   obese = 肥胖下限（BMI ≥ obese 為肥胖）
// 分級：BMI < under 過輕；under ≤ BMI < over 正常；over ≤ BMI < obese 過重；BMI ≥ obese 肥胖

export interface ChildBmiThresholds {
  under: number
  over: number
  obese: number
}

export interface ChildBmiRow {
  /** 年齡（歲，半歲級距，0.0 ~ 17.5） */
  age: number
  male: ChildBmiThresholds
  female: ChildBmiThresholds
}

export const CHILD_BMI_TABLE: readonly ChildBmiRow[] = [
  { age: 0.0, male: { under: 11.5, over: 14.8, obese: 15.8 }, female: { under: 11.5, over: 14.7, obese: 15.5 } },
  { age: 0.5, male: { under: 15.2, over: 18.9, obese: 19.9 }, female: { under: 14.6, over: 18.6, obese: 19.6 } },
  { age: 1.0, male: { under: 14.8, over: 18.3, obese: 19.2 }, female: { under: 14.2, over: 17.9, obese: 19.0 } },
  { age: 1.5, male: { under: 14.2, over: 17.5, obese: 18.5 }, female: { under: 13.7, over: 17.2, obese: 18.2 } },
  { age: 2.0, male: { under: 14.2, over: 17.4, obese: 18.3 }, female: { under: 13.7, over: 17.2, obese: 18.1 } },
  { age: 2.5, male: { under: 13.9, over: 17.2, obese: 18.0 }, female: { under: 13.6, over: 17.0, obese: 17.9 } },
  { age: 3.0, male: { under: 13.7, over: 17.0, obese: 17.8 }, female: { under: 13.5, over: 16.9, obese: 17.8 } },
  { age: 3.5, male: { under: 13.6, over: 16.8, obese: 17.7 }, female: { under: 13.3, over: 16.8, obese: 17.8 } },
  { age: 4.0, male: { under: 13.4, over: 16.7, obese: 17.6 }, female: { under: 13.2, over: 16.8, obese: 17.9 } },
  { age: 4.5, male: { under: 13.3, over: 16.7, obese: 17.6 }, female: { under: 13.1, over: 16.9, obese: 18.0 } },
  { age: 5.0, male: { under: 13.3, over: 16.7, obese: 17.7 }, female: { under: 13.1, over: 17.0, obese: 18.1 } },
  { age: 5.5, male: { under: 13.4, over: 16.7, obese: 18.0 }, female: { under: 13.1, over: 17.0, obese: 18.3 } },
  { age: 6.0, male: { under: 13.5, over: 16.9, obese: 18.5 }, female: { under: 13.1, over: 17.2, obese: 18.8 } },
  { age: 6.5, male: { under: 13.6, over: 17.3, obese: 19.2 }, female: { under: 13.2, over: 17.5, obese: 19.2 } },
  { age: 7.0, male: { under: 13.8, over: 17.9, obese: 20.3 }, female: { under: 13.4, over: 17.7, obese: 19.6 } },
  { age: 7.5, male: { under: 14.0, over: 18.6, obese: 21.2 }, female: { under: 13.7, over: 18.0, obese: 20.3 } },
  { age: 8.0, male: { under: 14.1, over: 19.0, obese: 21.6 }, female: { under: 13.8, over: 18.4, obese: 20.7 } },
  { age: 8.5, male: { under: 14.2, over: 19.3, obese: 22.0 }, female: { under: 13.9, over: 18.8, obese: 21.0 } },
  { age: 9.0, male: { under: 14.3, over: 19.5, obese: 22.3 }, female: { under: 14.0, over: 19.1, obese: 21.3 } },
  { age: 9.5, male: { under: 14.4, over: 19.7, obese: 22.5 }, female: { under: 14.1, over: 19.3, obese: 21.6 } },
  { age: 10.0, male: { under: 14.5, over: 20.0, obese: 22.7 }, female: { under: 14.3, over: 19.7, obese: 22.0 } },
  { age: 10.5, male: { under: 14.6, over: 20.3, obese: 22.9 }, female: { under: 14.4, over: 20.1, obese: 22.3 } },
  { age: 11.0, male: { under: 14.8, over: 20.7, obese: 23.2 }, female: { under: 14.7, over: 20.5, obese: 22.7 } },
  { age: 11.5, male: { under: 15.0, over: 21.0, obese: 23.5 }, female: { under: 14.9, over: 20.9, obese: 23.1 } },
  { age: 12.0, male: { under: 15.2, over: 21.3, obese: 23.9 }, female: { under: 15.2, over: 21.3, obese: 23.5 } },
  { age: 12.5, male: { under: 15.4, over: 21.5, obese: 24.2 }, female: { under: 15.4, over: 21.6, obese: 23.9 } },
  { age: 13.0, male: { under: 15.7, over: 21.9, obese: 24.5 }, female: { under: 15.7, over: 21.9, obese: 24.3 } },
  { age: 13.5, male: { under: 16.0, over: 22.2, obese: 24.8 }, female: { under: 16.0, over: 22.2, obese: 24.6 } },
  { age: 14.0, male: { under: 16.3, over: 22.5, obese: 25.0 }, female: { under: 16.3, over: 22.5, obese: 24.9 } },
  { age: 14.5, male: { under: 16.6, over: 22.7, obese: 25.2 }, female: { under: 16.5, over: 22.7, obese: 25.1 } },
  { age: 15.0, male: { under: 16.9, over: 22.9, obese: 25.4 }, female: { under: 16.7, over: 22.7, obese: 25.2 } },
  { age: 15.5, male: { under: 17.2, over: 23.1, obese: 25.5 }, female: { under: 16.9, over: 22.7, obese: 25.3 } },
  { age: 16.0, male: { under: 17.4, over: 23.3, obese: 25.6 }, female: { under: 17.1, over: 22.7, obese: 25.3 } },
  { age: 16.5, male: { under: 17.6, over: 23.4, obese: 25.6 }, female: { under: 17.2, over: 22.7, obese: 25.3 } },
  { age: 17.0, male: { under: 17.8, over: 23.5, obese: 25.6 }, female: { under: 17.3, over: 22.7, obese: 25.3 } },
  { age: 17.5, male: { under: 18.0, over: 23.6, obese: 25.6 }, female: { under: 17.3, over: 22.7, obese: 25.3 } },
] as const

/** 對照表涵蓋的年齡下限（歲） */
export const CHILD_BMI_MIN_AGE = 0.0
/** 對照表涵蓋的年齡上限（歲）；超過建議改用成人標準 */
export const CHILD_BMI_MAX_AGE = 17.5

/**
 * 依「年 + 月」對到對照表的半歲級距。
 * 衛福部規定以半歲齡為切點取年齡中位數：例如「7 歲」涵蓋 6 歲 10 個月至 7 歲 3 個月。
 * 換算：bucket = floor((總月數 + 2) / 6)，級距年齡 = bucket / 2，並夾在表格範圍內。
 */
export function resolveChildAgeBucket(years: number, months: number): number {
  const totalMonths = Math.floor(years) * 12 + Math.floor(months)
  const bucket = Math.floor((totalMonths + 2) / 6)
  const bucketAge = bucket / 2
  return Math.min(CHILD_BMI_MAX_AGE, Math.max(CHILD_BMI_MIN_AGE, bucketAge))
}

/** 取得指定年齡級距 + 性別的門檻；找不到時回傳 undefined。 */
export function getChildThresholds(bucketAge: number, gender: 'male' | 'female'): ChildBmiThresholds | undefined {
  const row = CHILD_BMI_TABLE.find((r) => r.age === bucketAge)
  return row?.[gender]
}

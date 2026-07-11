// 正方形的「顏色欄位」：固定 4 格，但顏色可由使用者在 Settings 用 UColorPicker 調整。
export interface SquareKind {
  color: string // hex 色碼（UColorPicker 格式）
  weight: number // 有正方形時，抽到這個顏色的相對權重；不需總和為 1
}

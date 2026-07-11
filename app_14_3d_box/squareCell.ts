// 一個「有出現正方形」的格子：座標 + 色碼 + 隨機數字。由 ThreeDBox2DSettings 隨機產生，
// ThreeDBoxCellGrid 純粹依此渲染 2D 預覽，ThreeDBoxScene 依此在「動態場景」生成對應的 3D cube。
export interface SquareCell {
  row: number
  col: number
  color: string
  value: number // 1-3，目前只用於 2D 顯示，3D 動態場景先不處理
}

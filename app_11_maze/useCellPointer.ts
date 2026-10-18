import { ref, type Ref } from 'vue'

// SVG 迷宮的滑鼠命中測試：把螢幕座標換算回格 (row, col)，處理左鍵/右鍵。
// 用 getScreenCTM().inverse() 做換算，即使 SVG 被 CSS 縮放/位移也準。
// clicked / rightClicked 供繪製層高亮；命中時呼叫傳入的 callback（通常是 emit）。
export function useCellPointer(opts: {
  cellSize: Ref<number>
  rows: Ref<number>
  cols: Ref<number>
  onClick?: (row: number, col: number) => void
  onRightClick?: (row: number, col: number) => void
}) {
  const clicked = ref<[number, number] | null>(null) // 左鍵最後點擊格
  const rightClicked = ref<[number, number] | null>(null) // 右鍵最後點擊格

  // 回傳 null = 點到外框留白 → 忽略
  function cellFromEvent(e: MouseEvent): [number, number] | null {
    const svg = e.currentTarget as SVGSVGElement
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    const col = Math.floor(pt.x / opts.cellSize.value)
    const row = Math.floor(pt.y / opts.cellSize.value)
    if (row < 0 || row >= opts.rows.value || col < 0 || col >= opts.cols.value) return null
    return [row, col]
  }

  function onClick(e: MouseEvent) {
    const cell = cellFromEvent(e)
    if (!cell) return
    clicked.value = cell
    opts.onClick?.(cell[0], cell[1])
  }

  function onContextMenu(e: MouseEvent) {
    const cell = cellFromEvent(e)
    if (!cell) return
    rightClicked.value = cell
    opts.onRightClick?.(cell[0], cell[1])
  }

  return { clicked, rightClicked, onClick, onContextMenu }
}

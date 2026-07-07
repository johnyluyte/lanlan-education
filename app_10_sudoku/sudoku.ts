// 產生一個隨機的 N×N 數獨完整解（演算法 A：種子樣式 + 洗牌，詳見 sudoku.md）
// base = 宮邊長，N = base²。base=2 → 4×4；base=3 → 9×9
export function generateSolution(base = 3): number[][] {
  const side = base * base

  // 基底解公式（保證滿足列/行/宮限制）
  const pattern = (r: number, c: number) => (base * (r % base) + Math.floor(r / base) + c) % side

  // Fisher-Yates 洗牌
  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = a[i]!
      a[i] = a[j]!
      a[j] = tmp
    }
    return a
  }

  const baseRange = [...Array(base).keys()] // 0..base-1

  // 列順序：先洗橫帶，帶內再洗列；行順序同理
  const rows = shuffle(baseRange).flatMap((band) => shuffle(baseRange).map((r) => band * base + r))
  const cols = shuffle(baseRange).flatMap((stack) => shuffle(baseRange).map((c) => stack * base + c))
  // 數字對應：1..N 打亂
  const nums = shuffle([...Array(side).keys()].map((n) => n + 1))

  // 依打亂後的列/行順序套用公式並 relabel
  return rows.map((r) => cols.map((c) => nums[pattern(r, c)]!))
}

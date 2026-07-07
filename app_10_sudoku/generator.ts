// 產生一個隨機的 N×N 數獨完整解（演算法 A：種子樣式 + 洗牌，詳見 algorithm.md）
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

// 計算某題目（grid，0 = 空格）的解答數量，最多算到 limit 就提早停止。
// 回傳 1 代表唯一解；>= 2 代表有多個解（老師難以批改）。
// maxSteps：回溯步數上限保險。大盤（如 9×9）遇到病態遮罩時，回溯可能爆量卡住主執行緒；
// 超過上限就中止，並「保守地」當成多解回傳 —— 寧可誤報多解讓老師警覺，也不要卡死或漏報。
export function countSolutions(grid: number[][], base = 3, limit = 2, maxSteps = 200_000): number {
  const side = base * base
  const board = grid.map((row) => [...row]) // 複製，避免改到原資料
  let count = 0
  let steps = 0 // 已走的回溯節點數
  let aborted = false // 是否因超過 maxSteps 而中止

  // v 放在 (r, c) 是否不違反列/行/宮限制
  const valid = (r: number, c: number, v: number): boolean => {
    for (let i = 0; i < side; i++) {
      if (board[r]![i] === v || board[i]![c] === v) return false
    }
    const r0 = Math.floor(r / base) * base
    const c0 = Math.floor(c / base) * base
    for (let dr = 0; dr < base; dr++) {
      for (let dc = 0; dc < base; dc++) {
        if (board[r0 + dr]![c0 + dc] === v) return false
      }
    }
    return true
  }

  const solve = (): void => {
    if (count >= limit || aborted) return // 已達解答上限或已中止，不必再找
    if (++steps > maxSteps) {
      aborted = true // 超過步數上限 → 中止搜尋
      return
    }
    // 找第一個空格
    for (let r = 0; r < side; r++) {
      for (let c = 0; c < side; c++) {
        if (board[r]![c] === 0) {
          for (let v = 1; v <= side; v++) {
            if (valid(r, c, v)) {
              board[r]![c] = v
              solve()
              board[r]![c] = 0 // 回溯
              if (count >= limit) return
            }
          }
          return // 此空格無合法值 → 死路
        }
      }
    }
    count++ // 沒有空格 → 找到一組完整解
  }

  solve()
  // 中止代表無法在預算內判定 → 保守當成多解（回傳 limit，即 >= 2）
  return aborted ? limit : count
}

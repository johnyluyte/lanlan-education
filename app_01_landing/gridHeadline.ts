// 田字格標題的資料格式：一個字一格，右側注音格放注音符號與聲調。
// 文案用「字(注音)」的寫法，例如 '讓(ㄖㄤˋ)每(ㄇㄟˇ)，'；沒有括號的字元（標點）只佔一格、不帶注音。

export interface GridGlyph {
  // 空字串代表空白格（用來補齊列長）
  char: string
  // 注音符號（不含聲調），例如 ['ㄖ', 'ㄤ']
  symbols: string[]
  // 聲調符號 ˊ ˇ ˋ ˙；一聲為空字串
  tone: string
}

const TONE_MARKS = 'ˊˇˋ˙'
const OPEN_BRACKETS = '(（'
const CLOSE_BRACKETS = ')）'

function parseZhuyin(zhuyin: string): Pick<GridGlyph, 'symbols' | 'tone'> {
  const chars = [...zhuyin]
  return {
    symbols: chars.filter((c) => !TONE_MARKS.includes(c)),
    tone: chars.find((c) => TONE_MARKS.includes(c)) ?? '',
  }
}

export function parseGridLine(line: string): GridGlyph[] {
  const chars = [...line.trim()]
  const glyphs: GridGlyph[] = []

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]!
    if (/\s/.test(char)) continue

    const next = chars[i + 1]
    if (next && OPEN_BRACKETS.includes(next)) {
      const close = chars.findIndex((c, j) => j > i + 1 && CLOSE_BRACKETS.includes(c))
      if (close !== -1) {
        glyphs.push({ char, ...parseZhuyin(chars.slice(i + 2, close).join('')) })
        i = close
        continue
      }
    }

    glyphs.push({ char, symbols: [], tone: '' })
  }

  return glyphs
}

// 每列補到一樣的格數，讓整塊格子是完整的長方形（像作業簿的一整排）
export function padGridRows(rows: GridGlyph[][]): GridGlyph[][] {
  const width = Math.max(0, ...rows.map((row) => row.length))
  return rows.map((row) => [...row, ...Array.from({ length: width - row.length }, () => ({ char: '', symbols: [], tone: '' }))])
}

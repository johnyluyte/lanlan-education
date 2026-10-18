import { describe, it, expect } from 'vitest'
import { parseGridLine, padGridRows } from '#alias-landing/gridHeadline'

describe('parseGridLine', () => {
  it('中文字後面括號內的注音拆成符號與聲調', () => {
    expect(parseGridLine('讓(ㄖㄤˋ)每(ㄇㄟˇ)')).toEqual([
      { char: '讓', symbols: ['ㄖ', 'ㄤ'], tone: 'ˋ' },
      { char: '每', symbols: ['ㄇ', 'ㄟ'], tone: 'ˇ' },
    ])
  })

  it('一聲沒有聲調符號，tone 為空字串', () => {
    expect(parseGridLine('都(ㄉㄡ)')).toEqual([{ char: '都', symbols: ['ㄉ', 'ㄡ'], tone: '' }])
  })

  it('輕聲的 ˙ 寫在前面或後面都能辨識', () => {
    expect(parseGridLine('子(˙ㄗ)的(ㄉㄜ˙)')).toEqual([
      { char: '子', symbols: ['ㄗ'], tone: '˙' },
      { char: '的', symbols: ['ㄉ', 'ㄜ'], tone: '˙' },
    ])
  })

  it('沒有括號的字元（標點、未標注音的字）不帶注音', () => {
    expect(parseGridLine('子(˙ㄗ)，好')).toEqual([
      { char: '子', symbols: ['ㄗ'], tone: '˙' },
      { char: '，', symbols: [], tone: '' },
      { char: '好', symbols: [], tone: '' },
    ])
  })

  it('支援全形括號', () => {
    expect(parseGridLine('時（ㄕˊ）')).toEqual([{ char: '時', symbols: ['ㄕ'], tone: 'ˊ' }])
  })

  it('忽略空白', () => {
    expect(parseGridLine(' 刻(ㄎㄜˋ) ')).toEqual([{ char: '刻', symbols: ['ㄎ', 'ㄜ'], tone: 'ˋ' }])
  })
})

describe('padGridRows', () => {
  it('較短的列補上空白格，讓每列格數一樣', () => {
    const rows = padGridRows([parseGridLine('孩(ㄏㄞˊ)'), parseGridLine('都(ㄉㄡ)有(ㄧㄡˇ)')])
    expect(rows[0]).toHaveLength(2)
    expect(rows[0]![1]).toEqual({ char: '', symbols: [], tone: '' })
    expect(rows[1]).toHaveLength(2)
  })
})

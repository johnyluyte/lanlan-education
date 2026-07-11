import { pinyin } from 'pinyin-pro'
import { p2z } from 'pinyin-to-zhuyin'

export interface ZhuyinSegment {
  char: string
  // 非中文字元（標點、空白、數字等）沒有注音符號
  symbols: string[] | null
  // 聲調符號（ˊˇˋ˙），第一聲沒有符號則為空字串
  tone: string
}

const CJK_CHAR = /[一-鿿]/
const TONE_MARK = /[ˊˇˋ˙]/

// 將文字拆成一個個字元，中文字元附上對應注音符號（拆成「符號」+「聲調」方便分開定位）
export function toZhuyinSegments(text: string): ZhuyinSegment[] {
  const chars = [...text]
  const syllables = pinyin(text, { toneType: 'num', type: 'array' })

  return chars.map((char, index) => {
    if (!CJK_CHAR.test(char)) {
      return { char, symbols: null, tone: '' }
    }

    // pinyin-pro 輕聲用 "0" 結尾，pinyin-to-zhuyin 要 "5" 結尾或不帶數字才認得
    const syllable = (syllables[index] ?? '').replace(/0$/, '5')
    const zhuyin = p2z(syllable)
    const tone = zhuyin.match(TONE_MARK)?.[0] ?? ''
    const symbols = [...zhuyin.replace(TONE_MARK, '')]
    return { char, symbols, tone }
  })
}

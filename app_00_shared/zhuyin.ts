import { pinyin } from 'pinyin-pro'
import { p2z } from 'pinyin-to-zhuyin'

export interface ZhuyinSegment {
  char: string
  // 非中文字元（標點、空白、數字等）沒有注音
  zhuyin: string | null
}

const CJK_CHAR = /[一-鿿]/

// 將文字拆成一個個字元，中文字元附上對應注音符號
export function toZhuyinSegments(text: string): ZhuyinSegment[] {
  const chars = [...text]
  const syllables = pinyin(text, { toneType: 'num', type: 'array' })

  return chars.map((char, index) => {
    if (!CJK_CHAR.test(char)) {
      return { char, zhuyin: null }
    }

    // pinyin-pro 輕聲用 "0" 結尾，pinyin-to-zhuyin 要 "5" 結尾或不帶數字才認得
    const syllable = (syllables[index] ?? '').replace(/0$/, '5')
    return { char, zhuyin: p2z(syllable) }
  })
}

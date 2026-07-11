declare module 'pinyin-to-zhuyin' {
  interface ZhuyinOptions {
    tonemarks?: boolean
    inputHasToneMarks?: boolean
    convertPunctuation?: boolean
  }

  export function p2z(pinyin: string, options?: ZhuyinOptions): string
  export function z2p(zhuyin: string, options?: ZhuyinOptions): string
}

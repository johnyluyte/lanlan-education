import { onUnmounted, ref } from 'vue'

/**
 * SVG 字串轉 Blob URL 給 <img> 用。<img> 情境下瀏覽器不會執行 SVG 內嵌的 script，
 * 比 v-html 直接注入 DOM 安全，也避免觸發 vue/no-v-html。
 */
export function useSvgObjectUrl() {
  const url = ref('')
  let currentUrl = ''

  function setSvgMarkup(svgMarkup: string) {
    if (currentUrl) URL.revokeObjectURL(currentUrl)
    currentUrl = URL.createObjectURL(new Blob([svgMarkup], { type: 'image/svg+xml' }))
    url.value = currentUrl
  }

  onUnmounted(() => {
    if (currentUrl) URL.revokeObjectURL(currentUrl)
  })

  return { url, setSvgMarkup }
}

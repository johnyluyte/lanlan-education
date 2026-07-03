import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

// 全部測試都跑在純 happy-dom 環境：邏輯抽成純函式 / composable 直接測，殼層（plugin/middleware/元件）交給 Playwright E2E。
// 不再需要 nuxt 測試環境（environment: 'nuxt'）——它只在需要真 Nuxt runtime（useFetch、NuxtLink、元件 render 等）時才必要，本專案目前無此需求。
// 若日後要寫元件 / Nuxt-runtime 整合測試，再重新引入 @nuxt/test-utils 的 defineVitestProject 即可。
export default defineConfig({
  // 用 unplugin-auto-import 的 AutoImport 解決「測試環境找不到 Vue/Pinia 等 Nuxt 自動 auto-import 模組」的問題
  plugins: [AutoImport({ imports: ['vue', 'pinia'], dts: false })],
  // 用以下 alias 解決「測試環境無法解析 `~/` 路徑」 的問題
  resolve: {
    alias: [
      { find: /^(~~|@@)\//, replacement: fileURLToPath(new URL('./', import.meta.url)) },
      { find: /^(~|@)\//, replacement: fileURLToPath(new URL('./app/', import.meta.url)) },
      // Domain 別名：需與 nuxt.config.ts 的 alias 保持一致（vitest 不讀 nuxt.config）
      { find: /^#alias-shared\//, replacement: fileURLToPath(new URL('./app_00_shared/', import.meta.url)) },
    ],
  },
  test: {
    include: ['test/**/*.{test,spec}.ts'],
    environment: 'happy-dom',
    // 全域 stub（如 useI18n）：讓有用到 i18n 的 composable 在純 happy-dom 環境可被單元測試。
    setupFiles: ['./test/setup.ts'],
    coverage: {
      enabled: false, // 當設定為 false 後，只有明確指定 vitest --coverage 時才會生成覆蓋率報告。
      provider: 'v8',
      reporter: ['html', 'text-summary'], // 'html' 會生成 coverage 資料夾； 'text-summary' 會在終端機顯示簡要的覆蓋率統計。
    },
  },
})

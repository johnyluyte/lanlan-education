// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  // 若有要讓 layers 實現 nuxt 的 pages, layouts, middleware 等功能的話，才需要 extends
  // extends: ['./app_20_admin'],
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/test-utils', '@pinia/nuxt', '@nuxtjs/i18n', '@tresjs/nuxt'],

  // 禁用 SSR，並啟用 SPA 模式
  ssr: false,

  // 關閉 user codebase 的 components auto-import 功能
  components: { dirs: [] },
  // 關閉 user codebase 的 utils, composables 的 auto-import 功能，但保留 vue, nuxt, pinia 等核心模組的 auto-import 功能
  imports: { scan: false },

  devtools: {
    enabled: false,
  },

  // TODO_5 最後要把這裡的 title 和 description 改成正式的內容，還有 favicon.ico 等等
  app: {
    head: {
      title: '蘭芳 Education',
      // titleTemplate: '%s - pixi-hex ',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: '蘭芳 Education' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Mapped from NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY at runtime
      supabaseUrl: '',
      supabasePublishableKey: '',
      //
      CURRENT_ENV: '',
    },
  },

  // Domain 別名：與實體路徑解耦，日後搬資料夾只需改這裡，不必全 repo 改 import
  // 只要搜尋 "#alias-shared" 找到的就一定是 alias
  alias: {
    '#alias-shared': fileURLToPath(new URL('./app_00_shared', import.meta.url)),
    '#alias-sudoku': fileURLToPath(new URL('./app_10_sudoku', import.meta.url)),
    '#alias-maze': fileURLToPath(new URL('./app_11_maze', import.meta.url)),
    '#alias-matching-game': fileURLToPath(new URL('./app_12_matching_game', import.meta.url)),
    '#alias-connect-the-dots': fileURLToPath(new URL('./app_13_connect_the_dots', import.meta.url)),
    '#alias-3d-box': fileURLToPath(new URL('./app_14_3d_box', import.meta.url)),
    '#alias-cutting-puzzle': fileURLToPath(new URL('./app_15_cutting_puzzle', import.meta.url)),
    '#alias-imitate-dot': fileURLToPath(new URL('./app_20_imitate_dot', import.meta.url)),
    '#alias-imitate-line': fileURLToPath(new URL('./app_21_imitate_line', import.meta.url)),
    '#alias-paper-staging': fileURLToPath(new URL('./app_30_paper_staging', import.meta.url)),
    '#alias-svg-drawing': fileURLToPath(new URL('./app_31_svg_drawing', import.meta.url)),
    '#alias-tile-matching': fileURLToPath(new URL('./app_90_tile_matching', import.meta.url)),
    '#alias-zhuyin-test': fileURLToPath(new URL('./app_91_zhuyin_test', import.meta.url)),
  },

  routeRules: {
    '/login/**': {
      appLayout: 'layout-fullscreen',
    },

    '/print/**': {
      appLayout: 'layout-print',
    },

    // 其他所有頁面
    '/**': {
      appLayout: 'layout-main',
    },
  },

  compatibilityDate: '2025-07-15',

  // Pre-bundle them in your nuxt.config.ts to avoid page reloads:
  // Learn more: https://vite.dev/guide/dep-pre-bundling.html
  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        '@tresjs/cientos',
        '@vueuse/core',
        'esm-potrace-wasm',
        'imagetracerjs', // CJS
        'nanoid',
        'pinyin-pro',
        'pinyin-to-zhuyin',
        'sortablejs',
        'three',
        'three/examples/jsm/controls/OrbitControls.js',
        'valibot',
      ],
    },
  },

  typescript: {
    tsConfig: {
      // 根目錄 .d.ts 之外，額外把 types/ 底下的 ambient 型別宣告也納入編譯範圍
      // 路徑要相對於產生出來的 .nuxt/tsconfig.app.json，所以用 "../"
      include: ['../types/**/*.d.ts'],
      compilerOptions: {
        // "module": "esnext",
        // "moduleResolution": "bundler",
        // "target": "es2024",
        allowJs: true,
        checkJs: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        skipLibCheck: true,
        sourceMap: true,
        strict: true,
        // 以下兩個是新加的，不一定要套用啦
        // https://www.typescriptlang.org/docs/handbook/2/basic-types.html
        noImplicitAny: true,
        strictNullChecks: true,
      },
      vueCompilerOptions: {
        checkUnknownComponents: true,
      },
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  // @nuxt/i18n 模組的配置
  i18n: {
    locales: [
      { code: 'zh-TW', name: '繁體中文 (Trad. Chinese)', file: 'zh-TW.json' },
      { code: 'en-US', name: 'English (English)', file: 'en-US.json' },
    ],
    defaultLocale: 'en-US',
    strategy: 'no_prefix', // 不使用路徑前綴，這樣我們就可以在根路徑下直接訪問不同語言的內容，而不需要在 URL 中添加語言代碼
  },
})

// @ts-check
import oxlint from 'eslint-plugin-oxlint'
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

// JS／TS 與 .vue 的 <script> 交給 oxlint（.oxlintrc.json）；ESLint 只跑 oxlint 做不到的部分：
// .vue 的 template 規則（eslint-plugin-vue）、少數 oxlint 沒實作的 vue script 規則，與 nuxt.config.ts 的 nuxt/* 規則。
// lint script 只把 .vue 與 nuxt.config.ts 交給 ESLint。
export default withNuxt(
  {
    ignores: ['android/**', 'ios/**', 'dist/**', '.nuxt/**', '.output/**', 'node_modules/**', 'coverage/**'],
  },
  {
    rules: {
      // https://eslint.vuejs.org/rules/no-v-html.html
      'vue/no-v-html': [
        'error',
        {
          ignorePattern: '^safeHtml', // 以 safeHtml 開頭的變數名稱將被忽略，允許在 v-html 中使用這些變數。
        },
      ],

      'nuxt/prefer-import-meta': 'off',

      // https://eslint.vuejs.org/rules/multi-word-component-names.html
      'vue/multi-word-component-names': 'off',

      // 過時的 Vue 2 規則，Vue 3 已經不再需要這個規則。
      'vue/no-multiple-template-root': 'off',
    },
  },
  // 排版交給 oxfmt（eslint-config-prettier 關掉格式規則）。
  eslintConfigPrettier,
  // 關掉 ESLint 裡 oxlint 已經在檢查的規則（讀 .oxlintrc.json），必須放在最後。
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  // oxlint 不檢查 <script setup> 裡沒用到的變數（看不到 template 用了哪些），上面那行卻會把它關掉，所以 .vue 留給 ESLint。
  // 選項照 @nuxt/eslint 原本的設定。
  {
    files: ['**/*.vue'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true, vars: 'all', varsIgnorePattern: '^_' },
      ],
    },
  },
)

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

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
  eslintConfigPrettier,
)

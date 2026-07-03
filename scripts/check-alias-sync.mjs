// Domain 別名防呆：確保「三處 domain 清單」永遠一致，避免改目錄名漏改其中一處導致 build/test/CSS 壞掉。
//
// 三處來源（以 nuxt.config.ts 為準）：
//   1. nuxt.config.ts   alias            → dev / build / typecheck 用
//   2. vitest.config.ts resolve.alias    → 測試用（vitest 不讀 nuxt.config）
//   3. app/assets/css/main.css @source   → Tailwind 掃描範圍
//
// 檢查項目：
//   - vitest 的 alias→dir 對應，與 nuxt.config 完全一致（同名、同目錄）
//   - main.css @source 的目錄集合，與 nuxt.config 的 alias 目錄集合完全一致
//   - 每個 alias 指向的實體目錄都存在
//
// 任何不一致即 exit 1 並印出明確差異。掛在 pnpm check 最前面 fail-fast。

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// '#alias-x': fileURLToPath(new URL('./app_xx', import.meta.url))
function parseNuxtAlias() {
  const re = /'(#alias-[a-z0-9-]+)':\s*fileURLToPath\(new URL\('\.\/([^']+?)\/?',\s*import\.meta\.url\)\)/g
  return new Map([...read('nuxt.config.ts').matchAll(re)].map((m) => [m[1], m[2]]))
}

// { find: /^#alias-x\//, replacement: fileURLToPath(new URL('./app_xx/', import.meta.url)) }
function parseVitestAlias() {
  const re = /find:\s*\/\^(#alias-[a-z0-9-]+)\\\/\/,\s*replacement:\s*fileURLToPath\(new URL\('\.\/([^']+?)\/?',\s*import\.meta\.url\)\)/g
  return new Map([...read('vitest.config.ts').matchAll(re)].map((m) => [m[1], m[2]]))
}

// @source '../../../app_xx';
function parseCssSources() {
  const re = /@source\s*'(?:\.\.\/)+([^']+?)\/?'/g
  return new Set([...read('app/assets/css/main.css').matchAll(re)].map((m) => m[1]))
}

const nuxt = parseNuxtAlias()
const vitest = parseVitestAlias()
const css = parseCssSources()
const errors = []

if (nuxt.size === 0) errors.push('nuxt.config.ts 解析不到任何 #alias-* 別名（格式可能變了，請更新此 script 的 regex）。')

// 1. vitest 必須與 nuxt 完全一致
for (const [alias, dir] of nuxt) {
  if (!vitest.has(alias)) errors.push(`vitest.config.ts 缺少別名 ${alias}（nuxt.config 指向 ${dir}）。`)
  else if (vitest.get(alias) !== dir) errors.push(`${alias} 目錄不一致：nuxt.config=${dir}、vitest.config=${vitest.get(alias)}。`)
}
for (const alias of vitest.keys()) {
  if (!nuxt.has(alias)) errors.push(`vitest.config.ts 多出別名 ${alias}（nuxt.config 沒有）。`)
}

// 2. main.css @source 集合 == nuxt alias 目錄集合
const nuxtDirs = new Set(nuxt.values())
for (const dir of nuxtDirs) {
  if (!css.has(dir)) errors.push(`main.css 缺少 @source '../../../${dir}'（有 alias 卻沒納入 Tailwind 掃描 → class 會消失）。`)
}
for (const dir of css) {
  if (!nuxtDirs.has(dir)) errors.push(`main.css 多出 @source '${dir}'（沒有對應 alias，可能是改名遺留）。`)
}

// 3. 實體目錄存在
for (const [alias, dir] of nuxt) {
  if (!existsSync(resolve(root, dir))) errors.push(`${alias} 指向的目錄 ./${dir} 不存在。`)
}

if (errors.length > 0) {
  console.error('✗ Domain 別名不同步：\n' + errors.map((e) => '  - ' + e).join('\n'))
  console.error('\n請同步修正 nuxt.config.ts / vitest.config.ts / app/assets/css/main.css 三處。')
  process.exit(1)
}

console.log(`✓ Domain 別名同步（${nuxt.size} 個別名，三處一致）。`)

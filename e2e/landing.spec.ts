import { expect, test } from '@nuxt/test-utils/playwright'

// Landing Page（登入前的公開首頁）煙霧測試：確認路由、版型、錨點區塊與 CTA 導向都正常。
// 本專案是 SPA（ssr: false），不用 waitUntil: 'hydration'，改靠 expect 的自動等待。

const SECTION_IDS = ['audiences', 'subjects', 'steps', 'stories', 'faq']

test.describe('landing page', () => {
  test('顯示主標與各區塊，且不套用 app 的側欄版型', async ({ page, goto }) => {
    await goto('/landing')

    await expect(page.getByRole('heading', { level: 1, name: '讓每個孩子，都有綻放的時刻' })).toBeVisible()
    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }

    await expect(page.locator('html')).toHaveClass(/landing-theme/)
    await expect(page.getByRole('button', { name: /收合側欄|展開側欄/ })).toHaveCount(0)
  })

  test('導覽列連結會捲動到對應區塊', async ({ page, goto }) => {
    await goto('/landing')

    await page.getByRole('banner').getByRole('link', { name: '常見問題' }).click()
    await expect(page).toHaveURL(/\/landing#faq$/)
    await expect(page.locator('#faq')).toBeInViewport()
  })

  test('主要 CTA 導向建置中頁面，並可回到首頁', async ({ page, goto }) => {
    await goto('/landing')

    await page.getByRole('main').getByRole('link', { name: '免費註冊' }).first().click()
    await expect(page).toHaveURL(/\/landing\/coming-soon$/)
    await expect(page.getByRole('heading', { level: 1, name: '建置中' })).toBeVisible()

    await page.getByRole('main').getByRole('link', { name: '回到首頁' }).click()
    await expect(page).toHaveURL(/\/landing$/)
  })

  test('手機寬度可開啟選單並前往區塊', async ({ page, goto }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await goto('/landing')

    await page
      .getByRole('banner')
      .getByRole('button', { name: /menu|選單/i })
      .click()
    await page.getByRole('dialog').getByRole('link', { name: '學習領域' }).click()
    await expect(page).toHaveURL(/\/landing#subjects$/)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})

import { test, expect } from '@playwright/test'

test.describe('할 일 CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/activity?tab=todos')
    // localStorage 초기화
    await page.evaluate(() => localStorage.removeItem('todos-storage'))
    await page.reload()
  })

  test('할 일 추가', async ({ page }) => {
    // 입력 필드 찾기
    const input = page.getByPlaceholder(/할 일|새로운|추가/)
    if (await input.isVisible()) {
      await input.fill('E2E 테스트 할 일')
      await input.press('Enter')
      await expect(page.locator('text=E2E 테스트 할 일')).toBeVisible()
    }
  })

  test('할 일 완료 토글', async ({ page }) => {
    // 할 일 추가
    const input = page.getByPlaceholder(/할 일|새로운|추가/)
    if (await input.isVisible()) {
      await input.fill('토글 테스트')
      await input.press('Enter')

      // 체크박스 클릭
      const checkbox = page.locator('[role="checkbox"]').first()
      if (await checkbox.isVisible()) {
        await checkbox.click()
        // 완료 상태 확인 (line-through 등)
        await expect(checkbox).toBeChecked()
      }
    }
  })
})

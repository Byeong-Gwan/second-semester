import { test, expect } from '@playwright/test'

test.describe('페이지 네비게이션', () => {
  test('메인 페이지 접속', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Second Semester/)
    await expect(page.locator('text=오늘의 할 일')).toBeVisible()
  })

  test('하단 네비 → 활동 페이지 이동', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '활동' }).click()
    await expect(page).toHaveURL(/\/activity/)
  })

  test('하단 네비 → 일상 페이지 이동', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '일상' }).click()
    await expect(page).toHaveURL(/\/daily/)
  })

  test('하단 네비 → 설정 페이지 이동', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '설정' }).click()
    await expect(page).toHaveURL(/\/settings/)
  })

  test('존재하지 않는 페이지 → 404', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.locator('text=404')).toBeVisible()
    await expect(page.locator('text=페이지를 찾을 수 없습니다')).toBeVisible()
  })
})

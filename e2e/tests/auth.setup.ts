import { test as setup } from '@playwright/test'
import { MOCK_ACCOUNT } from './constants'

export const authFile = 'e2e/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  const emailInput = page.locator('input[name=email]')
  await emailInput.fill(MOCK_ACCOUNT.email)
  const passwordInput = page.locator('input[type=password]')
  await passwordInput.fill(MOCK_ACCOUNT.password)
  const submitButton = page.getByRole('button', {
    name: 'Submit',
  })
  await Promise.all([
    page.waitForRequest(
      (req) => req.method() === 'POST' && req.url().includes('/login')
    ), // Replace with your login endpoint
    submitButton.click(),
  ])
  await page.waitForURL('/room-list')
  await page.waitForResponse(
    (response) =>
      response.url().includes('auth/current') && response.status() === 200
  )
  await page.context().storageState({ path: authFile })
})

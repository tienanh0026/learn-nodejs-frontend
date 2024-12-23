import test, { expect } from '@playwright/test'
import { authFile } from './auth.setup'
import { MOCK_ACCOUNT } from './constants'

test.beforeEach(async ({ page }) => {
  await page.goto('/room-list')
})

test.describe('Auth protection', () => {
  test('should redirect to login', async ({ page }) => {
    // Wait for the URL to change to the login page
    await page.waitForURL('/login')
    await page.waitForResponse(
      (response) => response.url().includes('/') && response.status() === 401
    )
    expect(page.url()).toContain('/login')
  })

  test('Redirect to homepage after logging in', async ({ page }) => {
    await page.waitForURL('/login')
    const emailInput = page.locator('input[name=email]')
    await emailInput.fill(MOCK_ACCOUNT.email)
    const passwordInput = page.locator('input[type=password]')
    await passwordInput.fill(MOCK_ACCOUNT.password)
    const submitButton = page.getByRole('button', {
      name: 'Submit',
    })
    const [request] = await Promise.all([
      page.waitForRequest(
        (req) => req.method() === 'POST' && req.url().includes('/login')
      ), // Replace with your login endpoint
      submitButton.click(),
    ])

    // Check the request payload
    const requestBody = request.postDataJSON()
    // Assert the request data matches the input
    expect(requestBody).toEqual({
      email: MOCK_ACCOUNT.email,
      password: MOCK_ACCOUNT.password,
    })
    await page.waitForResponse(
      (response) => response.url().includes('/') && response.status() === 200
    )
    await page.waitForURL('/room-list')
    expect(page.url()).toContain('/room-list')
  })
})

test.describe('Auth protection', () => {
  // Define the auth state for reuse
  test.use({ storageState: authFile })
  test('Stay when logged in', async ({ page }) => {
    // Navigate to the app (e.g., root or specific page)
    await page.goto('/room-list')
    // Wait for a specific response or element indicating success
    await page.waitForResponse(
      (response) =>
        response.url().includes('auth/current') && response.status() === 200
    )
    expect(page.url()).toContain('/room-list')
  })
})

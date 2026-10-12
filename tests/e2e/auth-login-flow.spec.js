import { test, expect } from '@playwright/test'

test('guest is redirected to auth and a registered user can log in', async ({ page }) => {
  const email = `login-${Date.now()}@example.com`
  const password = 'Password123!'

  await page.goto('/my-meals')
  await expect(page).toHaveURL(/\/auth$/)

  await page.goto('/auth/signup')
  await page.getByLabel('Name').fill('Login User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign Up' }).click()

  await expect(page).toHaveURL(/\/$/)

  await page.request.post('/api/logout')
  await page.goto('/auth/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'NextLevel Food fir NextLevel Foodies' })).toBeVisible()
})

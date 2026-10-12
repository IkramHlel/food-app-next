import { test, expect } from '@playwright/test'

test('user signs up, creates a recipe, and sees it in the dashboard', async ({ page }) => {
  const email = `tester-${Date.now()}@example.com`
  const recipeTitle = `Spicy Pasta Bowl ${Date.now()}`
  const recipeSummary = 'A quick weeknight recipe with tomato and basil.'
  const recipeInstructions = 'Boil the pasta, sauté garlic, add tomatoes and basil, and toss everything together.'

  await page.goto('/auth/signup')
  await page.getByLabel('Name').fill('Test User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('Password123!')
  await page.getByRole('button', { name: 'Sign Up' }).click()

  await expect(page).toHaveURL(/\/$/)

  await page.goto('/meals/share')
  await page.getByLabel('Title').fill(recipeTitle)
  await page.getByLabel('Short Summary').fill(recipeSummary)
  await page.getByLabel('Instructions').fill(recipeInstructions)
  await page.locator('input[type="file"]').setInputFiles({
    name: 'recipe.png',
    mimeType: 'image/png',
    buffer: Buffer.from('fake-image-content'),
  })
  await page.getByRole('button', { name: 'Share Meal' }).click()

  await expect(page).toHaveURL(/\/meals$/)
  await expect(page.getByRole('heading', { name: recipeTitle })).toBeVisible()

  await page.goto('/my-meals')
  await expect(page.getByRole('heading', { name: /Meals shared by/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: recipeTitle })).toBeVisible()
})

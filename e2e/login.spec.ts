import { expect, test } from '@playwright/test';

test('should navigate to the login page', async ({ page }) => {
  await page.goto('/');

  await page.click('text=Login');

  await expect(page).toHaveURL('/login');

  await expect(page.locator('h3')).toContainText('Login');
});

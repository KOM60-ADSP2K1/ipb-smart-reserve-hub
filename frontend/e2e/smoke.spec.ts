import { expect, test } from '@playwright/test';

test('loads the technical frontend root', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /frontend is ready/i })).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();
});

import { test, expect } from '@playwright/test';

test('consent initializes analytics once and preserves the choice across navigation', async ({ page }) => {
  const errors: string[] = [];
  let scriptRequests = 0;
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://www.googletagmanager.com/**', (route) => {
    scriptRequests++;
    return route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  await expect(page.locator('script#google-analytics')).toHaveCount(1);
  await expect.poll(() => scriptRequests).toBe(1);
  const commands = await page.evaluate(() => window.dataLayer?.map((entry) => Array.from(entry)));
  expect(commands?.map((entry) => entry[0])).toEqual(['consent', 'js', 'config']);
  await page.getByRole('link', { name: /blog/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).not.toBeVisible();
  await page.locator('astro-island[component-url*="consent-banner"]:not([ssr])').waitFor({ state: 'attached' });
  expect(scriptRequests).toBe(1);
  expect(await page.evaluate(() => typeof window.gtag)).toBe('function');
  expect(errors).toEqual([]);
});

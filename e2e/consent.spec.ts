import { test, expect } from '@playwright/test';

test('shows consent before any external JavaScript loads', async ({ page }) => {
  await page.route('**/*.js', (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toBeHidden();
  await expect(page.locator('script#google-analytics')).toHaveCount(0);
});

for (const consent of ['true', 'false']) {
  test(`hides prior consent ${consent} before any external JavaScript loads`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('ga-consent', value), consent);
    await page.route('https://www.googletagmanager.com/**', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: '' })
    );
    await page.route('**/*.js', (route) => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'Accept', exact: true })).toBeHidden();
    if (consent === 'false') await expect(page.locator('script#google-analytics')).toHaveCount(0);
  });
}

test('decline prevents analytics across navigation and reload', async ({ page }) => {
  let scriptRequests = 0;
  await page.route('https://www.googletagmanager.com/**', (route) => {
    scriptRequests++;
    return route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.getByRole('link', { name: /blog/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toBeHidden();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toBeHidden();
  expect(scriptRequests).toBe(0);
});

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
  await expect(page.locator('#consent-banner')).toBeHidden();
  expect(scriptRequests).toBe(1);
  expect(await page.evaluate(() => typeof window.gtag)).toBe('function');
  expect(errors).toEqual([]);
});

import { test, expect } from '@playwright/test';

test.describe('Server-rendered pages', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });

  for (const route of [
    '/',
    '/about',
    '/uses',
    '/terms',
    '/privacy',
    '/refunds',
    '/blog',
    '/blog/tags',
    '/blog/tags/testing',
    '/blog/how-to-quickly-remove-multiple-entries-from-the-ssh-knownhosts-file'
  ]) {
    test(`${route} renders without JavaScript at 320px`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page).toHaveTitle(/\S/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    });
  }
});

test.describe('404 Page', () => {
  test('shows 404 for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345');

    // Should return 404 status
    expect(response?.status()).toBe(404);

    // Should show 404 content
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Assets', () => {
  test('critical assets load without 404', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('response', (response) => {
      if (response.status() === 404) {
        const url = response.url();
        // Ignore expected 404s like favicon variations
        if (!url.includes('favicon') && !url.includes('apple-touch-icon') && !url.includes('manifest')) {
          failedRequests.push(url);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedRequests).toHaveLength(0);
  });

  test('images load without network errors', async ({ page }) => {
    const failedImages: string[] = [];

    page.on('response', (response) => {
      const url = response.url();
      if (
        (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.webp')) &&
        response.status() >= 400
      ) {
        failedImages.push(url);
      }
    });

    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    expect(failedImages).toHaveLength(0);
  });
});

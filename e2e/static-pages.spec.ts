import { test, expect } from '@playwright/test';

test.describe('Static Pages', () => {
  test('about page renders', async ({ page }) => {
    await page.goto('/about');

    // Should have about heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have main content
    await expect(page.locator('main')).toBeVisible();

    // Should have profile/bio content
    const mainContent = page.locator('main');
    const textContent = await mainContent.textContent();
    expect(textContent?.length).toBeGreaterThan(100);
  });

  test('uses page renders', async ({ page }) => {
    await page.goto('/uses');

    // Should have uses heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have content about tools/setup
    await expect(page.locator('main')).toBeVisible();
  });

  test('terms page renders', async ({ page }) => {
    await page.goto('/terms');

    // Should have terms heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have legal content
    await expect(page.locator('main')).toBeVisible();
  });

  test('privacy page renders', async ({ page }) => {
    await page.goto('/privacy');

    // Should have privacy heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have privacy content
    await expect(page.locator('main')).toBeVisible();
  });

  test('refunds page renders', async ({ page }) => {
    await page.goto('/refunds');

    // Should have refunds heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have refunds content
    await expect(page.locator('main')).toBeVisible();
  });
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

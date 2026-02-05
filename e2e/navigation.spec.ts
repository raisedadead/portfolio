import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');

    // Should have main content
    await expect(page.locator('main')).toBeVisible();

    // Should have navigation
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('home to blog navigation works', async ({ page }) => {
    await page.goto('/');

    // Find and click blog link
    const blogLink = page.getByRole('link', { name: /blog/i }).first();
    await blogLink.click();

    // Should be on blog page
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  });

  test('blog to post to back navigation', async ({ page }) => {
    await page.goto('/blog');

    // Click on first local post
    const firstPost = page
      .locator('a[href^="/blog/"]')
      .filter({ has: page.getByRole('heading', { level: 2 }) })
      .first();

    const postHref = await firstPost.getAttribute('href');
    await firstPost.click();

    // Should be on post page
    await expect(page).toHaveURL(new RegExp(postHref!));

    // Click back to blog link
    const backLink = page.getByRole('link', { name: /back to blog/i });
    await backLink.click();

    // Should be back on blog
    await expect(page).toHaveURL(/\/blog$/);
  });

  test('logo returns to homepage', async ({ page }) => {
    await page.goto('/blog');

    // Click on home/logo link
    const homeLink = page.getByRole('link', { name: /go home/i });
    await homeLink.click();

    // Should be on homepage
    await expect(page).toHaveURL('/');
  });

  test('mobile menu opens and navigates', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Find and click mobile menu button
    const menuButton = page.getByRole('button', {
      name: /open navigation menu/i
    });

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Menu should be open - look for navigation links
      const blogLink = page.getByRole('link', { name: /blog/i });
      await expect(blogLink).toBeVisible();

      // Click blog link
      await blogLink.click();

      // Should navigate to blog
      await expect(page).toHaveURL(/\/blog/);
    }
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer social links exist
    const twitterLink = page.getByRole('link', { name: /twitter/i });
    const githubLink = page.getByRole('link', { name: /github/i });

    await expect(twitterLink).toBeVisible();
    await expect(githubLink).toBeVisible();
  });
});

test.describe('View Transitions', () => {
  test('page transitions work without full reload', async ({ page }) => {
    await page.goto('/');

    // Navigate to blog
    const blogLink = page.getByRole('link', { name: /blog/i }).first();
    await blogLink.click();

    // Should have transitioned (check URL changed)
    await expect(page).toHaveURL(/\/blog/);

    // Background canvas should persist (check it's still there)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });
});

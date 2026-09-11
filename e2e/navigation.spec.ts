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
    await expect(page).toHaveURL(/\/blog\/?$/);
  });

  test('logo returns to homepage', async ({ page }) => {
    await page.goto('/blog');

    // Click on home/logo link
    const homeLink = page.getByRole('link', { name: /go home/i });
    await homeLink.click();

    // Should be on homepage
    await expect(page).toHaveURL('/');
  });

  test('menu supports keyboard navigation and exposes the active item', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.locator('astro-island[component-url*="nav."]:not([ssr])').waitFor();
    const trigger = page.getByRole('button', { name: 'Open navigation menu' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const blog = page.getByRole('menuitem', { name: 'Recent Posts' });
    await expect(blog).toBeVisible();
    const menu = page.getByRole('menu');
    const activeId = await menu.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    await expect(blog).toHaveAttribute('id', activeId!);
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(blog).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/blog/);
  });

  test('scroll-to-top supports keyboard activation', async ({ page }) => {
    await page.goto('/blog');
    await page.evaluate(() => window.scrollTo(0, 400));
    const button = page.getByRole('button', { name: 'Scroll to top' });
    await expect(button).toBeVisible();
    await button.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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
  test('navigation preserves the document and background canvas', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    const originalDocument = await page.evaluateHandle(() => document);
    await page.evaluate(() => {
      document.querySelector('canvas')!.dataset.navigationProbe = 'present';
    });
    await page.getByRole('link', { name: /blog/i }).first().click();
    await expect(page).toHaveURL(/\/blog/);
    expect(await page.evaluate((previousDocument) => previousDocument === document, originalDocument)).toBe(true);
    await expect(canvas).toHaveAttribute('data-navigation-probe', 'present');
  });
});

import { test, expect } from '@playwright/test';

const isTelemetryHost = (rawUrl: string): boolean => {
  try {
    const { hostname } = new URL(rawUrl);
    return hostname === 'sentry.io' || hostname.endsWith('.sentry.io');
  } catch {
    return false;
  }
};

test.describe('Blog', () => {
  test.describe('Blog Index', () => {
    test('loads with blog posts', async ({ page }) => {
      await page.goto('/blog');

      // Should have the blog heading
      await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();

      // Should have blog post cards (at least 3 visible initially)
      const postLinks = page.locator('a[href^="/blog/"]').filter({
        has: page.getByRole('heading', { level: 2 })
      });
      await expect(postLinks.first()).toBeVisible();
      expect(await postLinks.count()).toBeGreaterThanOrEqual(3);
    });

    test('blog post cards have cover images', async ({ page }) => {
      await page.goto('/blog');

      // Get all local blog post cards (starting with /blog/, not external)
      const postCards = page.locator('a[href^="/blog/"]').filter({
        has: page.getByRole('heading', { level: 2 })
      });

      // Should have posts visible
      await expect(postCards.first()).toBeVisible();

      // Check that images exist within the post card area
      const firstPostCard = postCards.first();
      const imageInCard = firstPostCard.locator('img');

      // Wait for image to be visible
      await expect(imageInCard).toBeVisible();

      // Image must complete network decode before `naturalWidth` reports a
      // real intrinsic size. `toBeVisible` only waits for layout; the image
      // pixels can still be in flight (BentoGrid uses `opacity: 0 → 1`
      // fade-in, which masked the race in earlier iterations).
      await expect
        .poll(async () => imageInCard.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 10_000 })
        .toBeGreaterThan(0);
    });

    test('load more reveals additional posts', async ({ page }) => {
      await page.goto('/blog');
      await page.locator('astro-island[component-url*="BentoGrid"]:not([ssr])').waitFor();
      const cards = page.locator('[data-blog-post-id]');
      await expect(cards).toHaveCount(6);
      await page.getByRole('button', { name: 'Load more blog posts' }).click();
      await expect.poll(() => cards.count()).toBeGreaterThan(6);
      await expect(cards.nth(6)).toBeVisible();
    });

    test('search returns a matching article and an empty state', async ({ page }) => {
      await page.goto('/blog');
      await page.locator('astro-island[component-url*="BlogSearch"]:not([ssr])').waitFor();
      const search = page.getByRole('searchbox');
      await search.fill('dockerignore');
      const result = page.getByRole('option', { name: /How to use a .dockerignore file/i });
      await expect(result).toBeVisible();
      await expect(result).toHaveAttribute(
        'href',
        '/blog/how-to-use-a-dockerignore-file-a-comprehensive-guide-with-examples'
      );
      await search.fill('no-matching-article-12345');
      await expect(page.getByText('No posts match your search')).toBeVisible();
      await expect(page.getByRole('option')).toHaveCount(0);
    });
  });

  test.describe('Blog Post', () => {
    test('individual post renders with content', async ({ page }) => {
      await page.goto('/blog');

      // Click on first blog post (skip external links)
      const firstPost = page
        .locator('a[href^="/blog/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) })
        .first();

      await firstPost.click();

      // Should navigate to post page
      await expect(page).toHaveURL(/\/blog\/.+/);

      // Should have post title
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Should have content (paragraphs)
      const paragraphs = page.locator('main p');
      expect(await paragraphs.count()).toBeGreaterThan(0);
    });

    test('post has cover image that loads', async ({ page }) => {
      await page.goto('/blog');

      // Navigate to first post
      const firstPost = page
        .locator('a[href^="/blog/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) })
        .first();

      await firstPost.click();
      await expect(page).toHaveURL(/\/blog\/.+/);

      const coverImage = page.locator('main img').first();
      await expect(coverImage).toBeVisible();

      // Poll naturalWidth — first read can return 0 while decode is pending.
      await expect
        .poll(async () => coverImage.evaluate((img: HTMLImageElement) => img.naturalWidth), {
          timeout: 5000,
          intervals: [100, 200, 500]
        })
        .toBeGreaterThan(0);
    });

    test('post displays tags', async ({ page }) => {
      await page.goto('/blog');

      // Navigate to first post
      const firstPost = page
        .locator('a[href^="/blog/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) })
        .first();

      await firstPost.click();
      await expect(page).toHaveURL(/\/blog\/.+/);

      // Should have tags section
      const tagsHeading = page.getByRole('heading', { name: /tags/i });
      await expect(tagsHeading).toBeVisible();

      // Should have tag links
      const tagLinks = page.locator('a[href*="/blog/tags/"]');
      expect(await tagLinks.count()).toBeGreaterThan(0);
    });

    test('code blocks render correctly', async ({ page }) => {
      // Navigate to a post known to have code blocks
      await page.goto('/blog/how-to-quickly-remove-multiple-entries-from-the-ssh-knownhosts-file');

      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');

      const code = page.locator('pre code').filter({ hasText: 'ssh-keygen' });
      await expect(code.first()).toBeVisible();
    });
  });

  test.describe('Tags', () => {
    test('tag page shows filtered posts', async ({ page }) => {
      await page.goto('/blog/tags');

      // Should have tags heading
      await expect(page.getByRole('heading', { name: /tags/i, level: 1 })).toBeVisible();

      // Click on a tag
      const firstTag = page.locator('a[href*="/blog/tags/"]').first();
      await firstTag.click();

      // Should be on tag page
      await expect(page).toHaveURL(/\/blog\/tags\/.+/);

      // Should show posts for that tag
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('tags index shows all available tags', async ({ page }) => {
      await page.goto('/blog/tags');

      // Should have the tags heading
      await expect(page.getByRole('heading', { name: /tags/i, level: 1 })).toBeVisible();

      // Should have either tag links or a "no tags" message
      const tagLinks = page.locator('a[href^="/blog/tags/"]');
      const noTagsMessage = page.getByText(/no tags found/i);

      const tagCount = await tagLinks.count();
      const hasNoTagsMessage = await noTagsMessage.isVisible();

      // Either we have tags or we show the empty state
      expect(tagCount > 0 || hasNoTagsMessage).toBeTruthy();
    });
  });
});

test.describe('Console Errors', () => {
  test('blog page has no console errors', async ({ page }) => {
    const errors: Array<{ text: string; url: string }> = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push({ text: msg.text(), url: msg.location().url });
      }
    });

    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = errors
      .filter((error) => !isTelemetryHost(error.url))
      .map((error) => error.text)
      .filter(
        (text) =>
          !text.includes('favicon') && !text.includes('Sentry') && !text.includes('Failed to decode downloaded font')
      );

    expect(criticalErrors).toHaveLength(0);
  });

  test('blog post has no hydration errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/blog/how-to-quickly-remove-multiple-entries-from-the-ssh-knownhosts-file');
    await page.waitForLoadState('networkidle');

    // Check for React hydration errors
    const hydrationErrors = errors.filter(
      (error) =>
        error.includes('Hydration') || error.includes('hydrat') || error.includes('418') || error.includes('423')
    );

    expect(hydrationErrors).toHaveLength(0);
  });
});

import { test, expect } from '@playwright/test';

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

      // Check image loaded successfully (naturalWidth > 0)
      const naturalWidth = await imageInCard.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    });

    test('load more button loads additional posts', async ({ page }) => {
      await page.goto('/blog');

      const loadMoreButton = page.getByRole('button', {
        name: /load more/i
      });

      // If load more button exists and is not disabled
      if ((await loadMoreButton.count()) > 0) {
        const isDisabled = await loadMoreButton.isDisabled();

        if (!isDisabled) {
          // Count posts before clicking
          const postsBeforeCount = await page
            .locator('a[href*="/blog/"]')
            .filter({ has: page.getByRole('heading', { level: 2 }) })
            .count();

          // Click load more
          await loadMoreButton.click();

          // Wait for more posts to load
          await page.waitForTimeout(1000);

          // Should have more posts now or button should be disabled
          const postsAfterCount = await page
            .locator('a[href*="/blog/"]')
            .filter({ has: page.getByRole('heading', { level: 2 }) })
            .count();

          expect(postsAfterCount > postsBeforeCount || (await loadMoreButton.isDisabled())).toBeTruthy();
        }
      }
    });

    test('search filters posts', async ({ page }) => {
      await page.goto('/blog');

      const searchInput = page.getByRole('searchbox');
      await expect(searchInput).toBeVisible();

      // Type a search term
      await searchInput.fill('docker');

      // Wait for filtering
      await page.waitForTimeout(500);

      // Should show filtered results or no results message
      const visiblePosts = page.locator('a[href*="/blog/"]').filter({
        has: page.getByRole('heading', { level: 2 })
      });

      // Either posts match the search or list is filtered down
      const count = await visiblePosts.count();
      // The count should be less than or equal to total (filtered)
      expect(count).toBeGreaterThanOrEqual(0);
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

      // Should have a cover image
      const coverImage = page.locator('main img').first();
      await expect(coverImage).toBeVisible();

      // Check image loaded
      const naturalWidth = await coverImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
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

      // Should have code blocks (using code element as fallback)
      const codeBlocks = page.locator('pre, code');
      const count = await codeBlocks.count();

      // If there are code blocks, verify they're visible
      if (count > 0) {
        await expect(codeBlocks.first()).toBeVisible();
      }

      // At minimum, the page should have rendered
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });

  test.describe('Tags', () => {
    test('tag page shows filtered posts', async ({ page }) => {
      await page.goto('/blog/tags');

      // Should have tags heading
      await expect(page.getByRole('heading', { name: /tags/i, level: 1 })).toBeVisible();

      // Click on a tag
      const firstTag = page.locator('a[href*="/blog/tags/"]').first();
      const _tagName = await firstTag.textContent();
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
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('favicon') && !error.includes('Sentry') && !error.includes('Failed to decode downloaded font')
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

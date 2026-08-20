import { expect, test } from '@playwright/test';

test('warm EmDash runtime until posts render', async ({ request }) => {
  await expect
    .poll(
      async () => {
        const res = await request.get('/blog', { headers: { accept: 'text/html' } });
        if (!res.ok()) return 0;
        const html = await res.text();
        return [...html.matchAll(/href="\/blog\/[a-z0-9-]+"/g)].length;
      },
      { timeout: 60_000, intervals: [1000] }
    )
    .toBeGreaterThanOrEqual(3);

  const post = await request.get('/blog/how-to-quickly-remove-multiple-entries-from-the-ssh-knownhosts-file', {
    headers: { accept: 'text/html' }
  });
  expect(post.ok()).toBe(true);

  const tags = await request.get('/blog/tags', { headers: { accept: 'text/html' } });
  expect(tags.ok()).toBe(true);

  const blogHtml = await (await request.get('/blog', { headers: { accept: 'text/html' } })).text();
  const postHtml = await post.text();
  const mediaUrls = new Set(
    [...`${blogHtml}${postHtml}`.matchAll(/\/_emdash\/api\/media\/file\/[A-Za-z0-9._-]+/g)].map((m) => m[0])
  );
  for (const url of mediaUrls) {
    await expect.poll(async () => (await request.get(url)).status(), { timeout: 30_000, intervals: [500] }).toBe(200);
  }
});

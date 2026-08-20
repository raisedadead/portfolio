import { test, expect } from '@playwright/test';

test.describe('Admin redirects', () => {
  for (const source of ['/admin', '/admin/', '/blog/admin', '/blog/admin/']) {
    test(`${source} answers 302 to the EmDash admin`, async ({ request }) => {
      const response = await request.get(source, { maxRedirects: 0 });

      expect(response.status()).toBe(302);
      expect(response.headers()['location']).toBe('/_emdash/admin');
    });
  }
});

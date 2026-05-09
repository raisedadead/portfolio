import { expect, test } from '@playwright/test';

/**
 * V8 — Cloudflare Access gate enforcement against the built Worker.
 *
 * The webServer launched by `playwright.config.ts` runs `wrangler dev`
 * against `dist/server`, which is the production-shaped artifact. Without
 * a `Cf-Access-Jwt-Assertion` header or `CF_Authorization` cookie, every
 * CMS surface MUST 401 before any handler runs. The dev-bypass is gated
 * on `import.meta.env.DEV`, which is `false` in this build, so the gate
 * is always closed here.
 */

test.describe('CMS Access gate (V8)', () => {
  for (const path of ['/admin', '/admin/edit/some-slug', '/admin/new']) {
    test(`401s unauthenticated GET ${path}`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), `unexpected status for ${path}`).toBe(401);
      const body = await response.json();
      expect(body).toMatchObject({ error: 'unauthorized' });
    });
  }

  test('401s unauthenticated GET /api/cms/posts and emits no-store', async ({ request }) => {
    const response = await request.get('/api/cms/posts', { maxRedirects: 0 });
    expect(response.status()).toBe(401);
    expect(response.headers()['cache-control']).toContain('no-store');
  });

  test('401s unauthenticated POST /api/cms/posts', async ({ request }) => {
    const response = await request.post('/api/cms/posts', {
      data: { title: 'should-not-arrive', body: '...' },
      maxRedirects: 0
    });
    expect(response.status()).toBe(401);
  });

  test('401 reject reason is one of the documented guard reasons', async ({ request }) => {
    const response = await request.get('/admin', { maxRedirects: 0 });
    expect(response.status()).toBe(401);
    const body = (await response.json()) as { reason?: string };
    expect(body.reason).toMatch(
      /^(missing_token|malformed|unsupported_alg|unknown_kid|bad_signature|expired|wrong_iss|wrong_aud|wrong_email)$/
    );
  });

  test('does not gate the public blog index', async ({ request }) => {
    const response = await request.get('/blog');
    expect(response.status()).toBe(200);
  });

  test('does not gate the public site root', async ({ request }) => {
    const response = await request.get('/');
    expect([200, 301, 302]).toContain(response.status());
  });
});

import type { APIContext } from 'astro';
import { describe, expect, it } from 'vitest';
import { GET } from '../../pages/robots.txt';

async function robotsFor(url: string): Promise<string> {
  const response = await GET({ url: new URL(url) } as APIContext);
  return response.text();
}

describe('/robots.txt', () => {
  it('allows crawling on the production host', async () => {
    const body = await robotsFor('https://mrugesh.dev/robots.txt');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Sitemap: https://mrugesh.dev/sitemap.xml');
  });

  it.each(['https://spike-portfolio.example.workers.dev/robots.txt', 'https://www.mrugesh.dev/robots.txt'])(
    'disallows everything on %s',
    async (url) => {
      expect(await robotsFor(url)).toBe('User-agent: *\nDisallow: /\n');
    }
  );
});

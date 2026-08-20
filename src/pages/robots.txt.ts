import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /terms
Disallow: /privacy
Disallow: /refunds
Disallow: /_emdash/

Sitemap: https://mrugesh.dev/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};

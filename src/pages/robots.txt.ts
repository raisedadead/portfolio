import type { APIRoute } from 'astro';

const PRODUCTION_HOST = 'mrugesh.dev';

const productionRobots = `User-agent: *
Allow: /
Disallow: /terms
Disallow: /privacy
Disallow: /refunds
Disallow: /_emdash/

Sitemap: https://mrugesh.dev/sitemap.xml`;

const otherHostRobots = 'User-agent: *\nDisallow: /\n';

export const GET: APIRoute = ({ url }) =>
  new Response(url.hostname === PRODUCTION_HOST ? productionRobots : otherHostRobots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });

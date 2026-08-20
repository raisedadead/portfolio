import type { APIRoute } from 'astro';
import { getEmDashCollection } from 'emdash';
import { getTagsWithCount } from '@/lib/blog-utils';
import { normalizeEmdashPosts } from '@/lib/emdash-posts';

export const prerender = false;

const STATIC_PATHS = ['/', '/about', '/uses', '/blog', '/blog/tags'];

function urlTag(loc: string, lastmod?: string): string {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
}

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://mrugesh.dev')).toString().replace(/\/$/, '');
  const { entries } = await getEmDashCollection('posts', { status: 'published' });
  const posts = normalizeEmdashPosts(entries);

  const urls = [
    ...STATIC_PATHS.map((path) => urlTag(`${origin}${path}`)),
    ...posts.map((post) => urlTag(`${origin}/blog/${post.data.slug}`, new Date(post.data.publishedAt).toISOString())),
    ...getTagsWithCount(posts).map((tag) => urlTag(`${origin}/blog/tags/${tag.slug}`))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
};

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Call the next middleware/page
  const response = await next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Add performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Add caching headers based on file type
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Static assets (images, fonts, etc.)
  if (pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|ttf|eot|css|js)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Blog posts and content pages
  else if (pathname.startsWith('/blog/') || pathname === '/blog') {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  }
  // API endpoints
  else if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300');
  }
  // Main pages
  else if (pathname === '/' || pathname === '/about' || pathname === '/uses') {
    response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600');
  }
  // Legal pages
  else if (pathname.match(/\/(privacy|terms|refunds)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400');
  }
  // Default for other content
  else {
    response.headers.set('Cache-Control', 'public, max-age=1800');
  }

  return response;
});

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: 'cloudflare-workers',
      headers: {
        'user-agent': request.headers.get('user-agent') || 'unknown',
        'cf-ray': request.headers.get('cf-ray') || 'unknown',
        'cf-connecting-ip': request.headers.get('cf-connecting-ip') || 'unknown'
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    }
  );
};

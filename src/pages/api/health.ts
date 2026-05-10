import type { APIRoute } from 'astro';

// Minimal liveness probe for uptime monitors. Server-to-server callers
// don't need CORS allow-all, and echoing client headers (cf-ray,
// cf-connecting-ip, user-agent) is needless info-disclosure surface.
// `cache-control: no-store` so each poll hits the live worker.
export const prerender = false;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store'
      }
    }
  );
};

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      message: 'pong',
      timestamp: new Date().toISOString(),
      url: request.url,
      status: 'ok'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => ({}));

  return new Response(
    JSON.stringify({
      message: 'pong',
      timestamp: new Date().toISOString(),
      url: request.url,
      method: 'POST',
      body: body,
      status: 'ok'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};

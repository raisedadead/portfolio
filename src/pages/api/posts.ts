import type { APIRoute } from 'astro';
import { fetchPostsList } from '@/lib/posts-fetcher';

export const GET: APIRoute = async ({ url }) => {
  const cursor = url.searchParams.get('cursor') || '';

  try {
    const data = await fetchPostsList('', cursor);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Failed to fetch posts'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

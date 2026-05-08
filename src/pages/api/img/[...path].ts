import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { streamR2Image, type R2BucketLike } from '@/lib/r2-image-streamer';

// Force runtime evaluation — this endpoint must reach the live R2 binding,
// not be statically pre-rendered.
export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const rawPath = typeof params.path === 'string' ? params.path : undefined;
  const bucket = (env as unknown as { ARTICLES?: R2BucketLike }).ARTICLES;
  return streamR2Image(bucket, rawPath);
};

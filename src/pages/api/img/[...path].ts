import type { APIRoute } from 'astro';
import { streamR2Image, type R2BucketLike } from '@/lib/r2-image-streamer';

// Force runtime evaluation — this endpoint must reach the live R2 binding,
// not be statically pre-rendered.
export const prerender = false;

interface CloudflareLocals {
  runtime?: {
    env?: { ARTICLES?: R2BucketLike };
  };
}

export const GET: APIRoute = ({ params, locals }) => {
  const rawPath = typeof params.path === 'string' ? params.path : undefined;
  const bucket = (locals as CloudflareLocals).runtime?.env?.ARTICLES;
  return streamR2Image(bucket, rawPath);
};

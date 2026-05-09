import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  CreatePostError,
  createPost,
  listPosts,
  type CreatePostInput,
  type KvBindingLike,
  type R2BindingLike
} from '@/lib/cms-posts';

// Author CMS surface — no caching, no static prerender.
export const prerender = false;

interface CmsBindings {
  ARTICLES?: R2BindingLike;
  CMS_INDEX?: KvBindingLike;
}

function bindings(): { r2: R2BindingLike; kv: KvBindingLike } | Response {
  const cf = env as unknown as CmsBindings;
  if (!cf.ARTICLES || !cf.CMS_INDEX) {
    return jsonResponse(503, {
      error: 'cms_not_configured',
      message: 'ARTICLES R2 binding or CMS_INDEX KV binding is missing'
    });
  }
  return { r2: cf.ARTICLES, kv: cf.CMS_INDEX };
}

function jsonResponse(status: number, body: unknown, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders
    }
  });
}

function mapCreateError(error: CreatePostError): Response {
  const failure = error.failure;
  if (failure.kind === 'slug_conflict') {
    return jsonResponse(409, { error: 'slug_conflict', slug: failure.slug });
  }
  return jsonResponse(400, { error: failure.kind, message: failure.message });
}

export const GET: APIRoute = async ({ url }) => {
  const got = bindings();
  if (got instanceof Response) return got;
  const forceRefresh = url.searchParams.get('refresh') === '1';
  const result = await listPosts(got.r2, got.kv, { forceRefresh });
  return jsonResponse(200, result);
};

export const POST: APIRoute = async ({ request }) => {
  const got = bindings();
  if (got instanceof Response) return got;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: 'invalid_json', message: 'request body must be valid JSON' });
  }
  if (!payload || typeof payload !== 'object') {
    return jsonResponse(400, { error: 'invalid_payload', message: 'expected JSON object' });
  }
  const input = payload as CreatePostInput;

  try {
    const result = await createPost(got.r2, got.kv, input);
    return jsonResponse(201, result, { etag: `"${result.etag}"` });
  } catch (error) {
    if (error instanceof CreatePostError) return mapCreateError(error);
    throw error;
  }
};

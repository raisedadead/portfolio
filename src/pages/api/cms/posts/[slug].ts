import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  CreatePostError,
  DeletePostError,
  deletePost,
  getPost,
  UpdatePostError,
  updatePost,
  type KvBindingLike,
  type R2BindingLike,
  type UpdatePostInput
} from '@/lib/cms-posts';

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

function stripQuotes(value: string | null): string | null {
  if (!value) return null;
  return value.replace(/^"(.*)"$/, '$1').replace(/^W\//, '');
}

export const GET: APIRoute = async ({ params }) => {
  const got = bindings();
  if (got instanceof Response) return got;
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const detail = await getPost(got.r2, slug);
  if (!detail) return jsonResponse(404, { error: 'not_found', slug });
  return jsonResponse(200, detail, { etag: `"${detail.etag}"` });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const got = bindings();
  if (got instanceof Response) return got;
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const ifMatch = stripQuotes(request.headers.get('if-match'));
  if (!ifMatch) {
    return jsonResponse(428, {
      error: 'precondition_required',
      message: 'PUT requires an If-Match header carrying the current etag'
    });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: 'invalid_json', message: 'request body must be valid JSON' });
  }
  if (!payload || typeof payload !== 'object') {
    return jsonResponse(400, { error: 'invalid_payload', message: 'expected JSON object' });
  }

  try {
    const result = await updatePost(got.r2, got.kv, slug, ifMatch, payload as UpdatePostInput);
    return jsonResponse(200, result, { etag: `"${result.etag}"` });
  } catch (error) {
    if (error instanceof UpdatePostError) {
      const failure = error.failure;
      if (failure.kind === 'not_found') return jsonResponse(404, { error: 'not_found', slug });
      if (failure.kind === 'etag_mismatch') {
        return jsonResponse(
          412,
          { error: 'etag_mismatch', current: failure.current },
          { etag: `"${failure.current}"` }
        );
      }
      const message = 'message' in failure ? failure.message : failure.kind;
      return jsonResponse(400, { error: failure.kind, message });
    }
    if (error instanceof CreatePostError) {
      return jsonResponse(400, { error: error.failure.kind, message: error.message });
    }
    throw error;
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const got = bindings();
  if (got instanceof Response) return got;
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const ifMatch = stripQuotes(request.headers.get('if-match'));

  try {
    await deletePost(got.r2, got.kv, slug, ifMatch);
    return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    if (error instanceof DeletePostError) {
      const failure = error.failure;
      if (failure.kind === 'not_found') return jsonResponse(404, { error: 'not_found', slug });
      return jsonResponse(412, { error: 'etag_mismatch', current: failure.current }, { etag: `"${failure.current}"` });
    }
    throw error;
  }
};

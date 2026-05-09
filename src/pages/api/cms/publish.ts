import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { fireDeployHook } from '@/lib/cms-publish';
import { UpdatePostError, updatePost, type KvBindingLike, type R2BindingLike } from '@/lib/cms-posts';

export const prerender = false;

interface CmsBindings {
  ARTICLES?: R2BindingLike;
  CMS_INDEX?: KvBindingLike;
  DEPLOY_HOOK_URL?: string;
}

interface PublishPayload {
  slug?: string;
  etag?: string;
  reason?: string;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export const POST: APIRoute = async ({ request }) => {
  const cf = env as unknown as CmsBindings;
  if (!cf.DEPLOY_HOOK_URL) {
    return jsonResponse(503, {
      error: 'hook_not_configured',
      message: 'DEPLOY_HOOK_URL secret is missing'
    });
  }

  let payload: PublishPayload = {};
  if (request.body) {
    try {
      const parsed = (await request.json()) as PublishPayload;
      if (parsed && typeof parsed === 'object') payload = parsed;
    } catch {
      return jsonResponse(400, { error: 'invalid_json', message: 'request body must be valid JSON' });
    }
  }

  // Optional pre-publish step: flip `draft: false` on the named post so the
  // rebuild picks it up. Both the slug and the etag must be supplied —
  // bare publish (no slug) just fires the hook for ad-hoc rebuilds.
  if (payload.slug) {
    if (!cf.ARTICLES || !cf.CMS_INDEX) {
      return jsonResponse(503, { error: 'cms_not_configured' });
    }
    if (!payload.etag) {
      return jsonResponse(428, {
        error: 'precondition_required',
        message: 'publish with a slug requires the current etag'
      });
    }
    try {
      await updatePost(cf.ARTICLES, cf.CMS_INDEX, payload.slug, payload.etag, { draft: false });
    } catch (error) {
      if (error instanceof UpdatePostError) {
        const failure = error.failure;
        if (failure.kind === 'not_found') return jsonResponse(404, { error: 'not_found', slug: payload.slug });
        if (failure.kind === 'etag_mismatch') {
          return jsonResponse(412, { error: 'etag_mismatch', current: failure.current });
        }
        const message = 'message' in failure ? failure.message : failure.kind;
        return jsonResponse(400, { error: failure.kind, message });
      }
      throw error;
    }
  }

  const hookResult = await fireDeployHook(cf.DEPLOY_HOOK_URL, { reason: payload.reason ?? 'cms-publish' });
  if (!hookResult.ok) {
    return jsonResponse(502, { error: hookResult.message ?? 'hook_failed', status: hookResult.status });
  }

  return jsonResponse(202, { ok: true, slug: payload.slug ?? null, deployStatus: hookResult.status });
};

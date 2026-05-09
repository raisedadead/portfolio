/**
 * CMS middleware composition.
 *
 * The Astro middleware shell (`src/middleware.ts`) wires this function to
 * `defineMiddleware` and the Cloudflare runtime `env`. Keeping the
 * composition logic here means the runtime-only specifiers
 * (`astro:middleware`, `cloudflare:workers`) never leak into the test
 * graph — vitest can call this function with stubbed deps directly.
 *
 * Responsibilities, in order:
 *  1. Guard `/admin/*` + `/api/cms/*` via the injected access guard.
 *  2. Emit Sentry metrics for every `/api/*` response (V14 — including the
 *     401s emitted by the guard, so reject events are observable).
 *  3. Pass everything else straight to `next()`.
 */

import type { AccessGuardConfig, AccessGuardResult } from '@/lib/cms-access-guard';
import { authorizeCmsRequest, isGuardedPath } from '@/lib/cms-access-guard';

export interface CmsMetricAttributes extends Record<string, string> {
  route: string;
  method: string;
  status: string;
}

/**
 * Subset of `Sentry.metrics` we depend on. Loose enough to accept the real
 * `@sentry/astro` re-export (which permits arbitrary attribute shapes)
 * while keeping the call sites strictly typed.
 */
export interface CmsMetricsSink {
  distribution: (name: string, value: number, options?: { unit?: string; attributes?: CmsMetricAttributes }) => void;
  count: (name: string, value: number, options?: { attributes?: CmsMetricAttributes }) => void;
}

export interface RunCmsMiddlewareDeps {
  request: Request;
  next: () => Promise<Response>;
  guardConfig: AccessGuardConfig;
  metrics: CmsMetricsSink;
  /** Override `performance.now` for deterministic metric tests. */
  now?: () => number;
}

function rejectResponse(result: Extract<AccessGuardResult, { kind: 'reject' }>): Response {
  return new Response(JSON.stringify({ error: 'unauthorized', reason: result.reason }), {
    status: result.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

export async function runCmsMiddleware(deps: RunCmsMiddlewareDeps): Promise<Response> {
  const { request, next, guardConfig, metrics } = deps;
  const now = deps.now ?? (() => performance.now());
  const url = new URL(request.url);
  const guarded = isGuardedPath(url.pathname);
  const isApi = url.pathname.startsWith('/api/');

  if (!guarded && !isApi) {
    return next();
  }

  const start = now();
  let response: Response;

  if (guarded) {
    const guardResult = await authorizeCmsRequest(request, guardConfig);
    response = guardResult.kind === 'reject' ? rejectResponse(guardResult) : await next();
  } else {
    response = await next();
  }

  if (isApi) {
    const duration = now() - start;
    const attributes: CmsMetricAttributes = {
      route: url.pathname,
      method: request.method,
      status: String(response.status)
    };
    metrics.distribution('api.response_time', duration, { unit: 'millisecond', attributes });
    metrics.count('api.requests', 1, { attributes });
  }

  return response;
}

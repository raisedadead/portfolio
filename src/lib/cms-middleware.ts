// Pure middleware composition. Lives outside `src/middleware.ts` so
// tests never have to resolve `astro:middleware` / `cloudflare:workers`.

import type { AccessGuardConfig, AccessGuardResult } from '@/lib/cms-access-guard';
import { authorizeCmsRequest, isGuardedPath } from '@/lib/cms-access-guard';

export interface CmsMetricAttributes extends Record<string, string> {
  route: string;
  method: string;
  status: string;
}

// Loose shape so the real `Sentry.metrics` re-export satisfies it.
export interface CmsMetricsSink {
  distribution: (name: string, value: number, options?: { unit?: string; attributes?: CmsMetricAttributes }) => void;
  count: (name: string, value: number, options?: { attributes?: CmsMetricAttributes }) => void;
}

export interface RunCmsMiddlewareDeps {
  request: Request;
  next: () => Promise<Response>;
  guardConfig: AccessGuardConfig;
  metrics: CmsMetricsSink;
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

  if (!guarded && !isApi) return next();

  const start = now();
  let response: Response;

  if (guarded) {
    const guardResult = await authorizeCmsRequest(request, guardConfig);
    response = guardResult.kind === 'reject' ? rejectResponse(guardResult) : await next();
  } else {
    response = await next();
  }

  if (isApi) {
    const attributes: CmsMetricAttributes = {
      route: url.pathname,
      method: request.method,
      status: String(response.status)
    };
    metrics.distribution('api.response_time', now() - start, { unit: 'millisecond', attributes });
    metrics.count('api.requests', 1, { attributes });
  }

  return response;
}

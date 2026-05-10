import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { VerifyResult } from '@/lib/cf-access-jwt';
import type { AccessGuardConfig } from '@/lib/cms-access-guard';
import { runCmsMiddleware, type CmsMetricsSink } from '@/lib/cms-middleware';

const verifyMock = vi.fn();

function makeRequest(pathname: string, init: RequestInit = {}): Request {
  const initHeaders = init.headers as Record<string, string> | undefined;
  const request = new Request(`https://mrugesh.dev${pathname}`, init);
  if (initHeaders) {
    for (const [name, value] of Object.entries(initHeaders)) {
      if (request.headers.get(name) === null) {
        request.headers.set(name, value);
      }
    }
  }
  return request;
}

function nextOk(body = 'ok', status = 200): () => Promise<Response> {
  return async () => new Response(body, { status, headers: { 'content-type': 'text/plain' } });
}

function makeMetrics() {
  const distribution = vi.fn();
  const count = vi.fn();
  const sink: CmsMetricsSink = { distribution, count };
  return { sink, distribution, count };
}

function makeGuardConfig(overrides: Partial<AccessGuardConfig> = {}): AccessGuardConfig {
  return {
    isDevMode: false,
    devBypass: undefined,
    verify: verifyMock as (token: string) => Promise<VerifyResult>,
    isAllowedHost: () => true,
    ...overrides
  };
}

beforeEach(() => {
  verifyMock.mockReset();
});

describe('runCmsMiddleware — guarded paths reject without an Access token', () => {
  it('returns 401 with reason=missing_token on /admin', async () => {
    const { sink } = makeMetrics();
    const next = vi.fn(nextOk());
    const response = await runCmsMiddleware({
      request: makeRequest('/admin'),
      next,
      guardConfig: makeGuardConfig(),
      metrics: sink
    });
    expect(response.status).toBe(401);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('content-type')).toMatch(/application\/json/);
    const body = (await response.json()) as { error: string; reason: string };
    expect(body).toEqual({ error: 'unauthorized', reason: 'missing_token' });
    expect(next).not.toHaveBeenCalled();
    expect(verifyMock).not.toHaveBeenCalled();
  });

  it('returns 401 on /api/cms/posts and never reaches next()', async () => {
    const { sink } = makeMetrics();
    const next = vi.fn(nextOk());
    const response = await runCmsMiddleware({
      request: makeRequest('/api/cms/posts'),
      next,
      guardConfig: makeGuardConfig(),
      metrics: sink
    });
    expect(response.status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards verifier failure reasons (e.g. wrong_email) onto the response body', async () => {
    verifyMock.mockResolvedValueOnce({ valid: false, reason: 'wrong_email' } satisfies VerifyResult);
    const { sink } = makeMetrics();
    const response = await runCmsMiddleware({
      request: makeRequest('/admin', { headers: { 'Cf-Access-Jwt-Assertion': 'a.b.c' } }),
      next: nextOk(),
      guardConfig: makeGuardConfig(),
      metrics: sink
    });
    expect(response.status).toBe(401);
    const body = (await response.json()) as { reason: string };
    expect(body.reason).toBe('wrong_email');
  });
});

describe('runCmsMiddleware — guarded happy path lets verified callers through', () => {
  it('continues to next() when the verifier returns valid', async () => {
    verifyMock.mockResolvedValueOnce({
      valid: true,
      email: 'hi@mrugesh.dev',
      sub: 'cf-access|user-1'
    } satisfies VerifyResult);
    const { sink } = makeMetrics();
    const next = vi.fn(nextOk('handler-output', 201));
    const response = await runCmsMiddleware({
      request: makeRequest('/api/cms/posts', {
        method: 'POST',
        headers: { 'Cf-Access-Jwt-Assertion': 'a.b.c' }
      }),
      next,
      guardConfig: makeGuardConfig(),
      metrics: sink
    });
    expect(next).toHaveBeenCalledOnce();
    expect(response.status).toBe(201);
    expect(await response.text()).toBe('handler-output');
  });
});

describe('runCmsMiddleware — V14: Sentry metrics emit on every /api/* path', () => {
  it('emits api.response_time + api.requests on a 401 from /api/cms', async () => {
    const { sink, distribution, count } = makeMetrics();
    let tick = 100;
    const now = vi.fn(() => {
      const value = tick;
      tick += 7;
      return value;
    });
    await runCmsMiddleware({
      request: makeRequest('/api/cms/posts'),
      next: nextOk(),
      guardConfig: makeGuardConfig(),
      metrics: sink,
      now
    });
    expect(distribution).toHaveBeenCalledOnce();
    expect(distribution).toHaveBeenCalledWith('api.response_time', 7, {
      unit: 'millisecond',
      attributes: { route: '/api/cms/posts', method: 'GET', status: '401' }
    });
    expect(count).toHaveBeenCalledWith('api.requests', 1, {
      attributes: { route: '/api/cms/posts', method: 'GET', status: '401' }
    });
  });

  it('emits Sentry metrics on a non-CMS /api route as before (regression guard)', async () => {
    const { sink, count } = makeMetrics();
    const response = await runCmsMiddleware({
      request: makeRequest('/api/img/cover.png'),
      next: nextOk('img', 200),
      guardConfig: makeGuardConfig(),
      metrics: sink
    });
    expect(response.status).toBe(200);
    expect(count).toHaveBeenCalledWith(
      'api.requests',
      1,
      expect.objectContaining({
        attributes: { route: '/api/img/cover.png', method: 'GET', status: '200' }
      })
    );
  });

  it('does not emit Sentry metrics on a non-/api path like /admin', async () => {
    const { sink, distribution, count } = makeMetrics();
    await runCmsMiddleware({
      request: makeRequest('/admin'),
      next: nextOk(),
      guardConfig: makeGuardConfig(),
      metrics: sink
    });
    expect(distribution).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });

  it('does not emit Sentry metrics on /blog (public path, untouched by middleware)', async () => {
    const { sink, distribution, count } = makeMetrics();
    const next = vi.fn(nextOk('blog-page', 200));
    const response = await runCmsMiddleware({
      request: makeRequest('/blog/foo'),
      next,
      guardConfig: makeGuardConfig(),
      metrics: sink
    });
    expect(next).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(distribution).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });
});

describe('runCmsMiddleware — dev-bypass policy', () => {
  it('lets unauthenticated /admin requests through when the guard is configured for dev bypass', async () => {
    const { sink } = makeMetrics();
    const next = vi.fn(nextOk('dashboard', 200));
    const response = await runCmsMiddleware({
      request: makeRequest('/admin'),
      next,
      guardConfig: makeGuardConfig({ isDevMode: true, devBypass: '1' }),
      metrics: sink
    });
    expect(next).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
  });

  it('still rejects when isDevMode=false even if devBypass=1 (V15 invariant)', async () => {
    const { sink } = makeMetrics();
    const response = await runCmsMiddleware({
      request: makeRequest('/admin'),
      next: nextOk(),
      guardConfig: makeGuardConfig({ isDevMode: false, devBypass: '1' }),
      metrics: sink
    });
    expect(response.status).toBe(401);
  });
});

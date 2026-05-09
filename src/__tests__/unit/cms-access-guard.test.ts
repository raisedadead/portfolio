import { describe, expect, it, vi } from 'vitest';
import {
  authorizeCmsRequest,
  extractAccessToken,
  isGuardedPath,
  type AccessGuardConfig,
  type AccessGuardResult
} from '@/lib/cms-access-guard';
import type { VerifyResult } from '@/lib/cf-access-jwt';

const VALID_TOKEN = 'header.payload.signature';
const VALID_RESULT: VerifyResult = {
  valid: true,
  email: 'hi@mrugesh.dev',
  sub: 'cf-access|user-1'
};

function makeRequest(url: string, init: RequestInit = {}): Request {
  // happy-dom strips forbidden header names (`cookie` etc.) when passed via
  // RequestInit. Reapply them onto the Headers instance after construction
  // so the guard sees what Cloudflare's runtime would deliver.
  const initHeaders = init.headers as Record<string, string> | undefined;
  const request = new Request(`https://mrugesh.dev${url}`, init);
  if (initHeaders) {
    for (const [name, value] of Object.entries(initHeaders)) {
      if (request.headers.get(name) === null) {
        request.headers.set(name, value);
      }
    }
  }
  return request;
}

function makeConfig(overrides: Partial<AccessGuardConfig> = {}): AccessGuardConfig {
  return {
    isDevMode: false,
    devBypass: undefined,
    verify: vi.fn(async () => VALID_RESULT),
    ...overrides
  };
}

describe('isGuardedPath', () => {
  it('returns true for the /admin root', () => {
    expect(isGuardedPath('/admin')).toBe(true);
  });

  it('returns true for nested /admin paths', () => {
    expect(isGuardedPath('/admin/edit/foo')).toBe(true);
  });

  it('returns true for nested /api/cms paths', () => {
    expect(isGuardedPath('/api/cms/posts')).toBe(true);
  });

  it('returns true for /api/cms exactly', () => {
    expect(isGuardedPath('/api/cms')).toBe(true);
  });

  it('returns false for /api/img', () => {
    expect(isGuardedPath('/api/img/foo.png')).toBe(false);
  });

  it('returns false for the /blog tree', () => {
    expect(isGuardedPath('/blog/post-slug')).toBe(false);
  });

  it('returns false for the site root', () => {
    expect(isGuardedPath('/')).toBe(false);
  });

  it('does not match /administrator (boundary check)', () => {
    expect(isGuardedPath('/administrator')).toBe(false);
  });

  it('does not match /api/cmsfoo (boundary check)', () => {
    expect(isGuardedPath('/api/cmsfoo')).toBe(false);
  });
});

describe('extractAccessToken', () => {
  it('reads the Cf-Access-Jwt-Assertion header verbatim', () => {
    const request = makeRequest('/admin', {
      headers: { 'Cf-Access-Jwt-Assertion': VALID_TOKEN }
    });
    expect(extractAccessToken(request)).toBe(VALID_TOKEN);
  });

  it('falls back to the CF_Authorization cookie when the header is absent', () => {
    const request = makeRequest('/admin', {
      headers: { cookie: `CF_Authorization=${VALID_TOKEN}; other=foo` }
    });
    expect(extractAccessToken(request)).toBe(VALID_TOKEN);
  });

  it('prefers the header over the cookie when both are present', () => {
    const request = makeRequest('/admin', {
      headers: {
        'Cf-Access-Jwt-Assertion': VALID_TOKEN,
        cookie: 'CF_Authorization=stale-cookie-value'
      }
    });
    expect(extractAccessToken(request)).toBe(VALID_TOKEN);
  });

  it('returns null when neither header nor cookie is present', () => {
    expect(extractAccessToken(makeRequest('/admin'))).toBeNull();
  });

  it('returns null for an empty header value', () => {
    const request = makeRequest('/admin', { headers: { 'Cf-Access-Jwt-Assertion': '' } });
    expect(extractAccessToken(request)).toBeNull();
  });

  it('returns null when the cookie header is present but has no CF_Authorization entry', () => {
    const request = makeRequest('/admin', { headers: { cookie: 'session=abc; theme=dark' } });
    expect(extractAccessToken(request)).toBeNull();
  });
});

describe('authorizeCmsRequest — non-guarded paths', () => {
  it('passes through any path that is not /admin or /api/cms', async () => {
    const verify = vi.fn();
    const result = await authorizeCmsRequest(makeRequest('/blog'), makeConfig({ verify }));
    expect(result).toEqual<AccessGuardResult>({ kind: 'pass' });
    expect(verify).not.toHaveBeenCalled();
  });

  it('passes through /api/img without invoking the verifier', async () => {
    const verify = vi.fn();
    const result = await authorizeCmsRequest(makeRequest('/api/img/cover.png'), makeConfig({ verify }));
    expect(result).toEqual<AccessGuardResult>({ kind: 'pass' });
    expect(verify).not.toHaveBeenCalled();
  });
});

describe('authorizeCmsRequest — production reject path', () => {
  it('rejects with missing_token when no header and no cookie is present', async () => {
    const result = await authorizeCmsRequest(makeRequest('/admin'), makeConfig());
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'missing_token' });
  });

  it('rejects /api/cms/posts requests without an Access token', async () => {
    const result = await authorizeCmsRequest(makeRequest('/api/cms/posts'), makeConfig());
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'missing_token' });
  });

  it('forwards the verifier failure reason on bad_signature', async () => {
    const verify = vi.fn(async (): Promise<VerifyResult> => ({ valid: false, reason: 'bad_signature' }));
    const result = await authorizeCmsRequest(
      makeRequest('/admin', { headers: { 'Cf-Access-Jwt-Assertion': VALID_TOKEN } }),
      makeConfig({ verify })
    );
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'bad_signature' });
    expect(verify).toHaveBeenCalledWith(VALID_TOKEN);
  });

  it('forwards the verifier failure reason on wrong_email', async () => {
    const verify = vi.fn(async (): Promise<VerifyResult> => ({ valid: false, reason: 'wrong_email' }));
    const result = await authorizeCmsRequest(
      makeRequest('/api/cms/posts', { headers: { 'Cf-Access-Jwt-Assertion': VALID_TOKEN } }),
      makeConfig({ verify })
    );
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'wrong_email' });
  });

  it('forwards the verifier failure reason on expired', async () => {
    const verify = vi.fn(async (): Promise<VerifyResult> => ({ valid: false, reason: 'expired' }));
    const result = await authorizeCmsRequest(
      makeRequest('/admin', { headers: { 'Cf-Access-Jwt-Assertion': VALID_TOKEN } }),
      makeConfig({ verify })
    );
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'expired' });
  });
});

describe('authorizeCmsRequest — happy path', () => {
  it('returns pass with the verified email + sub when the header token is valid', async () => {
    const verify = vi.fn(async () => VALID_RESULT);
    const result = await authorizeCmsRequest(
      makeRequest('/admin/edit/foo', { headers: { 'Cf-Access-Jwt-Assertion': VALID_TOKEN } }),
      makeConfig({ verify })
    );
    expect(result).toEqual<AccessGuardResult>({
      kind: 'pass',
      email: VALID_RESULT.email,
      sub: VALID_RESULT.sub
    });
    expect(verify).toHaveBeenCalledOnce();
    expect(verify).toHaveBeenCalledWith(VALID_TOKEN);
  });

  it('verifies the cookie token when no header is present', async () => {
    const verify = vi.fn(async () => VALID_RESULT);
    const result = await authorizeCmsRequest(
      makeRequest('/api/cms/posts', { headers: { cookie: `CF_Authorization=${VALID_TOKEN}` } }),
      makeConfig({ verify })
    );
    expect(result).toEqual<AccessGuardResult>({
      kind: 'pass',
      email: VALID_RESULT.email,
      sub: VALID_RESULT.sub
    });
  });
});

describe('authorizeCmsRequest — dev-bypass policy (V15)', () => {
  it('returns bypass for /admin when isDevMode AND DEV_BYPASS_ACCESS=1 AND no token', async () => {
    const verify = vi.fn();
    const result = await authorizeCmsRequest(
      makeRequest('/admin'),
      makeConfig({ isDevMode: true, devBypass: '1', verify })
    );
    expect(result).toEqual<AccessGuardResult>({ kind: 'bypass' });
    expect(verify).not.toHaveBeenCalled();
  });

  it('rejects in production even when DEV_BYPASS_ACCESS=1 (prod build cannot be bypassed)', async () => {
    const verify = vi.fn();
    const result = await authorizeCmsRequest(
      makeRequest('/admin'),
      makeConfig({ isDevMode: false, devBypass: '1', verify })
    );
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'missing_token' });
    expect(verify).not.toHaveBeenCalled();
  });

  it('rejects in dev when DEV_BYPASS_ACCESS is "0"', async () => {
    const result = await authorizeCmsRequest(makeRequest('/admin'), makeConfig({ isDevMode: true, devBypass: '0' }));
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'missing_token' });
  });

  it('rejects in dev when DEV_BYPASS_ACCESS is undefined', async () => {
    const result = await authorizeCmsRequest(
      makeRequest('/admin'),
      makeConfig({ isDevMode: true, devBypass: undefined })
    );
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'missing_token' });
  });

  it('rejects in dev when DEV_BYPASS_ACCESS is any value other than the literal "1"', async () => {
    const result = await authorizeCmsRequest(makeRequest('/admin'), makeConfig({ isDevMode: true, devBypass: 'true' }));
    expect(result).toEqual<AccessGuardResult>({ kind: 'reject', status: 401, reason: 'missing_token' });
  });

  it('still verifies a real token in dev mode (bypass is opt-in, not a hard skip)', async () => {
    const verify = vi.fn(async () => VALID_RESULT);
    const result = await authorizeCmsRequest(
      makeRequest('/admin', { headers: { 'Cf-Access-Jwt-Assertion': VALID_TOKEN } }),
      makeConfig({ isDevMode: true, devBypass: '0', verify })
    );
    expect(result).toEqual<AccessGuardResult>({
      kind: 'pass',
      email: VALID_RESULT.email,
      sub: VALID_RESULT.sub
    });
  });
});

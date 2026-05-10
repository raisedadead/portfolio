import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  createKvJwksProvider,
  DEFAULT_JWKS_TTL_MS,
  JWKS_CACHE_KEY,
  type CfAccessJwk,
  type CfAccessJwks,
  type JwksProvider,
  type KvNamespaceLike,
  verifyAccessJwt
} from '@/lib/cf-access-jwt';

const TEAM_DOMAIN = 'mrugesh.cloudflareaccess.com';
const AUD = 'd9f1a8d2c3b4e5f60718293a4b5c6d7e';
const AUTHOR_EMAIL = 'hi@mrugesh.dev';
const KID = 'test-kid-1';
const ISS = `https://${TEAM_DOMAIN}`;

interface TestKeys {
  publicJwk: CfAccessJwk;
  privateKey: CryptoKey;
}

let keys: TestKeys;

beforeAll(async () => {
  const pair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );
  const publicJwk = (await crypto.subtle.exportKey('jwk', pair.publicKey)) as CfAccessJwk;
  publicJwk.kid = KID;
  publicJwk.alg = 'RS256';
  publicJwk.use = 'sig';
  keys = { publicJwk, privateKey: pair.privateKey };
});

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeJson(value: unknown): string {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)));
}

interface TokenOptions {
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signWith?: CryptoKey;
  tamper?: boolean;
}

async function signToken(opts: TokenOptions = {}): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT', kid: KID, ...opts.header };
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    iss: ISS,
    aud: AUD,
    email: AUTHOR_EMAIL,
    sub: 'cf-access|user-1',
    iat: nowSec,
    exp: nowSec + 3600,
    ...opts.payload
  };
  const headerB64 = base64UrlEncodeJson(header);
  const payloadB64 = base64UrlEncodeJson(payload);
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    opts.signWith ?? keys.privateKey,
    data as BufferSource
  );
  let signatureB64 = base64UrlEncode(new Uint8Array(signature));
  if (opts.tamper) signatureB64 = `${signatureB64.slice(0, -2)}AA`;
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

function staticJwksProvider(jwks: CfAccessJwks): JwksProvider {
  return {
    async fetch() {
      return jwks;
    }
  };
}

function baseConfig(overrides: Partial<Parameters<typeof verifyAccessJwt>[1]> = {}) {
  return {
    teamDomain: TEAM_DOMAIN,
    audience: AUD,
    authorEmail: AUTHOR_EMAIL,
    jwksProvider: staticJwksProvider({ keys: [keys.publicJwk] }),
    ...overrides
  };
}

describe('verifyAccessJwt — happy path', () => {
  it('returns valid + email + sub for a well-formed token signed by the trusted key', async () => {
    const token = await signToken();
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: true, email: AUTHOR_EMAIL, sub: 'cf-access|user-1' });
  });

  it('accepts an aud array containing the configured audience', async () => {
    const token = await signToken({ payload: { aud: ['other-app', AUD] } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: true, email: AUTHOR_EMAIL, sub: 'cf-access|user-1' });
  });

  it('accepts a token whose aud matches any entry of a multi-audience config (preview URL Access app)', async () => {
    const PREVIEW_AUD = 'preview-app-aud-uuid-0123456789abcdef';
    const token = await signToken({ payload: { aud: PREVIEW_AUD } });
    const result = await verifyAccessJwt(token, baseConfig({ audience: [AUD, PREVIEW_AUD] }));
    expect(result).toEqual({ valid: true, email: AUTHOR_EMAIL, sub: 'cf-access|user-1' });
  });

  it('rejects a token whose aud matches none of the configured audiences', async () => {
    const token = await signToken({ payload: { aud: 'unrelated-app-aud' } });
    const result = await verifyAccessJwt(token, baseConfig({ audience: [AUD, 'second-aud'] }));
    expect(result).toEqual({ valid: false, reason: 'wrong_aud' });
  });
});

describe('verifyAccessJwt — claim failures', () => {
  it('rejects an expired token', async () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    const token = await signToken({ payload: { exp: past, iat: past - 3600 } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'expired' });
  });

  it('rejects a token whose iss does not match the team domain', async () => {
    const token = await signToken({ payload: { iss: 'https://attacker.cloudflareaccess.com' } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'wrong_iss' });
  });

  it('rejects a token whose aud does not contain the configured audience', async () => {
    const token = await signToken({ payload: { aud: 'some-other-app-aud' } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'wrong_aud' });
  });

  it('rejects a token whose email is not the author allowlist', async () => {
    const token = await signToken({ payload: { email: 'someone-else@example.com' } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'wrong_email' });
  });

  it('rejects a token with a missing email claim', async () => {
    const token = await signToken({ payload: { email: undefined } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'wrong_email' });
  });

  it('treats a missing exp claim as malformed', async () => {
    const token = await signToken({ payload: { exp: undefined } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'malformed' });
  });
});

describe('verifyAccessJwt — signature & header failures', () => {
  it('rejects a token signed by a different key', async () => {
    const otherPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256'
      },
      true,
      ['sign', 'verify']
    );
    const token = await signToken({ signWith: otherPair.privateKey });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'bad_signature' });
  });

  it('rejects a token whose signature has been tampered with', async () => {
    const token = await signToken({ tamper: true });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'bad_signature' });
  });

  it('rejects a token referencing an unknown kid', async () => {
    const token = await signToken({ header: { kid: 'unknown-kid-xyz' } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'unknown_kid' });
  });

  it('rejects a token with no kid header', async () => {
    const token = await signToken({ header: { kid: undefined } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'unknown_kid' });
  });

  it('rejects a token using an unsupported algorithm', async () => {
    const token = await signToken({ header: { alg: 'HS256' } });
    const result = await verifyAccessJwt(token, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'unsupported_alg' });
  });
});

describe('verifyAccessJwt — malformed input', () => {
  it('rejects a token that does not have three parts', async () => {
    const result = await verifyAccessJwt('only.two', baseConfig());
    expect(result).toEqual({ valid: false, reason: 'malformed' });
  });

  it('rejects a token with empty segments', async () => {
    const result = await verifyAccessJwt('..', baseConfig());
    expect(result).toEqual({ valid: false, reason: 'malformed' });
  });

  it('rejects a token whose header is not valid JSON', async () => {
    const headerB64 = base64UrlEncode(new TextEncoder().encode('not-json'));
    const payloadB64 = base64UrlEncode(new TextEncoder().encode('{}'));
    const result = await verifyAccessJwt(`${headerB64}.${payloadB64}.AAAA`, baseConfig());
    expect(result).toEqual({ valid: false, reason: 'malformed' });
  });
});

describe('verifyAccessJwt — clock injection', () => {
  it('honours the injected now() so tests are deterministic', async () => {
    const futureNow = Date.now() + 7200 * 1000;
    const token = await signToken();
    const result = await verifyAccessJwt(token, baseConfig({ now: () => futureNow }));
    expect(result).toEqual({ valid: false, reason: 'expired' });
  });
});

describe('createKvJwksProvider', () => {
  function fakeKv(): KvNamespaceLike & { store: Map<string, string>; gets: number; puts: number } {
    const store = new Map<string, string>();
    const kv = {
      store,
      gets: 0,
      puts: 0,
      async get(key: string, _options: { type: 'json' }) {
        kv.gets += 1;
        const raw = store.get(key);
        return raw ? JSON.parse(raw) : null;
      },
      async put(key: string, value: string, _options?: { expirationTtl?: number }) {
        kv.puts += 1;
        store.set(key, value);
      }
    };
    return kv;
  }

  it('fetches JWKS on cache miss and writes the result back to KV', async () => {
    const kv = fakeKv();
    const jwks: CfAccessJwks = { keys: [keys.publicJwk] };
    const fetchImpl = vi.fn(
      async () => new Response(JSON.stringify(jwks), { status: 200, headers: { 'content-type': 'application/json' } })
    ) as unknown as typeof fetch;
    const provider = createKvJwksProvider({
      kv,
      teamDomain: TEAM_DOMAIN,
      now: () => 1_000_000_000,
      fetchImpl
    });
    const out = await provider.fetch();
    expect(out).toEqual(jwks);
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl).toHaveBeenCalledWith(`https://${TEAM_DOMAIN}/cdn-cgi/access/certs`);
    expect(kv.puts).toBe(1);
    const stored = JSON.parse(kv.store.get(JWKS_CACHE_KEY) as string);
    expect(stored.fetchedAt).toBe(1_000_000_000);
    expect(stored.jwks).toEqual(jwks);
  });

  it('returns the cached JWKS within the TTL without calling fetch', async () => {
    const kv = fakeKv();
    const jwks: CfAccessJwks = { keys: [keys.publicJwk] };
    kv.store.set(JWKS_CACHE_KEY, JSON.stringify({ jwks, fetchedAt: 1_000_000_000 }));
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    const provider = createKvJwksProvider({
      kv,
      teamDomain: TEAM_DOMAIN,
      now: () => 1_000_000_000 + DEFAULT_JWKS_TTL_MS - 1,
      fetchImpl
    });
    const out = await provider.fetch();
    expect(out).toEqual(jwks);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('refetches when the cache is stale (older than the TTL)', async () => {
    const kv = fakeKv();
    const stale: CfAccessJwks = { keys: [{ ...keys.publicJwk, kid: 'old-kid' }] };
    const fresh: CfAccessJwks = { keys: [keys.publicJwk] };
    kv.store.set(JWKS_CACHE_KEY, JSON.stringify({ jwks: stale, fetchedAt: 0 }));
    const fetchImpl = vi.fn(
      async () => new Response(JSON.stringify(fresh), { status: 200 })
    ) as unknown as typeof fetch;
    const provider = createKvJwksProvider({
      kv,
      teamDomain: TEAM_DOMAIN,
      ttlMs: 1000,
      now: () => 5000,
      fetchImpl
    });
    const out = await provider.fetch();
    expect(out).toEqual(fresh);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it('throws when the JWKS endpoint returns a non-2xx status', async () => {
    const kv = fakeKv();
    const fetchImpl = vi.fn(async () => new Response('boom', { status: 503 })) as unknown as typeof fetch;
    const provider = createKvJwksProvider({ kv, teamDomain: TEAM_DOMAIN, fetchImpl });
    await expect(provider.fetch()).rejects.toThrow(/JWKS fetch failed: 503/);
  });

  it('throws when the JWKS response shape is invalid', async () => {
    const kv = fakeKv();
    const fetchImpl = vi.fn(
      async () => new Response(JSON.stringify({ wrong: 'shape' }), { status: 200 })
    ) as unknown as typeof fetch;
    const provider = createKvJwksProvider({ kv, teamDomain: TEAM_DOMAIN, fetchImpl });
    await expect(provider.fetch()).rejects.toThrow(/JWKS response shape invalid/);
  });

  it('uses the injected expirationTtl floor (60s minimum) on tiny TTLs', async () => {
    const kv = fakeKv();
    const jwks: CfAccessJwks = { keys: [keys.publicJwk] };
    let lastTtl: number | undefined;
    const captureKv: KvNamespaceLike = {
      get: kv.get.bind(kv),
      async put(k, v, opts) {
        lastTtl = opts?.expirationTtl;
        await kv.put(k, v, opts);
      }
    };
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(jwks), { status: 200 })) as unknown as typeof fetch;
    const provider = createKvJwksProvider({
      kv: captureKv,
      teamDomain: TEAM_DOMAIN,
      ttlMs: 500,
      fetchImpl
    });
    await provider.fetch();
    expect(lastTtl).toBe(60);
  });
});

describe('verifyAccessJwt — provider integration', () => {
  it('passes through to the configured provider exactly once per call', async () => {
    const provider: JwksProvider = {
      fetch: vi.fn(async () => ({ keys: [keys.publicJwk] }))
    };
    const token = await signToken();
    const result = await verifyAccessJwt(token, baseConfig({ jwksProvider: provider }));
    expect(result).toMatchObject({ valid: true });
    expect(provider.fetch).toHaveBeenCalledOnce();
  });
});

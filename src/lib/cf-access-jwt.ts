/**
 * Cloudflare Access JWT verifier.
 *
 * Verifies tokens issued by a self-hosted Cloudflare Access application.
 * Tokens arrive in the `Cf-Access-Jwt-Assertion` request header (or the
 * `CF_Authorization` cookie) and are signed RS256 by Cloudflare with a
 * key whose JWKS is published at
 * `https://<team_domain>/cdn-cgi/access/certs`.
 *
 * Design:
 *   - Pure verifier: takes a token + config, returns a discriminated union.
 *     Crypto via Web Crypto (`crypto.subtle.verify`); zero npm deps.
 *   - JWKS fetch is delegated to a `JwksProvider` interface so the verifier
 *     itself never touches KV or the network.
 *   - `createKvJwksProvider` bundles a 10-minute KV cache + fetch.
 *
 * Failure modes are exhaustive and stable for telemetry — see
 * {@link VerifyFailureReason}.
 */

export const DEFAULT_JWKS_TTL_MS = 10 * 60 * 1000;
export const JWKS_CACHE_KEY = 'cf-access-jwks-v1';

export interface CfAccessJwk {
  kid: string;
  kty: 'RSA';
  use?: 'sig';
  alg?: 'RS256';
  n: string;
  e: string;
}

export interface CfAccessJwks {
  keys: CfAccessJwk[];
}

export interface JwksProvider {
  /** Returns the current JWKS. Implementations may cache. Throws on hard failure. */
  fetch(): Promise<CfAccessJwks>;
}

export interface VerifyConfig {
  /** Cloudflare Access team domain, e.g. `mrugesh.cloudflareaccess.com`. */
  teamDomain: string;
  /** Self-hosted Application AUD tag (UUID). */
  audience: string;
  /** Single allowed author email — must match `email` claim. */
  authorEmail: string;
  /** JWKS source. Tests inject a fake; prod uses {@link createKvJwksProvider}. */
  jwksProvider: JwksProvider;
  /** Override `Date.now` for deterministic tests. Returns ms epoch. */
  now?: () => number;
}

export type VerifyFailureReason =
  | 'malformed'
  | 'unsupported_alg'
  | 'unknown_kid'
  | 'bad_signature'
  | 'expired'
  | 'wrong_iss'
  | 'wrong_aud'
  | 'wrong_email';

export type VerifyResult = { valid: true; email: string; sub: string } | { valid: false; reason: VerifyFailureReason };

interface JwtHeader {
  alg: string;
  kid?: string;
  typ?: string;
}

interface JwtPayload {
  iss?: string;
  aud?: string | string[];
  email?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
}

/**
 * Verify a Cloudflare Access JWT against a single-author allowlist.
 *
 * @returns `{ valid: true, email, sub }` on success or
 *          `{ valid: false, reason }` on any failure.
 */
export async function verifyAccessJwt(token: string, config: VerifyConfig): Promise<VerifyResult> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'malformed' };
  }
  const [headerB64, payloadB64, signatureB64] = parts;
  if (!headerB64 || !payloadB64 || !signatureB64) {
    return { valid: false, reason: 'malformed' };
  }

  let header: JwtHeader;
  let payload: JwtPayload;
  try {
    header = JSON.parse(decodeBase64UrlToString(headerB64));
    payload = JSON.parse(decodeBase64UrlToString(payloadB64));
  } catch {
    return { valid: false, reason: 'malformed' };
  }

  if (header.alg !== 'RS256') {
    return { valid: false, reason: 'unsupported_alg' };
  }
  if (!header.kid) {
    return { valid: false, reason: 'unknown_kid' };
  }

  const jwks = await config.jwksProvider.fetch();
  const jwk = jwks.keys.find((k) => k.kid === header.kid);
  if (!jwk) {
    return { valid: false, reason: 'unknown_kid' };
  }

  const cryptoKey = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, [
    'verify'
  ]);

  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signatureBytes = decodeBase64UrlToBytes(signatureB64);
  const signatureValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signatureBytes as BufferSource,
    signedData as BufferSource
  );
  if (!signatureValid) {
    return { valid: false, reason: 'bad_signature' };
  }

  if (typeof payload.exp !== 'number') {
    return { valid: false, reason: 'malformed' };
  }
  const nowMs = (config.now ?? Date.now)();
  if (payload.exp * 1000 <= nowMs) {
    return { valid: false, reason: 'expired' };
  }

  const expectedIss = `https://${config.teamDomain}`;
  if (payload.iss !== expectedIss) {
    return { valid: false, reason: 'wrong_iss' };
  }

  const audMatch = Array.isArray(payload.aud) ? payload.aud.includes(config.audience) : payload.aud === config.audience;
  if (!audMatch) {
    return { valid: false, reason: 'wrong_aud' };
  }

  if (payload.email !== config.authorEmail) {
    return { valid: false, reason: 'wrong_email' };
  }

  return {
    valid: true,
    email: payload.email,
    sub: typeof payload.sub === 'string' ? payload.sub : ''
  };
}

export interface KvNamespaceLike {
  get(key: string, options: { type: 'json' }): Promise<unknown | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface CachedJwks {
  jwks: CfAccessJwks;
  fetchedAt: number;
}

export interface KvJwksProviderOptions {
  kv: KvNamespaceLike;
  teamDomain: string;
  /** Cache TTL in ms. Default 10 minutes. */
  ttlMs?: number;
  /** `Date.now` override for tests. */
  now?: () => number;
  /** `fetch` override for tests. */
  fetchImpl?: typeof fetch;
}

/**
 * KV-cached JWKS provider. Fetches `https://<team_domain>/cdn-cgi/access/certs`
 * and caches the response in KV under {@link JWKS_CACHE_KEY} with TTL.
 *
 * Fail-closed: on fetch error with no fresh cache, throws.
 */
export function createKvJwksProvider(options: KvJwksProviderOptions): JwksProvider {
  const { kv, teamDomain } = options;
  const ttlMs = options.ttlMs ?? DEFAULT_JWKS_TTL_MS;
  const now = options.now ?? Date.now;
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async fetch(): Promise<CfAccessJwks> {
      const cached = (await kv.get(JWKS_CACHE_KEY, { type: 'json' })) as CachedJwks | null;
      if (cached && now() - cached.fetchedAt < ttlMs && isJwks(cached.jwks)) {
        return cached.jwks;
      }
      const url = `https://${teamDomain}/cdn-cgi/access/certs`;
      const response = await fetchImpl(url);
      if (!response.ok) {
        throw new Error(`JWKS fetch failed: ${response.status}`);
      }
      const body = (await response.json()) as unknown;
      if (!isJwks(body)) {
        throw new Error('JWKS response shape invalid');
      }
      const record: CachedJwks = { jwks: body, fetchedAt: now() };
      await kv.put(JWKS_CACHE_KEY, JSON.stringify(record), {
        expirationTtl: Math.max(60, Math.ceil(ttlMs / 1000))
      });
      return body;
    }
  };
}

function isJwks(value: unknown): value is CfAccessJwks {
  if (typeof value !== 'object' || value === null) return false;
  const keys = (value as { keys?: unknown }).keys;
  if (!Array.isArray(keys)) return false;
  return keys.every(
    (k) =>
      typeof k === 'object' &&
      k !== null &&
      typeof (k as CfAccessJwk).kid === 'string' &&
      typeof (k as CfAccessJwk).n === 'string' &&
      typeof (k as CfAccessJwk).e === 'string'
  );
}

function decodeBase64UrlToString(input: string): string {
  return new TextDecoder().decode(decodeBase64UrlToBytes(input));
}

function decodeBase64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

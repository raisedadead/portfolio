/**
 * CMS Access gate.
 *
 * Pure transport-shaped check that decides whether a request is allowed to
 * touch `/admin/*` or `/api/cms/*`. The middleware wires the guard to the
 * Cloudflare Access JWT verifier (RS256) from `cf-access-jwt.ts` and the
 * runtime env (`import.meta.env.DEV`, `env.DEV_BYPASS_ACCESS`).
 *
 * The guard itself is deliberately stateless and IO-free — verification is
 * injected as a callback so unit tests can drive every reject branch
 * without crypto. The middleware constructs the verifier per-request from
 * the KV-cached JWKS provider.
 *
 * Reject reasons mirror {@link VerifyFailureReason} plus `missing_token`
 * for the no-credential case so telemetry can attribute the 401 cleanly.
 */

import type { VerifyFailureReason, VerifyResult } from '@/lib/cf-access-jwt';

export const ACCESS_HEADER = 'Cf-Access-Jwt-Assertion';
export const ACCESS_COOKIE = 'CF_Authorization';

const ADMIN_PREFIX = '/admin';
const CMS_API_PREFIX = '/api/cms';

export type GuardRejectReason = 'missing_token' | VerifyFailureReason;

export type AccessGuardResult =
  | { kind: 'pass'; email: string; sub: string }
  | { kind: 'pass' }
  | { kind: 'bypass' }
  | { kind: 'reject'; status: 401; reason: GuardRejectReason };

export interface AccessGuardConfig {
  /** True when running under `astro dev`. Statically replaced at build time. */
  isDevMode: boolean;
  /** Raw value of `env.DEV_BYPASS_ACCESS`. Only the literal string `"1"` enables bypass. */
  devBypass: string | undefined;
  /** Verifier callback. Implementations should be pure relative to the token + injected JWKS. */
  verify: (token: string) => Promise<VerifyResult>;
}

/** Returns true for any path the CMS gate must guard. */
export function isGuardedPath(pathname: string): boolean {
  return matchesPrefix(pathname, ADMIN_PREFIX) || matchesPrefix(pathname, CMS_API_PREFIX);
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  if (pathname === prefix) return true;
  return pathname.startsWith(`${prefix}/`);
}

/**
 * Pulls the Cloudflare Access JWT off the request. Cloudflare sets both the
 * `Cf-Access-Jwt-Assertion` request header and the `CF_Authorization`
 * cookie; we prefer the header because it is the canonical surface for
 * server-to-server checks. Empty strings are treated as absent.
 */
export function extractAccessToken(request: Request): string | null {
  const headerValue = request.headers.get(ACCESS_HEADER);
  if (headerValue && headerValue.length > 0) return headerValue;

  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(/;\s*/);
  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq <= 0) continue;
    const name = part.slice(0, eq);
    if (name !== ACCESS_COOKIE) continue;
    const value = part.slice(eq + 1);
    return value.length > 0 ? value : null;
  }
  return null;
}

/**
 * Decide whether a request should reach the next handler.
 *
 * - Non-guarded paths return `{ kind: 'pass' }` immediately — no verifier call.
 * - When the dev-only bypass is opt-in (`isDevMode && devBypass === '1'`) and
 *   no token is supplied, return `{ kind: 'bypass' }`. A real token in dev
 *   still flows through the verifier so prod/dev parity is preserved.
 * - Missing token in any other case → `missing_token` reject.
 * - Verifier failure → reject carrying the verifier reason verbatim.
 */
export async function authorizeCmsRequest(request: Request, config: AccessGuardConfig): Promise<AccessGuardResult> {
  const url = new URL(request.url);
  if (!isGuardedPath(url.pathname)) {
    return { kind: 'pass' };
  }

  const token = extractAccessToken(request);

  if (!token) {
    if (config.isDevMode && config.devBypass === '1') {
      return { kind: 'bypass' };
    }
    return { kind: 'reject', status: 401, reason: 'missing_token' };
  }

  const result = await config.verify(token);
  if (!result.valid) {
    return { kind: 'reject', status: 401, reason: result.reason };
  }
  return { kind: 'pass', email: result.email, sub: result.sub };
}

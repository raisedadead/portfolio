// Pure CMS gate. Verification is injected so tests drive every reject
// branch without crypto.

import type { VerifyFailureReason, VerifyResult } from '@/lib/cf-access-jwt';

export const ACCESS_HEADER = 'Cf-Access-Jwt-Assertion';
export const ACCESS_COOKIE = 'CF_Authorization';

const ADMIN_PREFIX = '/admin';
const CMS_API_PREFIX = '/api/cms';

export type GuardRejectReason = 'missing_token' | 'host_not_allowed' | VerifyFailureReason;

export type AccessGuardResult =
  | { kind: 'pass'; email: string; sub: string }
  | { kind: 'pass' }
  | { kind: 'bypass' }
  | { kind: 'reject'; status: 401 | 404; reason: GuardRejectReason };

export interface AccessGuardConfig {
  isDevMode: boolean;
  /** Only the literal string `"1"` enables bypass. */
  devBypass: string | undefined;
  verify: (token: string) => Promise<VerifyResult>;
  /**
   * Defense-in-depth host check for guarded paths. Returns true if the
   * request's hostname is allowed to reach `/admin/*` or `/api/cms/*`.
   * Anything else gets a generic 404 to hide CMS-path existence — even
   * if a future CF Access misconfiguration drops the upstream gate.
   */
  isAllowedHost: (hostname: string) => boolean;
}

export function isGuardedPath(pathname: string): boolean {
  return matchesPrefix(pathname, ADMIN_PREFIX) || matchesPrefix(pathname, CMS_API_PREFIX);
}

/** Escapes every regex metacharacter for safe inclusion in a `RegExp` source. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a host-matcher from an allowlist. Entries can be exact hostnames
 * (`mrugesh.dev`) or single-`*` globs (`*-portfolio.<account>.workers.dev`).
 * Each `*` matches one DNS label (no dots). Comparison is case-insensitive.
 */
export function buildIsAllowedHost(allowedHosts: readonly string[]): (hostname: string) => boolean {
  const exact = new Set<string>();
  const patterns: RegExp[] = [];
  for (const raw of allowedHosts) {
    const entry = raw.trim().toLowerCase();
    if (!entry) continue;
    if (entry.includes('*')) {
      // Split on `*` so each literal segment can be fully escaped against
      // every regex metacharacter — not just `.`. Rejoin with the
      // single-DNS-label glob `[^.]+`.
      const escapedSegments = entry.split('*').map(escapeRegex);
      const re = new RegExp(`^${escapedSegments.join('[^.]+')}$`);
      patterns.push(re);
    } else {
      exact.add(entry);
    }
  }
  return (hostname) => {
    const h = hostname.toLowerCase();
    if (exact.has(h)) return true;
    return patterns.some((re) => re.test(h));
  };
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  if (pathname === prefix) return true;
  return pathname.startsWith(`${prefix}/`);
}

export function extractAccessToken(request: Request): string | null {
  const headerValue = request.headers.get(ACCESS_HEADER);
  if (headerValue && headerValue.length > 0) return headerValue;

  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(/;\s*/)) {
    const eq = part.indexOf('=');
    if (eq <= 0) continue;
    if (part.slice(0, eq) !== ACCESS_COOKIE) continue;
    const value = part.slice(eq + 1);
    return value.length > 0 ? value : null;
  }
  return null;
}

export async function authorizeCmsRequest(request: Request, config: AccessGuardConfig): Promise<AccessGuardResult> {
  const url = new URL(request.url);
  if (!isGuardedPath(url.pathname)) return { kind: 'pass' };

  if (!config.isAllowedHost(url.hostname)) {
    return { kind: 'reject', status: 404, reason: 'host_not_allowed' };
  }

  const token = extractAccessToken(request);

  if (!token) {
    if (config.isDevMode && config.devBypass === '1') return { kind: 'bypass' };
    return { kind: 'reject', status: 401, reason: 'missing_token' };
  }

  const result = await config.verify(token);
  if (!result.valid) return { kind: 'reject', status: 401, reason: result.reason };
  return { kind: 'pass', email: result.email, sub: result.sub };
}

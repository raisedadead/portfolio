// Pure CMS gate. Verification is injected so tests drive every reject
// branch without crypto.

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
  isDevMode: boolean;
  /** Only the literal string `"1"` enables bypass. */
  devBypass: string | undefined;
  verify: (token: string) => Promise<VerifyResult>;
}

export function isGuardedPath(pathname: string): boolean {
  return matchesPrefix(pathname, ADMIN_PREFIX) || matchesPrefix(pathname, CMS_API_PREFIX);
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

  const token = extractAccessToken(request);

  if (!token) {
    if (config.isDevMode && config.devBypass === '1') return { kind: 'bypass' };
    return { kind: 'reject', status: 401, reason: 'missing_token' };
  }

  const result = await config.verify(token);
  if (!result.valid) return { kind: 'reject', status: 401, reason: result.reason };
  return { kind: 'pass', email: result.email, sub: result.sub };
}

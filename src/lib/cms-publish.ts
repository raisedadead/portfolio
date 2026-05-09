/**
 * CMS publish hook — fires the Cloudflare Workers Build deploy webhook.
 *
 * The webhook URL is a long-lived secret stored as `DEPLOY_HOOK_URL`. It
 * MUST never appear in error responses, logs, or any leak surface — the
 * URL itself is the only credential. The route handler wraps this with
 * the access gate so only the authenticated author can fire it.
 */

export interface FireDeployHookOptions {
  /** Override the global fetch for tests. */
  fetchImpl?: typeof fetch;
  /** Optional metadata sent in the webhook POST body. */
  reason?: string;
}

export interface FireDeployHookResult {
  ok: boolean;
  status: number;
  /** Brief, redacted error message — never includes the hook URL. */
  message?: string;
}

const HOOK_PATTERN =
  /^https:\/\/api\.cloudflare\.com\/client\/v4\/pages\/webhooks\/deploy_hooks\/[A-Za-z0-9-]+$|^https:\/\/[^/]+\/[A-Za-z0-9_/.~-]+$/;

/**
 * POSTs to the deploy hook. Safe failure modes:
 *   - missing or malformed URL → returns `{ ok: false, status: 0, message: 'hook_not_configured' }`
 *   - hook 4xx/5xx → returns `{ ok: false, status, message: 'hook_failed' }` (no URL leak)
 *   - network throw → returns `{ ok: false, status: 0, message: 'hook_unreachable' }`
 *
 * Successful POSTs return `{ ok: true, status }`.
 */
export async function fireDeployHook(
  hookUrl: string | undefined,
  options: FireDeployHookOptions = {}
): Promise<FireDeployHookResult> {
  if (!hookUrl || !HOOK_PATTERN.test(hookUrl)) {
    return { ok: false, status: 0, message: 'hook_not_configured' };
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const body = JSON.stringify({ reason: options.reason ?? 'cms-publish', firedAt: new Date().toISOString() });
  try {
    const response = await fetchImpl(hookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body
    });
    if (!response.ok) {
      return { ok: false, status: response.status, message: 'hook_failed' };
    }
    return { ok: true, status: response.status };
  } catch {
    // Never echo the underlying error message — it can include the URL.
    return { ok: false, status: 0, message: 'hook_unreachable' };
  }
}

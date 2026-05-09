// `DEPLOY_HOOK_URL` is the only credential — never let it leak into a
// response or thrown error. Every failure path returns a canned constant.

export interface FireDeployHookOptions {
  fetchImpl?: typeof fetch;
  reason?: string;
}

export interface FireDeployHookResult {
  ok: boolean;
  status: number;
  message?: string;
}

const HOOK_PATTERN =
  /^https:\/\/api\.cloudflare\.com\/client\/v4\/pages\/webhooks\/deploy_hooks\/[A-Za-z0-9-]+$|^https:\/\/[^/]+\/[A-Za-z0-9_/.~-]+$/;

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
    if (!response.ok) return { ok: false, status: response.status, message: 'hook_failed' };
    return { ok: true, status: response.status };
  } catch {
    return { ok: false, status: 0, message: 'hook_unreachable' };
  }
}

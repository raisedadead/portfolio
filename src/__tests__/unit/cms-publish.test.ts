import { describe, expect, it, vi } from 'vitest';
import { fireDeployHook } from '@/lib/cms-publish';

const VALID_HOOK = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/abc-123-XYZ';

function fakeOk(status = 204): typeof fetch {
  return vi.fn(async () => new Response(null, { status })) as unknown as typeof fetch;
}

describe('fireDeployHook', () => {
  it('returns hook_not_configured when the URL is undefined', async () => {
    const result = await fireDeployHook(undefined);
    expect(result).toEqual({ ok: false, status: 0, message: 'hook_not_configured' });
  });

  it('returns hook_not_configured when the URL is malformed', async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    const result = await fireDeployHook('not-a-url', { fetchImpl });
    expect(result).toEqual({ ok: false, status: 0, message: 'hook_not_configured' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('POSTs JSON to the configured hook on success', async () => {
    const fetchImpl = fakeOk(204);
    const result = await fireDeployHook(VALID_HOOK, { fetchImpl, reason: 'cms-publish' });
    expect(result.ok).toBe(true);
    expect(result.status).toBe(204);
    expect(fetchImpl).toHaveBeenCalledWith(
      VALID_HOOK,
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' }
      })
    );
    const body = JSON.parse(
      (fetchImpl as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls[0][1].body as string
    );
    expect(body.reason).toBe('cms-publish');
    expect(body.firedAt).toBeDefined();
  });

  it('redacts the hook URL on a 4xx/5xx response (no URL leak)', async () => {
    const fetchImpl = vi.fn(
      async () => new Response('detailed-server-error', { status: 503 })
    ) as unknown as typeof fetch;
    const result = await fireDeployHook(VALID_HOOK, { fetchImpl });
    expect(result).toEqual({ ok: false, status: 503, message: 'hook_failed' });
    // Verify the message NEVER contains the hook URL or any part of it.
    expect(JSON.stringify(result)).not.toContain('cloudflare.com');
    expect(JSON.stringify(result)).not.toContain('abc-123-XYZ');
  });

  it('redacts the hook URL on a network throw (no error message leak)', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error(`fetch ${VALID_HOOK} failed: ECONNREFUSED`);
    }) as unknown as typeof fetch;
    const result = await fireDeployHook(VALID_HOOK, { fetchImpl });
    expect(result).toEqual({ ok: false, status: 0, message: 'hook_unreachable' });
    expect(JSON.stringify(result)).not.toContain('cloudflare.com');
    expect(JSON.stringify(result)).not.toContain('abc-123-XYZ');
    expect(JSON.stringify(result)).not.toContain('ECONNREFUSED');
  });

  it('accepts a generic deploy-hook URL (e.g. cf-pages legacy webhook)', async () => {
    const fetchImpl = fakeOk(200);
    const result = await fireDeployHook('https://api.example.com/build/hooks/some_id', { fetchImpl });
    expect(result.ok).toBe(true);
  });
});

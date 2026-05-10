import type { APIContext } from 'astro';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../../pages/api/health';

interface HealthResponse {
  status: string;
  timestamp: string;
}

function isHealthResponse(data: unknown): data is HealthResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    'timestamp' in data &&
    typeof (data as Record<string, unknown>).status === 'string' &&
    typeof (data as Record<string, unknown>).timestamp === 'string'
  );
}

function callGet(): Promise<Response> {
  const request = new Request('https://example.com/api/health', { method: 'GET' });
  return Promise.resolve(GET({ request } as APIContext) as Response);
}

describe('/api/health — liveness probe', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 200', async () => {
    const response = await callGet();
    expect(response.status).toBe(200);
  });

  it('returns JSON body { status: "healthy", timestamp: <ISO> }', async () => {
    const response = await callGet();
    const data = (await response.json()) as unknown;
    if (!isHealthResponse(data)) throw new Error('unexpected health response shape');
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBe('2025-01-15T12:00:00.000Z');
  });

  it('sets content-type: application/json; charset=utf-8', async () => {
    const response = await callGet();
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
  });

  it('sets cache-control: no-store (no edge or browser caching)', async () => {
    const response = await callGet();
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('does NOT set Access-Control-Allow-Origin (S2S monitors do not need CORS)', async () => {
    const response = await callGet();
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('does NOT echo request headers in body (info-disclosure surface)', async () => {
    const request = new Request('https://example.com/api/health', {
      method: 'GET',
      headers: {
        'user-agent': 'AttackerBot/1.0',
        'cf-connecting-ip': '203.0.113.42'
      }
    });
    const response = (await GET({ request } as APIContext)) as Response;
    const body = (await response.text()).toLowerCase();
    expect(body).not.toContain('attackerbot');
    expect(body).not.toContain('203.0.113.42');
    expect(body).not.toContain('cf-connecting-ip');
    expect(body).not.toContain('user-agent');
  });
});

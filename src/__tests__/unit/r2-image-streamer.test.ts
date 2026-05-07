import { describe, expect, it, vi } from 'vitest';
import {
  IMAGE_PREFIX,
  resolveImageKey,
  streamR2Image,
  type R2BucketLike,
  type R2GetObjectLike
} from '@/lib/r2-image-streamer';

function bodyStream(content: Uint8Array | string): ReadableStream<Uint8Array> {
  const bytes = typeof content === 'string' ? new TextEncoder().encode(content) : content;
  return new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });
}

function fakeObject(overrides: Partial<R2GetObjectLike> & { content: string }): R2GetObjectLike {
  const { content, ...rest } = overrides;
  return {
    body: bodyStream(content),
    httpEtag: '"abc123"',
    httpMetadata: { contentType: 'image/png' },
    size: content.length,
    ...rest
  };
}

describe('resolveImageKey', () => {
  it('prefixes the path with assets/images/', () => {
    expect(resolveImageKey('alpha/cover.png')).toBe(`${IMAGE_PREFIX}alpha/cover.png`);
  });

  it('strips a leading slash', () => {
    expect(resolveImageKey('/alpha/cover.png')).toBe(`${IMAGE_PREFIX}alpha/cover.png`);
  });

  it('returns null for empty / undefined input', () => {
    expect(resolveImageKey(undefined)).toBeNull();
    expect(resolveImageKey('')).toBeNull();
    expect(resolveImageKey('/')).toBeNull();
  });

  it('rejects path-traversal attempts', () => {
    expect(resolveImageKey('../etc/passwd')).toBeNull();
    expect(resolveImageKey('alpha/../../secrets/key')).toBeNull();
  });
});

describe('streamR2Image', () => {
  it('returns 503 when the R2 binding is unavailable', async () => {
    const res = await streamR2Image(undefined, 'alpha/cover.png');
    expect(res.status).toBe(503);
    expect(await res.text()).toMatch(/R2 binding/);
  });

  it('returns 400 when no path is provided', async () => {
    const bucket: R2BucketLike = { get: vi.fn() };
    const res = await streamR2Image(bucket, undefined);
    expect(res.status).toBe(400);
    expect(bucket.get).not.toHaveBeenCalled();
  });

  it('returns 400 on path traversal', async () => {
    const bucket: R2BucketLike = { get: vi.fn() };
    const res = await streamR2Image(bucket, '../oops');
    expect(res.status).toBe(400);
    expect(bucket.get).not.toHaveBeenCalled();
  });

  it('returns 404 when the key is missing', async () => {
    const bucket: R2BucketLike = { get: vi.fn(async () => null) };
    const res = await streamR2Image(bucket, 'alpha/missing.png');
    expect(res.status).toBe(404);
    expect(bucket.get).toHaveBeenCalledWith(`${IMAGE_PREFIX}alpha/missing.png`);
  });

  it('streams the body and sets immutable cache headers on hit', async () => {
    const obj = fakeObject({ content: 'PNG-BYTES' });
    const bucket: R2BucketLike = { get: vi.fn(async () => obj) };

    const res = await streamR2Image(bucket, 'alpha/cover.png');

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    expect(res.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(res.headers.get('etag')).toBe('"abc123"');
    expect(res.headers.get('content-length')).toBe('9');
    expect(await res.text()).toBe('PNG-BYTES');
  });

  it('falls back to application/octet-stream when R2 has no content-type', async () => {
    const obj = fakeObject({ content: 'x', httpMetadata: undefined });
    const bucket: R2BucketLike = { get: vi.fn(async () => obj) };
    const res = await streamR2Image(bucket, 'alpha/blob');
    expect(res.headers.get('content-type')).toBe('application/octet-stream');
  });

  it('omits content-length when the R2 object size is unknown', async () => {
    const obj = fakeObject({ content: 'x', size: undefined });
    const bucket: R2BucketLike = { get: vi.fn(async () => obj) };
    const res = await streamR2Image(bucket, 'alpha/cover.png');
    expect(res.headers.get('content-length')).toBeNull();
  });
});

/**
 * R2 image streaming primitive used by `src/pages/api/img/[...path].ts`.
 *
 * Kept in `lib/` so the response logic can be unit-tested without going
 * through the Astro runtime. The route handler just maps the URL into an
 * R2 key (`assets/images/<rest>`) and delegates here.
 *
 * Cloudflare Image Resizing (`?w=`, `?q=`) is intentionally out of scope
 * for this slice — that integration depends on the zone-level Image
 * Resizing feature being enabled and is tracked separately. The streamer
 * is forward-compatible: callers can add a transform layer in front
 * without changing this contract.
 */

/** Minimal subset of the Workers `R2Object` shape that the streamer reads. */
export interface R2GetObjectLike {
  body: ReadableStream<Uint8Array>;
  httpEtag?: string;
  httpMetadata?: { contentType?: string };
  size?: number;
}

/** Minimal subset of the Workers `R2Bucket` shape needed by the streamer. */
export interface R2BucketLike {
  get(key: string): Promise<R2GetObjectLike | null>;
}

export const IMAGE_PREFIX = 'assets/images/';
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * Maps the route's catch-all `path` segment to an R2 key under
 * `assets/images/`. Reject empty paths and any traversal escapes.
 */
export function resolveImageKey(rawPath: string | undefined): string | null {
  if (!rawPath) return null;
  // Reject absolute, empty, dotted, or escaping paths early.
  const normalized = rawPath.replace(/^\/+/, '');
  if (!normalized) return null;
  if (normalized.includes('..')) return null;
  return `${IMAGE_PREFIX}${normalized}`;
}

/**
 * Streams an R2 object back as an HTTP response. 404 when the key is
 * missing, 503 when the binding is unavailable.
 */
export async function streamR2Image(bucket: R2BucketLike | undefined, rawPath: string | undefined): Promise<Response> {
  if (!bucket) {
    return new Response('R2 binding unavailable', { status: 503 });
  }
  const key = resolveImageKey(rawPath);
  if (!key) {
    return new Response('Bad image path', { status: 400 });
  }
  const object = await bucket.get(key);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers({
    'cache-control': IMMUTABLE_CACHE_CONTROL,
    'content-type': object.httpMetadata?.contentType ?? 'application/octet-stream'
  });
  if (object.httpEtag) headers.set('etag', object.httpEtag);
  if (typeof object.size === 'number') headers.set('content-length', String(object.size));

  return new Response(object.body as unknown as BodyInit, { status: 200, headers });
}

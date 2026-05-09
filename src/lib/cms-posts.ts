/**
 * CMS post library — pure logic for the `/api/cms/posts*` routes.
 *
 * Separation of concerns:
 *   - Route handlers in `src/pages/api/cms/...` wire the workerd `env.ARTICLES`
 *     (R2 binding) + `env.CMS_INDEX` (KV cache) into the functions below.
 *   - This module never imports `cloudflare:workers`. Bindings are passed in
 *     as minimal interfaces so vitest can stub them.
 *
 * Storage layout (single-prefix model):
 *   - All posts live under `posts/<slug>.md`.
 *   - The `draft: true` frontmatter flag marks unpublished entries; the
 *     blog index filters them out. Publish (T4.6) flips `draft` to `false`
 *     and fires the Cloudflare Workers Build deploy hook.
 */

import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export const POSTS_PREFIX = 'posts/';
export const CMS_INDEX_KEY = 'cms:index:v1';
export const CMS_INDEX_TTL_SECONDS = 3600;
export const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
export const MAX_BODY_BYTES = 100 * 1024;
export const MAX_TITLE_LEN = 200;

// ─── Bindings ────────────────────────────────────────────────────────────────

export interface R2ObjectMetaLike {
  key: string;
  size: number;
  uploaded: Date;
  etag: string;
  httpEtag: string;
}

export interface R2ObjectBodyLike extends R2ObjectMetaLike {
  text(): Promise<string>;
}

export interface R2ListResultLike {
  objects: R2ObjectMetaLike[];
  truncated: boolean;
  cursor?: string;
}

export interface R2BindingLike {
  list(options: { prefix?: string; cursor?: string; limit?: number }): Promise<R2ListResultLike>;
  head(key: string): Promise<R2ObjectMetaLike | null>;
  get(key: string): Promise<R2ObjectBodyLike | null>;
  put(
    key: string,
    body: string | ArrayBuffer | ReadableStream,
    options?: { httpMetadata?: { contentType?: string }; onlyIf?: { etagMatches?: string } }
  ): Promise<R2ObjectMetaLike | null>;
  delete(key: string): Promise<void>;
}

export interface KvBindingLike {
  get<T = unknown>(key: string, options: { type: 'json' }): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

// ─── Domain shapes ───────────────────────────────────────────────────────────

export interface PostFrontmatter {
  title: string;
  date: string;
  draft: boolean;
  cover?: string;
  coverAlt?: string;
  brief?: string;
  tags?: string[];
}

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  cover?: string;
  brief?: string;
  updatedAt: string;
  etag: string;
}

export interface CmsIndexCache {
  posts: PostSummary[];
  generatedAt: string;
}

export interface CreatePostInput {
  slug?: string;
  title: string;
  date?: string;
  cover?: string;
  coverAlt?: string;
  brief?: string;
  tags?: string[];
  draft?: boolean;
  body: string;
}

export interface CreatePostResult {
  slug: string;
  etag: string;
  updatedAt: string;
}

export type ValidationFailure =
  | { kind: 'invalid_slug'; message: string }
  | { kind: 'invalid_title'; message: string }
  | { kind: 'invalid_body'; message: string }
  | { kind: 'invalid_date'; message: string }
  | { kind: 'slug_conflict'; slug: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/**
 * Slug-safe representation of an arbitrary title. Lowercases, replaces
 * non-alphanumerics with `-`, collapses runs, trims edges. Returns an empty
 * string if the title yields no usable characters; callers must validate.
 */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {}, body: raw };
  const [, yamlBlock, body] = match;
  const data = (parseYaml(yamlBlock) ?? {}) as Record<string, unknown>;
  return { data, body };
}

export function serializePost(frontmatter: PostFrontmatter, body: string): string {
  // Drop undefineds so the YAML stays terse + diffable.
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(frontmatter)) {
    if (v !== undefined) data[k] = v;
  }
  return `---\n${stringifyYaml(data)}---\n\n${body.replace(/^\s+/, '')}\n`;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function summarizeFromFrontmatter(slug: string, data: Record<string, unknown>, meta: R2ObjectMetaLike): PostSummary {
  const title = asString(data.title) ?? slug;
  const dateValue = data.date;
  const date =
    typeof dateValue === 'string'
      ? dateValue
      : dateValue instanceof Date
        ? dateValue.toISOString()
        : new Date(meta.uploaded).toISOString();
  return {
    slug,
    title,
    date,
    draft: asBoolean(data.draft) ?? false,
    cover: asString(data.cover),
    brief: asString(data.brief),
    updatedAt: new Date(meta.uploaded).toISOString(),
    etag: meta.etag
  };
}

export function validateCreateInput(input: CreatePostInput): ValidationFailure | null {
  const title = (input.title ?? '').trim();
  if (title.length === 0 || title.length > MAX_TITLE_LEN) {
    return { kind: 'invalid_title', message: `title must be 1-${MAX_TITLE_LEN} characters` };
  }
  const slug = input.slug ?? slugifyTitle(title);
  if (!SLUG_PATTERN.test(slug) || slug.length > 80) {
    return { kind: 'invalid_slug', message: 'slug must match /^[a-z0-9][a-z0-9-]*[a-z0-9]?$/ and be ≤80 chars' };
  }
  const body = input.body ?? '';
  if (typeof body !== 'string' || body.length === 0) {
    return { kind: 'invalid_body', message: 'body must be a non-empty string' };
  }
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
    return { kind: 'invalid_body', message: `body must be ≤${MAX_BODY_BYTES} bytes` };
  }
  if (input.date !== undefined) {
    const parsed = Date.parse(input.date);
    if (Number.isNaN(parsed)) {
      return { kind: 'invalid_date', message: 'date must be ISO-8601' };
    }
  }
  return null;
}

// ─── Operations ──────────────────────────────────────────────────────────────

export interface ListPostsOptions {
  /** Force a cache miss and rebuild the index. */
  forceRefresh?: boolean;
  /** Override Date.now for deterministic tests. */
  now?: () => number;
}

export interface ListPostsResult {
  posts: PostSummary[];
  cached: boolean;
  generatedAt: string;
}

/**
 * Reads the post index from KV cache, falling back to a full R2 list+head walk
 * on cache miss or `forceRefresh: true`. The cache stores frontmatter-derived
 * summaries only — full post bodies stay in R2.
 */
export async function listPosts(
  r2: R2BindingLike,
  kv: KvBindingLike,
  options: ListPostsOptions = {}
): Promise<ListPostsResult> {
  if (!options.forceRefresh) {
    const cached = await kv.get<CmsIndexCache>(CMS_INDEX_KEY, { type: 'json' });
    if (cached && Array.isArray(cached.posts)) {
      return { posts: cached.posts, cached: true, generatedAt: cached.generatedAt };
    }
  }

  const summaries: PostSummary[] = [];
  let cursor: string | undefined;
  do {
    const page = await r2.list({ prefix: POSTS_PREFIX, cursor, limit: 1000 });
    for (const obj of page.objects) {
      if (!obj.key.endsWith('.md')) continue;
      const slug = obj.key.slice(POSTS_PREFIX.length, -3);
      const body = await r2.get(obj.key);
      if (!body) continue;
      const text = await body.text();
      const { data } = splitFrontmatter(text);
      summaries.push(summarizeFromFrontmatter(slug, data, body));
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  summaries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const generatedAt = new Date((options.now ?? Date.now)()).toISOString();
  const record: CmsIndexCache = { posts: summaries, generatedAt };
  await kv.put(CMS_INDEX_KEY, JSON.stringify(record), { expirationTtl: CMS_INDEX_TTL_SECONDS });
  return { posts: summaries, cached: false, generatedAt };
}

export class CreatePostError extends Error {
  constructor(public failure: ValidationFailure) {
    super(failure.kind === 'slug_conflict' ? `slug already exists: ${failure.slug}` : failure.message);
    this.name = 'CreatePostError';
  }
}

export interface CreatePostOptions {
  /** Override the clock for deterministic tests + default `date` field. */
  now?: () => number;
}

/**
 * Validates the input, ensures the slug is free, writes the markdown blob to
 * R2, and invalidates the KV index cache. Returns the new slug + R2 etag so
 * the caller can echo them back to the editor for the next If-Match round-trip.
 *
 * Throws `CreatePostError` on validation failure or slug conflict — the route
 * handler maps these to 400/409 responses without leaking internals.
 */
export async function createPost(
  r2: R2BindingLike,
  kv: KvBindingLike,
  input: CreatePostInput,
  options: CreatePostOptions = {}
): Promise<CreatePostResult> {
  const failure = validateCreateInput(input);
  if (failure) throw new CreatePostError(failure);

  const title = input.title.trim();
  const slug = input.slug ?? slugifyTitle(title);
  const key = `${POSTS_PREFIX}${slug}.md`;
  const existing = await r2.head(key);
  if (existing) {
    throw new CreatePostError({ kind: 'slug_conflict', slug });
  }

  const nowMs = (options.now ?? Date.now)();
  const date = input.date ?? new Date(nowMs).toISOString();
  const frontmatter: PostFrontmatter = {
    title,
    date,
    draft: input.draft ?? true,
    cover: input.cover,
    coverAlt: input.coverAlt,
    brief: input.brief,
    tags: input.tags
  };

  const markdown = serializePost(frontmatter, input.body);
  const written = await r2.put(key, markdown, {
    httpMetadata: { contentType: 'text/markdown; charset=utf-8' }
  });
  if (!written) {
    throw new Error('R2 put returned null — write rejected');
  }

  await kv.delete(CMS_INDEX_KEY);

  return {
    slug,
    etag: written.etag,
    updatedAt: new Date(written.uploaded).toISOString()
  };
}

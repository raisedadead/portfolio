// CMS post library — pure logic for `/api/cms/posts*`. Bindings are
// passed in as minimal interfaces so vitest can stub them; this module
// never imports `cloudflare:workers`.
//
// Storage: all posts live under `posts/<slug>.md`. The `draft` frontmatter
// flag controls public visibility; publish flips it to `false` and fires
// the deploy hook.

import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export const POSTS_PREFIX = 'posts/';
export const CMS_INDEX_KEY = 'cms:index:v1';
export const CMS_INDEX_TTL_SECONDS = 3600;
export const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
export const MAX_BODY_BYTES = 100 * 1024;
export const MAX_TITLE_LEN = 200;

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

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

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
  if (input.date !== undefined && Number.isNaN(Date.parse(input.date))) {
    return { kind: 'invalid_date', message: 'date must be ISO-8601' };
  }
  return null;
}

export interface ListPostsOptions {
  forceRefresh?: boolean;
  now?: () => number;
}

export interface ListPostsResult {
  posts: PostSummary[];
  cached: boolean;
  generatedAt: string;
}

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

export interface PostDetail {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
  etag: string;
  updatedAt: string;
}

export interface UpdatePostInput {
  title?: string;
  date?: string;
  cover?: string | null;
  coverAlt?: string | null;
  brief?: string | null;
  tags?: string[];
  draft?: boolean;
  body?: string;
}

export type UpdatePostFailure = { kind: 'not_found' } | { kind: 'etag_mismatch'; current: string } | ValidationFailure;

export class UpdatePostError extends Error {
  constructor(public failure: UpdatePostFailure) {
    super(failure.kind);
    this.name = 'UpdatePostError';
  }
}

export interface CreatePostOptions {
  now?: () => number;
}

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
  if (await r2.head(key)) throw new CreatePostError({ kind: 'slug_conflict', slug });

  const date = input.date ?? new Date((options.now ?? Date.now)()).toISOString();
  const markdown = serializePost(
    {
      title,
      date,
      draft: input.draft ?? true,
      cover: input.cover,
      coverAlt: input.coverAlt,
      brief: input.brief,
      tags: input.tags
    },
    input.body
  );
  const written = await r2.put(key, markdown, {
    httpMetadata: { contentType: 'text/markdown; charset=utf-8' }
  });
  if (!written) throw new Error('R2 put returned null — write rejected');

  await kv.delete(CMS_INDEX_KEY);
  return { slug, etag: written.etag, updatedAt: new Date(written.uploaded).toISOString() };
}

export async function getPost(r2: R2BindingLike, slug: string): Promise<PostDetail | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const obj = await r2.get(`${POSTS_PREFIX}${slug}.md`);
  if (!obj) return null;
  const { data, body } = splitFrontmatter(await obj.text());
  return {
    slug,
    frontmatter: data,
    body,
    etag: obj.etag,
    updatedAt: new Date(obj.uploaded).toISOString()
  };
}

function applyUpdate(existing: Record<string, unknown>, patch: UpdatePostInput): PostFrontmatter {
  const next: Record<string, unknown> = { ...existing };
  if (patch.title !== undefined) next.title = patch.title.trim();
  if (patch.date !== undefined) next.date = patch.date;
  if (patch.draft !== undefined) next.draft = patch.draft;
  if (patch.tags !== undefined) next.tags = patch.tags;
  for (const [k, v] of [
    ['cover', patch.cover],
    ['coverAlt', patch.coverAlt],
    ['brief', patch.brief]
  ] as const) {
    if (v === null) delete next[k];
    else if (v !== undefined) next[k] = v;
  }
  return {
    title: typeof next.title === 'string' ? next.title : '',
    date:
      typeof next.date === 'string'
        ? next.date
        : next.date instanceof Date
          ? next.date.toISOString()
          : new Date().toISOString(),
    draft: typeof next.draft === 'boolean' ? next.draft : false,
    cover: typeof next.cover === 'string' ? next.cover : undefined,
    coverAlt: typeof next.coverAlt === 'string' ? next.coverAlt : undefined,
    brief: typeof next.brief === 'string' ? next.brief : undefined,
    tags: Array.isArray(next.tags) ? (next.tags as string[]) : undefined
  };
}

function validateUpdateInput(patch: UpdatePostInput, finalBody: string): ValidationFailure | null {
  if (patch.title !== undefined) {
    const title = patch.title.trim();
    if (title.length === 0 || title.length > MAX_TITLE_LEN) {
      return { kind: 'invalid_title', message: `title must be 1-${MAX_TITLE_LEN} characters` };
    }
  }
  if (patch.date !== undefined && Number.isNaN(Date.parse(patch.date))) {
    return { kind: 'invalid_date', message: 'date must be ISO-8601' };
  }
  if (typeof finalBody !== 'string' || finalBody.length === 0) {
    return { kind: 'invalid_body', message: 'body must be a non-empty string' };
  }
  if (new TextEncoder().encode(finalBody).byteLength > MAX_BODY_BYTES) {
    return { kind: 'invalid_body', message: `body must be ≤${MAX_BODY_BYTES} bytes` };
  }
  return null;
}

export async function updatePost(
  r2: R2BindingLike,
  kv: KvBindingLike,
  slug: string,
  expectedEtag: string,
  patch: UpdatePostInput
): Promise<CreatePostResult> {
  if (!SLUG_PATTERN.test(slug)) throw new UpdatePostError({ kind: 'not_found' });
  const key = `${POSTS_PREFIX}${slug}.md`;
  const existing = await r2.get(key);
  if (!existing) throw new UpdatePostError({ kind: 'not_found' });
  if (existing.etag !== expectedEtag) {
    throw new UpdatePostError({ kind: 'etag_mismatch', current: existing.etag });
  }

  const { data, body: prevBody } = splitFrontmatter(await existing.text());
  const nextBody = patch.body ?? prevBody;

  const failure = validateUpdateInput(patch, nextBody);
  if (failure) throw new UpdatePostError(failure);

  const markdown = serializePost(applyUpdate(data, patch), nextBody);
  const written = await r2.put(key, markdown, {
    httpMetadata: { contentType: 'text/markdown; charset=utf-8' },
    onlyIf: { etagMatches: expectedEtag }
  });
  if (!written) {
    // R2 rejected the conditional write — re-read for the current etag.
    const probe = await r2.head(key);
    throw new UpdatePostError({ kind: 'etag_mismatch', current: probe?.etag ?? expectedEtag });
  }

  await kv.delete(CMS_INDEX_KEY);
  return { slug, etag: written.etag, updatedAt: new Date(written.uploaded).toISOString() };
}

export type DeletePostFailure = { kind: 'not_found' } | { kind: 'etag_mismatch'; current: string };

export class DeletePostError extends Error {
  constructor(public failure: DeletePostFailure) {
    super(failure.kind);
    this.name = 'DeletePostError';
  }
}

export async function deletePost(
  r2: R2BindingLike,
  kv: KvBindingLike,
  slug: string,
  expectedEtag: string | null
): Promise<{ slug: string }> {
  if (!SLUG_PATTERN.test(slug)) throw new DeletePostError({ kind: 'not_found' });
  const key = `${POSTS_PREFIX}${slug}.md`;
  const head = await r2.head(key);
  if (!head) throw new DeletePostError({ kind: 'not_found' });
  if (expectedEtag !== null && head.etag !== expectedEtag) {
    throw new DeletePostError({ kind: 'etag_mismatch', current: head.etag });
  }
  await r2.delete(key);
  await kv.delete(CMS_INDEX_KEY);
  return { slug };
}

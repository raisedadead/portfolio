import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CMS_INDEX_KEY,
  CMS_INDEX_TTL_SECONDS,
  CreatePostError,
  createPost,
  listPosts,
  POSTS_PREFIX,
  serializePost,
  slugifyTitle,
  splitFrontmatter,
  validateCreateInput,
  type KvBindingLike,
  type PostFrontmatter,
  type R2BindingLike,
  type R2ObjectBodyLike,
  type R2ObjectMetaLike
} from '@/lib/cms-posts';

// ─── Fakes ───────────────────────────────────────────────────────────────────

interface FakeR2 extends R2BindingLike {
  store: Map<string, { body: string; meta: R2ObjectMetaLike }>;
  putCalls: number;
  deleteCalls: number;
}

function fakeR2(initial: Array<{ slug: string; markdown: string; uploaded?: Date; etag?: string }> = []): FakeR2 {
  const store = new Map<string, { body: string; meta: R2ObjectMetaLike }>();
  for (const entry of initial) {
    const key = `${POSTS_PREFIX}${entry.slug}.md`;
    const meta: R2ObjectMetaLike = {
      key,
      size: entry.markdown.length,
      uploaded: entry.uploaded ?? new Date('2026-05-01T00:00:00Z'),
      etag: entry.etag ?? `etag-${entry.slug}`,
      httpEtag: `"${entry.etag ?? `etag-${entry.slug}`}"`
    };
    store.set(key, { body: entry.markdown, meta });
  }
  const r2: FakeR2 = {
    store,
    putCalls: 0,
    deleteCalls: 0,
    async list({ prefix = '' }) {
      const objects: R2ObjectMetaLike[] = [];
      for (const [k, v] of store) if (k.startsWith(prefix)) objects.push(v.meta);
      return { objects, truncated: false };
    },
    async head(key) {
      return store.get(key)?.meta ?? null;
    },
    async get(key) {
      const entry = store.get(key);
      if (!entry) return null;
      const out: R2ObjectBodyLike = {
        ...entry.meta,
        async text() {
          return entry.body;
        }
      };
      return out;
    },
    async put(key, body) {
      r2.putCalls += 1;
      const text = typeof body === 'string' ? body : '';
      const meta: R2ObjectMetaLike = {
        key,
        size: text.length,
        uploaded: new Date('2026-05-09T12:00:00Z'),
        etag: `etag-${key}-v${r2.putCalls}`,
        httpEtag: `"etag-${key}-v${r2.putCalls}"`
      };
      store.set(key, { body: text, meta });
      return meta;
    },
    async delete(key) {
      r2.deleteCalls += 1;
      store.delete(key);
    }
  };
  return r2;
}

interface FakeKv extends KvBindingLike {
  store: Map<string, string>;
  putCalls: number;
  deleteCalls: number;
  lastTtl?: number;
}

function fakeKv(): FakeKv {
  const store = new Map<string, string>();
  const kv: FakeKv = {
    store,
    putCalls: 0,
    deleteCalls: 0,
    async get<T>(key: string, _options: { type: 'json' }): Promise<T | null> {
      const raw = store.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    },
    async put(key, value, options) {
      kv.putCalls += 1;
      kv.lastTtl = options?.expirationTtl;
      store.set(key, value);
    },
    async delete(key) {
      kv.deleteCalls += 1;
      store.delete(key);
    }
  };
  return kv;
}

const FROZEN_NOW = Date.parse('2026-05-09T12:00:00Z');

beforeEach(() => {
  vi.setSystemTime(new Date(FROZEN_NOW));
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── slugifyTitle ────────────────────────────────────────────────────────────

describe('slugifyTitle', () => {
  it('lowercases and replaces whitespace + symbols with single hyphens', () => {
    expect(slugifyTitle('Hello, World!')).toBe('hello-world');
    expect(slugifyTitle('  multiple   spaces  ')).toBe('multiple-spaces');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugifyTitle('!!!Edge!!!')).toBe('edge');
  });

  it('returns empty string when no alphanumerics survive', () => {
    expect(slugifyTitle('!!!')).toBe('');
  });
});

// ─── splitFrontmatter / serializePost round-trip ─────────────────────────────

describe('serializePost / splitFrontmatter', () => {
  it('round-trips frontmatter and body', () => {
    const fm: PostFrontmatter = { title: 'A', date: '2026-01-01', draft: true, brief: 'short' };
    const md = serializePost(fm, '# Hello\n\nWorld');
    const { data, body } = splitFrontmatter(md);
    expect(data.title).toBe('A');
    expect(data.draft).toBe(true);
    expect(data.brief).toBe('short');
    expect(body.trim()).toBe('# Hello\n\nWorld');
  });

  it('drops undefined fields from the YAML block', () => {
    const md = serializePost({ title: 'A', date: '2026-01-01', draft: false, cover: undefined }, 'body');
    expect(md).not.toMatch(/cover/);
  });
});

// ─── validateCreateInput ─────────────────────────────────────────────────────

describe('validateCreateInput', () => {
  it('accepts a minimal valid payload (slug derived)', () => {
    expect(validateCreateInput({ title: 'Hello World', body: 'hi' })).toBeNull();
  });

  it('rejects an empty title', () => {
    expect(validateCreateInput({ title: '', body: 'hi' })).toMatchObject({ kind: 'invalid_title' });
  });

  it('rejects a title that exceeds the maximum length', () => {
    expect(validateCreateInput({ title: 'x'.repeat(201), body: 'hi' })).toMatchObject({ kind: 'invalid_title' });
  });

  it('rejects a slug that does not match the pattern', () => {
    expect(validateCreateInput({ title: 'A', slug: 'BadSlug', body: 'hi' })).toMatchObject({ kind: 'invalid_slug' });
    expect(validateCreateInput({ title: 'A', slug: '-leading', body: 'hi' })).toMatchObject({ kind: 'invalid_slug' });
    expect(validateCreateInput({ title: 'A', slug: 'trailing-', body: 'hi' })).toMatchObject({ kind: 'invalid_slug' });
  });

  it('rejects a derived slug that becomes empty after slugify', () => {
    // slugifyTitle('!!!') → '', which fails the pattern
    expect(validateCreateInput({ title: '!!!', body: 'hi' })).toMatchObject({ kind: 'invalid_slug' });
  });

  it('rejects an empty body', () => {
    expect(validateCreateInput({ title: 'A', body: '' })).toMatchObject({ kind: 'invalid_body' });
  });

  it('rejects a body larger than 100 KiB', () => {
    expect(validateCreateInput({ title: 'A', body: 'x'.repeat(100 * 1024 + 1) })).toMatchObject({
      kind: 'invalid_body'
    });
  });

  it('rejects an unparseable date', () => {
    expect(validateCreateInput({ title: 'A', body: 'hi', date: 'not-a-date' })).toMatchObject({ kind: 'invalid_date' });
  });
});

// ─── listPosts — KV cache hit ────────────────────────────────────────────────

describe('listPosts', () => {
  it('returns the cached index without reading R2 when KV has a fresh entry', async () => {
    const r2 = fakeR2([{ slug: 'should-not-read', markdown: '---\ntitle: x\n---\nbody' }]);
    const listSpy = vi.spyOn(r2, 'list');
    const kv = fakeKv();
    kv.store.set(
      CMS_INDEX_KEY,
      JSON.stringify({
        posts: [
          {
            slug: 'cached',
            title: 'Cached',
            date: '2026-05-01',
            draft: false,
            updatedAt: '2026-05-01T00:00:00Z',
            etag: 'etag-cached'
          }
        ],
        generatedAt: '2026-05-01T00:00:00Z'
      })
    );
    const result = await listPosts(r2, kv);
    expect(result.cached).toBe(true);
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0]?.slug).toBe('cached');
    expect(listSpy).not.toHaveBeenCalled();
  });

  it('rebuilds the index from R2 on cache miss and writes it back to KV with TTL', async () => {
    const post1 = `---\ntitle: First\ndate: 2026-05-01\ndraft: false\n---\n\nbody one`;
    const post2 = `---\ntitle: Second\ndate: 2026-05-02\ndraft: true\nbrief: tease\n---\n\nbody two`;
    const r2 = fakeR2([
      { slug: 'first', markdown: post1, uploaded: new Date('2026-05-01T00:00:00Z') },
      { slug: 'second', markdown: post2, uploaded: new Date('2026-05-02T00:00:00Z') }
    ]);
    const kv = fakeKv();
    const result = await listPosts(r2, kv);
    expect(result.cached).toBe(false);
    expect(result.posts.map((p) => p.slug)).toEqual(['second', 'first']);
    expect(result.posts[0]).toMatchObject({ slug: 'second', draft: true, brief: 'tease' });
    expect(kv.putCalls).toBe(1);
    expect(kv.lastTtl).toBe(CMS_INDEX_TTL_SECONDS);
    const stored = JSON.parse(kv.store.get(CMS_INDEX_KEY) ?? '{}');
    expect(stored.posts).toHaveLength(2);
  });

  it('forces a refresh when forceRefresh=true even if KV has data', async () => {
    const r2 = fakeR2([{ slug: 'fresh', markdown: '---\ntitle: Fresh\ndate: 2026-05-09\n---\nfresh body' }]);
    const kv = fakeKv();
    kv.store.set(
      CMS_INDEX_KEY,
      JSON.stringify({
        posts: [
          {
            slug: 'stale',
            title: 'Stale',
            date: '2024-01-01',
            draft: false,
            updatedAt: '2024-01-01',
            etag: 'old'
          }
        ],
        generatedAt: '2024-01-01T00:00:00Z'
      })
    );
    const result = await listPosts(r2, kv, { forceRefresh: true });
    expect(result.cached).toBe(false);
    expect(result.posts.map((p) => p.slug)).toEqual(['fresh']);
  });

  it('skips R2 entries that are not .md', async () => {
    const r2 = fakeR2();
    r2.store.set(`${POSTS_PREFIX}image.png`, {
      body: '',
      meta: {
        key: `${POSTS_PREFIX}image.png`,
        size: 0,
        uploaded: new Date(),
        etag: 'etag-png',
        httpEtag: '"etag-png"'
      }
    });
    r2.store.set(`${POSTS_PREFIX}note.md`, {
      body: '---\ntitle: Note\ndate: 2026-05-01\n---\nbody',
      meta: {
        key: `${POSTS_PREFIX}note.md`,
        size: 0,
        uploaded: new Date('2026-05-01'),
        etag: 'etag-note',
        httpEtag: '"etag-note"'
      }
    });
    const kv = fakeKv();
    const result = await listPosts(r2, kv);
    expect(result.posts.map((p) => p.slug)).toEqual(['note']);
  });
});

// ─── createPost ──────────────────────────────────────────────────────────────

describe('createPost', () => {
  it('writes a draft markdown blob to R2 with derived slug + frontmatter', async () => {
    const r2 = fakeR2();
    const kv = fakeKv();
    const result = await createPost(r2, kv, { title: 'Hello World', body: 'hi from CMS' });
    expect(result.slug).toBe('hello-world');
    const written = r2.store.get(`${POSTS_PREFIX}hello-world.md`);
    expect(written).toBeDefined();
    expect(written?.body).toMatch(/title: Hello World/);
    expect(written?.body).toMatch(/draft: true/);
    expect(written?.body).toMatch(/hi from CMS/);
  });

  it('honours the explicit slug when supplied', async () => {
    const r2 = fakeR2();
    const kv = fakeKv();
    const result = await createPost(r2, kv, {
      title: 'Some Title',
      slug: 'manual-slug',
      body: 'body'
    });
    expect(result.slug).toBe('manual-slug');
    expect(r2.store.has(`${POSTS_PREFIX}manual-slug.md`)).toBe(true);
  });

  it('refuses to overwrite an existing slug (slug_conflict)', async () => {
    const r2 = fakeR2([{ slug: 'exists', markdown: 'whatever' }]);
    const kv = fakeKv();
    await expect(createPost(r2, kv, { title: 'Exists', body: 'body' })).rejects.toMatchObject({
      name: 'CreatePostError',
      failure: { kind: 'slug_conflict', slug: 'exists' }
    });
    expect(r2.putCalls).toBe(0);
  });

  it('throws CreatePostError on invalid title without touching R2', async () => {
    const r2 = fakeR2();
    const kv = fakeKv();
    await expect(createPost(r2, kv, { title: '', body: 'body' })).rejects.toBeInstanceOf(CreatePostError);
    expect(r2.putCalls).toBe(0);
  });

  it('uses a frozen now() for the default date when none is supplied', async () => {
    const r2 = fakeR2();
    const kv = fakeKv();
    const fixed = Date.parse('2026-04-01T08:00:00Z');
    await createPost(r2, kv, { title: 'Dated', body: 'body' }, { now: () => fixed });
    const written = r2.store.get(`${POSTS_PREFIX}dated.md`);
    expect(written?.body).toMatch(/date: 2026-04-01T08:00:00.000Z/);
  });

  it('invalidates the KV index on successful write', async () => {
    const r2 = fakeR2();
    const kv = fakeKv();
    kv.store.set(CMS_INDEX_KEY, '{"posts":[],"generatedAt":""}');
    await createPost(r2, kv, { title: 'X', body: 'body' });
    expect(kv.deleteCalls).toBe(1);
    expect(kv.store.has(CMS_INDEX_KEY)).toBe(false);
  });

  it('honours an explicit draft=false flag', async () => {
    const r2 = fakeR2();
    const kv = fakeKv();
    await createPost(r2, kv, { title: 'X', body: 'body', draft: false });
    const written = r2.store.get(`${POSTS_PREFIX}x.md`);
    expect(written?.body).toMatch(/draft: false/);
  });
});

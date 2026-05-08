import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AwsClient } from 'aws4fetch';
import {
  createAwsR2Client,
  parseS3Keys,
  r2MarkdownLoader,
  rewriteAssetUrl,
  splitFrontmatter,
  type R2ListGetClient
} from '@/lib/r2-loader';

interface StoredEntry {
  id: string;
  data: Record<string, unknown>;
  body?: string;
  digest?: string;
}

interface FakeStore {
  entries: StoredEntry[];
  cleared: number;
  clear(): void;
  set(entry: StoredEntry): void;
}

interface FakeLogger {
  warnings: string[];
  warn(msg: string): void;
  info(): void;
  error(): void;
  debug(): void;
  options?: unknown;
  fork(): FakeLogger;
}

function fakeStore(): FakeStore {
  const entries: StoredEntry[] = [];
  let cleared = 0;
  return {
    entries,
    get cleared() {
      return cleared;
    },
    clear() {
      cleared += 1;
      entries.length = 0;
    },
    set(entry) {
      entries.push(entry);
    }
  } as FakeStore;
}

function fakeLogger(): FakeLogger {
  const warnings: string[] = [];
  const logger: FakeLogger = {
    warnings,
    warn: (msg) => {
      warnings.push(msg);
    },
    info: () => undefined,
    error: () => undefined,
    debug: () => undefined,
    fork: () => logger
  };
  return logger;
}

function fakeContext(client: R2ListGetClient) {
  const store = fakeStore();
  const logger = fakeLogger();
  const parseData = vi.fn(async ({ data }: { id: string; data: Record<string, unknown> }) => data);
  const generateDigest = vi.fn((value: Record<string, unknown> | string) =>
    typeof value === 'string' ? `digest:${value.length}` : `digest:obj`
  );

  // Astro's full LoaderContext has more fields. The loader only touches these
  // four — cast so we can exercise the public contract without recreating a
  // full Astro runtime. Tests assert on the recorded store/logger state.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = { store, logger, parseData, generateDigest } as any;

  return { client, ctx, store, logger, parseData, generateDigest };
}

const POST_MD = `---
title: Hello
date: 2026-01-01
tags:
  - intro
---

Body line 1.

Body line 2.
`;

describe('splitFrontmatter', () => {
  it('parses YAML frontmatter and returns body', () => {
    const { data, body } = splitFrontmatter(POST_MD);
    expect(data).toMatchObject({ title: 'Hello', tags: ['intro'] });
    expect(body.trim().startsWith('Body line 1.')).toBe(true);
  });

  it('returns empty data when no frontmatter fence is present', () => {
    const { data, body } = splitFrontmatter('# just a heading\nno frontmatter here\n');
    expect(data).toEqual({});
    expect(body).toContain('# just a heading');
  });

  it('treats a frontmatter block with no body as an empty body', () => {
    const { data, body } = splitFrontmatter('---\ntitle: t\n---\n');
    expect(data).toEqual({ title: 't' });
    expect(body).toBe('');
  });
});

describe('rewriteAssetUrl', () => {
  it('maps a relative ../assets/images path to /api/img/<slug>/<file>', () => {
    expect(rewriteAssetUrl('../assets/images/foo/cover.png')).toBe('/api/img/foo/cover.png');
  });

  it('maps an unprefixed assets/images path identically', () => {
    expect(rewriteAssetUrl('assets/images/foo/bar.svg')).toBe('/api/img/foo/bar.svg');
  });

  it('preserves nested file paths under the slug folder', () => {
    expect(rewriteAssetUrl('../assets/images/foo/sub/dir/cover.png')).toBe('/api/img/foo/sub/dir/cover.png');
  });

  it('rewrites every match inside a multi-line markdown body', () => {
    const body = ['![alt](../assets/images/post-a/img1.png)', 'inline ../assets/images/post-b/img2.webp here'].join(
      '\n'
    );
    const out = rewriteAssetUrl(body) ?? '';
    expect(out).toContain('/api/img/post-a/img1.png');
    expect(out).toContain('/api/img/post-b/img2.webp');
  });

  it('returns the input unchanged when no asset prefix is found', () => {
    expect(rewriteAssetUrl('https://example.com/x.png')).toBe('https://example.com/x.png');
    expect(rewriteAssetUrl('/api/img/foo/cover.png')).toBe('/api/img/foo/cover.png');
  });

  it('returns undefined for undefined input', () => {
    expect(rewriteAssetUrl(undefined)).toBeUndefined();
  });
});

describe('parseS3Keys', () => {
  it('extracts keys from a ListObjectsV2 response', () => {
    const xml = `<?xml version="1.0"?>
<ListBucketResult>
  <Contents><Key>posts/a.md</Key></Contents>
  <Contents><Key>posts/b.md</Key></Contents>
  <Contents><Key>posts/c.txt</Key></Contents>
</ListBucketResult>`;
    expect(parseS3Keys(xml)).toEqual(['posts/a.md', 'posts/b.md', 'posts/c.txt']);
  });

  it('decodes XML entities in keys', () => {
    expect(parseS3Keys('<Key>a&amp;b.md</Key>')).toEqual(['a&b.md']);
  });

  it('returns an empty array for empty input', () => {
    expect(parseS3Keys('<ListBucketResult/>')).toEqual([]);
  });
});

describe('r2MarkdownLoader', () => {
  it('loads markdown entries from R2 into the store', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => ['posts/a.md', 'posts/b.md', 'posts/skip.txt']),
      get: vi.fn(async (key) => (key === 'posts/a.md' ? POST_MD : '---\ntitle: B\ndate: 2026-02-02\n---\nBody B\n'))
    };
    const { ctx, store, logger } = fakeContext(client);

    const loader = r2MarkdownLoader({ client, prefix: 'posts/' });
    await loader.load(ctx);

    expect(store.entries.map((e) => e.id)).toEqual(['a', 'b']);
    expect(store.entries[0].data).toMatchObject({ title: 'Hello' });
    expect(store.entries[0].body?.trim().startsWith('Body line 1.')).toBe(true);
    expect(store.entries[0].digest).toBe(`digest:${POST_MD.length}`);
    expect(logger.warnings).toEqual([]);
    expect(client.list).toHaveBeenCalledWith('posts/');
    // skip.txt was filtered before any get() was issued
    expect(client.get).toHaveBeenCalledTimes(2);
  });

  it('warns and bails out cleanly when list fails', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => {
        throw new Error('boom');
      }),
      get: vi.fn()
    };
    const { ctx, store, logger } = fakeContext(client);

    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);

    expect(store.entries).toHaveLength(0);
    expect(store.cleared).toBe(0); // store NOT cleared when list fails — preserves last good build
    expect(logger.warnings[0]).toMatch(/R2 list failed for prefix "posts\/": boom/);
    expect(client.get).not.toHaveBeenCalled();
  });

  it('skips an individual key whose get fails and keeps loading the rest', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => ['posts/ok.md', 'posts/bad.md']),
      get: vi.fn(async (key) => {
        if (key === 'posts/bad.md') throw new Error('object missing');
        return POST_MD;
      })
    };
    const { ctx, store, logger } = fakeContext(client);

    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);

    expect(store.entries.map((e) => e.id)).toEqual(['ok']);
    expect(logger.warnings[0]).toMatch(/R2 get failed for posts\/bad\.md/);
  });

  it('skips a key whose body is null', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => ['posts/a.md']),
      get: vi.fn(async () => null)
    };
    const { ctx, store, logger } = fakeContext(client);

    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);

    expect(store.entries).toHaveLength(0);
    expect(logger.warnings[0]).toMatch(/R2 get returned null for posts\/a\.md/);
  });

  it('skips a key whose schema validation throws', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => ['posts/a.md', 'posts/b.md']),
      get: vi.fn(async () => POST_MD)
    };
    const { ctx, store, logger, parseData } = fakeContext(client);
    parseData.mockImplementationOnce(async () => {
      throw new Error('schema mismatch');
    });

    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);

    expect(store.entries.map((e) => e.id)).toEqual(['b']);
    expect(logger.warnings[0]).toMatch(/parseData failed/);
  });

  it('clears the store before each successful load', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => ['posts/a.md']),
      get: vi.fn(async () => POST_MD)
    };
    const { ctx, store } = fakeContext(client);

    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);
    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);

    expect(store.cleared).toBe(2);
    expect(store.entries).toHaveLength(1);
  });
});

describe('createAwsR2Client', () => {
  const ENDPOINT = 'https://acct.r2.cloudflarestorage.com';
  const BUCKET = 'articles-content-stg';
  const CREDS = { accessKeyId: 'akid', secretAccessKey: 'sak' };

  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockAwsResponse(init: { ok: boolean; status?: number; text: string }) {
    const status = init.status ?? (init.ok ? 200 : 500);
    return new Response(init.text, { status });
  }

  it('list() builds the ListObjectsV2 URL and parses the XML', async () => {
    const xml = '<?xml version="1.0"?><ListBucketResult><Contents><Key>posts/a.md</Key></Contents></ListBucketResult>';
    const fetchSpy = vi
      .spyOn(AwsClient.prototype, 'fetch')
      .mockResolvedValueOnce(mockAwsResponse({ ok: true, text: xml }));

    const client = createAwsR2Client({ endpoint: ENDPOINT, bucket: BUCKET, ...CREDS });
    const keys = await client.list('posts/');

    expect(keys).toEqual(['posts/a.md']);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toBe(`${ENDPOINT}/${BUCKET}?list-type=2&prefix=posts%2F`);
  });

  it('list() throws when R2 returns a non-2xx response', async () => {
    vi.spyOn(AwsClient.prototype, 'fetch').mockResolvedValueOnce(mockAwsResponse({ ok: false, status: 503, text: '' }));
    const client = createAwsR2Client({ endpoint: ENDPOINT, bucket: BUCKET, ...CREDS });
    await expect(client.list('posts/')).rejects.toThrow(/HTTP 503/);
  });

  it('get() returns the body text on 200', async () => {
    const fetchSpy = vi
      .spyOn(AwsClient.prototype, 'fetch')
      .mockResolvedValueOnce(mockAwsResponse({ ok: true, text: '# hello' }));
    const client = createAwsR2Client({ endpoint: ENDPOINT, bucket: BUCKET, ...CREDS });

    const body = await client.get('posts/a.md');

    expect(body).toBe('# hello');
    expect(fetchSpy.mock.calls[0][0]).toBe(`${ENDPOINT}/${BUCKET}/posts/a.md`);
  });

  it('get() returns null on 404', async () => {
    vi.spyOn(AwsClient.prototype, 'fetch').mockResolvedValueOnce(
      mockAwsResponse({ ok: false, status: 404, text: 'not found' })
    );
    const client = createAwsR2Client({ endpoint: ENDPOINT, bucket: BUCKET, ...CREDS });
    expect(await client.get('posts/missing.md')).toBeNull();
  });

  it('get() throws on other non-2xx', async () => {
    vi.spyOn(AwsClient.prototype, 'fetch').mockResolvedValueOnce(mockAwsResponse({ ok: false, status: 500, text: '' }));
    const client = createAwsR2Client({ endpoint: ENDPOINT, bucket: BUCKET, ...CREDS });
    await expect(client.get('posts/a.md')).rejects.toThrow(/HTTP 500/);
  });

  it('strips a trailing slash from the endpoint when building URLs', async () => {
    const fetchSpy = vi
      .spyOn(AwsClient.prototype, 'fetch')
      .mockResolvedValueOnce(mockAwsResponse({ ok: true, text: '<ListBucketResult/>' }));
    const client = createAwsR2Client({
      endpoint: `${ENDPOINT}/`,
      bucket: BUCKET,
      ...CREDS
    });
    await client.list('posts/');
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl.startsWith(`${ENDPOINT}/${BUCKET}?`)).toBe(true);
  });
});

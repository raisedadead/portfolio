/**
 * Phase 1 invariant V6: `pnpm build` must exit 0 with no R2 access keys
 * present. The build's blog-content branch is decided by
 * `buildBlogLoader`, so the cheapest, deterministic gate is to exercise
 * the factory under the "no keys" scenarios it must survive.
 *
 * Three failure modes guarded:
 *   1. Empty env (current default): factory must silently return glob.
 *   2. PUBLIC_USE_R2_LOADER=1 with NO R2 creds: factory must warn and
 *      fall back to glob — never throw.
 *   3. PUBLIC_USE_R2_LOADER=1 with PARTIAL R2 creds: factory must warn,
 *      list every missing key, fall back to glob.
 *
 * Plus a complementary R2-loader test: when R2 returns an empty key
 * list (a freshly-provisioned bucket), the loader clears the store and
 * exits without warnings — the build still emits a valid (empty) blog.
 */
import { describe, expect, it, vi } from 'vitest';
import { buildBlogLoader } from '@/lib/blog-loader-factory';
import { r2MarkdownLoader, type R2ListGetClient } from '@/lib/r2-loader';

interface StoredEntry {
  id: string;
  data: Record<string, unknown>;
  body?: string;
  digest?: string;
}

function makeContext() {
  const entries: StoredEntry[] = [];
  const warnings: string[] = [];
  const store = {
    clear: () => {
      entries.length = 0;
    },
    set: (entry: StoredEntry) => {
      entries.push(entry);
    }
  };
  const logger = {
    warn: (msg: string) => warnings.push(msg),
    info: () => undefined,
    error: () => undefined,
    debug: () => undefined,
    fork: () => logger
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = {
    store,
    logger,
    parseData: vi.fn(async ({ data }: { id: string; data: Record<string, unknown> }) => data),
    generateDigest: vi.fn(() => 'digest:test')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  return { ctx, entries, warnings };
}

describe('V6 — build graceful-degrade with no R2 keys', () => {
  it('factory with empty env (R2 default) warns, lists every missing key, falls back to glob', () => {
    const warn = vi.fn();
    const loader = buildBlogLoader({ env: {}, warn });
    expect(loader.name).toBe('glob-loader');
    expect(warn).toHaveBeenCalledTimes(1);
    const message = warn.mock.calls[0][0] as string;
    for (const key of ['R2_ENDPOINT', 'R2_BUCKET_NAME', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']) {
      expect(message, `warning should mention ${key}`).toContain(key);
    }
  });

  it('factory with partial creds names only the missing one', () => {
    const warn = vi.fn();
    buildBlogLoader({
      env: {
        R2_ENDPOINT: 'https://acct.r2.cloudflarestorage.com',
        R2_BUCKET_NAME: 'articles-content-stg',
        R2_ACCESS_KEY_ID: 'akid'
        // R2_SECRET_ACCESS_KEY intentionally absent
      },
      warn
    });
    const message = warn.mock.calls[0][0] as string;
    expect(message).toContain('R2_SECRET_ACCESS_KEY');
    expect(message).not.toContain('R2_ENDPOINT,');
  });

  it('explicit opt-out (PUBLIC_USE_R2_LOADER=0) returns glob without warning', () => {
    const warn = vi.fn();
    const loader = buildBlogLoader({ env: { PUBLIC_USE_R2_LOADER: '0' }, warn });
    expect(loader.name).toBe('glob-loader');
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('V6 — R2 loader with empty bucket', () => {
  it('clears the store and adds no entries when the bucket has no posts', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => []),
      get: vi.fn()
    };
    const { ctx, entries, warnings } = makeContext();

    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);

    expect(entries).toHaveLength(0);
    expect(warnings).toEqual([]);
    expect(client.get).not.toHaveBeenCalled();
  });

  it('discards prior entries on each load (idempotent build)', async () => {
    const client: R2ListGetClient = {
      list: vi.fn(async () => []),
      get: vi.fn()
    };
    const { ctx, entries } = makeContext();
    entries.push({ id: 'stale', data: { title: 'stale' } });

    await r2MarkdownLoader({ client, prefix: 'posts/' }).load(ctx);

    expect(entries).toHaveLength(0);
  });
});

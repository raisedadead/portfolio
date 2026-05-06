/**
 * Tests for `scripts/migrate-articles-to-r2.mjs`. The script exports its
 * library surface so the migration can be exercised end-to-end with a fake
 * R2 adapter and a small fixture source tree (no real network, no real R2).
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { md5, pickContentType, planMigration, runMigration } from '../../../scripts/migrate-articles-to-r2.mjs';

const fixtureSource = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/migration-source');

interface Asset {
  key: string;
  absPath: string;
  contentType: string;
}

interface HeadResult {
  etag: string | null;
  status: number;
}

interface PutResult {
  ok: boolean;
  status: number;
}

interface FakeAdapter {
  head: ReturnType<typeof vi.fn<(key: string) => Promise<HeadResult>>>;
  put: ReturnType<typeof vi.fn<(key: string, body: Buffer | Uint8Array, contentType: string) => Promise<PutResult>>>;
}

function fakeAdapter(overrides: Partial<FakeAdapter> = {}): FakeAdapter {
  return {
    head: vi.fn(async (): Promise<HeadResult> => ({ etag: null, status: 404 })),
    put: vi.fn(async (): Promise<PutResult> => ({ ok: true, status: 200 })),
    ...overrides
  };
}

describe('md5', () => {
  it('returns the lowercase hex digest of the buffer', () => {
    expect(md5(Buffer.from('hello'))).toBe('5d41402abc4b2a76b9719d911017c592');
  });
});

describe('pickContentType', () => {
  it.each([
    ['/x/post.md', 'text/markdown; charset=utf-8'],
    ['/x/cover.png', 'image/png'],
    ['/x/cover.jpg', 'image/jpeg'],
    ['/x/cover.JPEG', 'image/jpeg'],
    ['/x/cover.webp', 'image/webp'],
    ['/x/cover.gif', 'image/gif'],
    ['/x/cover.svg', 'image/svg+xml'],
    ['/x/cover.avif', 'image/avif'],
    ['/x/blob.unknown', 'application/octet-stream']
  ])('maps %s -> %s', (filePath, expected) => {
    expect(pickContentType(filePath)).toBe(expected);
  });
});

describe('planMigration', () => {
  it('enumerates posts/, drafts/, and assets/images/ as R2 keys', async () => {
    const assets: Asset[] = await planMigration({ source: fixtureSource });
    const keys = assets.map((a) => a.key);
    expect(keys).toEqual(['assets/images/alpha/cover.svg', 'drafts/draft-one.md', 'posts/alpha.md', 'posts/bravo.md']);
  });

  it('attaches the correct content-type per file', async () => {
    const assets: Asset[] = await planMigration({ source: fixtureSource });
    const md = assets.find((a) => a.key === 'posts/alpha.md');
    const svg = assets.find((a) => a.key === 'assets/images/alpha/cover.svg');
    expect(md?.contentType).toBe('text/markdown; charset=utf-8');
    expect(svg?.contentType).toBe('image/svg+xml');
  });

  it('skips when a top-level dir is missing', async () => {
    const tmpRoot = path.resolve(fixtureSource, '../migration-source-empty-not-real');
    // No directory at this path → planner returns []
    expect(await planMigration({ source: tmpRoot })).toEqual([]);
  });
});

describe('runMigration — dry-run', () => {
  it('counts every asset as "would copy" and never PUTs', async () => {
    const assets: Asset[] = await planMigration({ source: fixtureSource });
    const adapter = fakeAdapter();
    const summary = await runMigration({ assets, adapter, commit: false });
    expect(summary).toEqual({
      copied: assets.length,
      skipped: 0,
      failed: 0,
      failures: []
    });
    expect(adapter.put).not.toHaveBeenCalled();
    expect(adapter.head).toHaveBeenCalledTimes(assets.length);
  });
});

describe('runMigration — etag idempotency', () => {
  it('skips assets whose remote ETag equals the local md5', async () => {
    const assets: Asset[] = await planMigration({ source: fixtureSource });
    const fs = await import('node:fs/promises');
    const knownHashes = new Map<string, string>();
    for (const asset of assets) {
      const body = await fs.readFile(asset.absPath);
      knownHashes.set(asset.key, md5(body));
    }

    const adapter = fakeAdapter({
      head: vi.fn(
        async (key: string): Promise<HeadResult> => ({
          etag: `"${knownHashes.get(key)}"`,
          status: 200
        })
      )
    });

    const summary = await runMigration({ assets, adapter, commit: true });
    expect(summary.skipped).toBe(assets.length);
    expect(summary.copied).toBe(0);
    expect(adapter.put).not.toHaveBeenCalled();
  });
});

describe('runMigration — commit', () => {
  it('PUTs each missing asset and counts copied', async () => {
    const assets: Asset[] = await planMigration({ source: fixtureSource });
    const adapter = fakeAdapter();
    const summary = await runMigration({ assets, adapter, commit: true });

    expect(summary.copied).toBe(assets.length);
    expect(summary.failed).toBe(0);
    expect(adapter.put).toHaveBeenCalledTimes(assets.length);
    // first PUT should send a non-empty body and the planned content-type
    const [, body, contentType] = adapter.put.mock.calls[0];
    expect((body as Buffer).length).toBeGreaterThan(0);
    expect(contentType).toMatch(/^(text\/markdown|image\/)/);
  });

  it('records a failure (does not throw) when PUT returns non-2xx', async () => {
    const assets: Asset[] = await planMigration({ source: fixtureSource });
    const adapter = fakeAdapter({
      put: vi.fn(async (): Promise<PutResult> => ({ ok: false, status: 503 }))
    });
    const summary = await runMigration({ assets, adapter, commit: true });
    expect(summary.failed).toBe(assets.length);
    expect(summary.copied).toBe(0);
    expect(summary.failures[0]).toMatch(/HTTP 503/);
  });

  it('records a failure when HEAD throws and continues with the remaining assets', async () => {
    const assets: Asset[] = await planMigration({ source: fixtureSource });
    let calls = 0;
    const adapter = fakeAdapter({
      head: vi.fn(async (): Promise<HeadResult> => {
        calls += 1;
        if (calls === 1) throw new Error('network down');
        return { etag: null, status: 404 };
      })
    });
    const summary = await runMigration({ assets, adapter, commit: true });
    expect(summary.failed).toBe(1);
    expect(summary.copied).toBe(assets.length - 1);
    expect(summary.failures[0]).toMatch(/head .* network down/);
  });
});

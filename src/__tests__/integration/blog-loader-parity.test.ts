/**
 * Golden parity test for the R2 loader.
 *
 * The contract: given a set of markdown files, the R2 loader must produce
 * an `id`, `data`, and `body` for each entry that matches a direct
 * filesystem read of the same files (which is what Astro's glob loader
 * does at the file level).
 *
 * We do NOT invoke Astro's `glob` loader directly here because it requires
 * a full Astro content runtime context (`parseData`, `renderMarkdown`,
 * `generateDigest`, etc.) that is not stable to fake. Instead we use the
 * R2 loader's own `splitFrontmatter` helper as the parity reference: the
 * loader must yield the same parsed data + body it would have produced
 * had the file been read directly. This proves the R2 plumbing
 * (list -> get -> store.set) does not drop, rename, or mutate fields.
 *
 * Additional assertions guard the post-id derivation rule, which must
 * stay aligned with the legacy glob loader's `id` shape (slug from
 * filename minus `.md`).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { r2MarkdownLoader, splitFrontmatter, type R2ListGetClient } from '@/lib/r2-loader';

interface StoredEntry {
  id: string;
  data: Record<string, unknown>;
  body?: string;
  digest?: string;
}

const fixturesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/posts');
const POSTS_PREFIX = 'posts/';

function readFixturesFromDisk(): Map<string, string> {
  const map = new Map<string, string>();
  for (const file of readdirSync(fixturesDir).filter((name) => name.endsWith('.md'))) {
    map.set(`${POSTS_PREFIX}${file}`, readFileSync(path.join(fixturesDir, file), 'utf8'));
  }
  return map;
}

function clientFromFixtures(blobs: Map<string, string>): R2ListGetClient {
  return {
    list: vi.fn(async () => Array.from(blobs.keys())),
    get: vi.fn(async (key) => blobs.get(key) ?? null)
  };
}

function makeContext() {
  const entries: StoredEntry[] = [];
  const warnings: string[] = [];
  const ctx = {
    store: {
      clear: () => {
        entries.length = 0;
      },
      set: (entry: StoredEntry) => {
        entries.push(entry);
      }
    },
    logger: {
      warn: (msg: string) => warnings.push(msg),
      info: () => undefined,
      error: () => undefined,
      debug: () => undefined,
      fork: () => ctx.logger
    },
    parseData: vi.fn(async ({ data }: { id: string; data: Record<string, unknown> }) => data),
    generateDigest: vi.fn((value: Record<string, unknown> | string) =>
      typeof value === 'string' ? `digest:${value.length}` : 'digest:obj'
    ),
    renderMarkdown: vi.fn(async (content: string) => ({ html: `<p>rendered:${content.length}</p>`, metadata: {} }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  return { ctx, entries, warnings };
}

describe('R2 loader parity vs direct fs read', () => {
  it('produces one entry per fixture .md file with id derived from filename', async () => {
    const blobs = readFixturesFromDisk();
    const expectedIds = Array.from(blobs.keys())
      .map((key) => key.slice(POSTS_PREFIX.length).replace(/\.md$/, ''))
      .sort();
    expect(expectedIds.length).toBeGreaterThan(0);

    const client = clientFromFixtures(blobs);
    const { ctx, entries } = makeContext();
    await r2MarkdownLoader({ client, prefix: POSTS_PREFIX }).load(ctx);

    expect(entries.map((e) => e.id).sort()).toEqual(expectedIds);
  });

  it('parsed data and body for each entry match a direct fs+frontmatter read', async () => {
    const blobs = readFixturesFromDisk();
    const client = clientFromFixtures(blobs);
    const { ctx, entries } = makeContext();
    await r2MarkdownLoader({ client, prefix: POSTS_PREFIX }).load(ctx);

    for (const [key, raw] of blobs.entries()) {
      const id = key.slice(POSTS_PREFIX.length).replace(/\.md$/, '');
      const expected = splitFrontmatter(raw);
      const actual = entries.find((e) => e.id === id);
      expect(actual, `entry ${id} missing`).toBeDefined();
      expect(actual?.data).toEqual(expected.data);
      expect(actual?.body).toEqual(expected.body);
    }
  });

  it('emits a content digest derived from the raw markdown blob', async () => {
    const blobs = readFixturesFromDisk();
    const client = clientFromFixtures(blobs);
    const { ctx, entries } = makeContext();
    await r2MarkdownLoader({ client, prefix: POSTS_PREFIX }).load(ctx);

    for (const [key, raw] of blobs.entries()) {
      const id = key.slice(POSTS_PREFIX.length).replace(/\.md$/, '');
      const actual = entries.find((e) => e.id === id);
      expect(actual?.digest).toBe(`digest:${raw.length}`);
    }
  });

  it('preserves explicit slug overrides in frontmatter (does not rewrite id)', async () => {
    // bravo.md has `slug: bravo-renamed` in frontmatter. The loader's `id`
    // is filename-derived (matches glob loader convention). The schema-level
    // `slug` field passes through untouched. Both are observable.
    const blobs = readFixturesFromDisk();
    const client = clientFromFixtures(blobs);
    const { ctx, entries } = makeContext();
    await r2MarkdownLoader({ client, prefix: POSTS_PREFIX }).load(ctx);

    const bravo = entries.find((e) => e.id === 'bravo');
    expect(bravo, 'bravo entry not found').toBeDefined();
    expect(bravo?.data.slug).toBe('bravo-renamed');
  });
});

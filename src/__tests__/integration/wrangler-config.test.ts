import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface R2BucketBinding {
  binding: string;
  bucket_name: string;
  preview_bucket_name?: string;
  remote?: boolean;
}

interface KvBinding {
  binding: string;
  id: string;
}

interface WranglerConfig {
  r2_buckets?: R2BucketBinding[];
  kv_namespaces?: KvBinding[];
  vars?: Record<string, string>;
  assets?: { run_worker_first?: string[] };
  env?: {
    preview?: {
      r2_buckets?: R2BucketBinding[];
      vars?: Record<string, string>;
    };
  };
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

/**
 * Minimal JSONC stripper: removes `//` line comments and `/* ... *\/` block comments.
 * Strips trailing commas before `JSON.parse` (Wrangler's JSONC parser tolerates them).
 */
function parseJsonc(raw: string): WranglerConfig {
  const noLineComments = raw.replace(/^\s*\/\/.*$/gm, '');
  const noBlockComments = noLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
  const noTrailingCommas = noBlockComments.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(noTrailingCommas) as WranglerConfig;
}

const configPath = path.join(repoRoot, 'wrangler.jsonc');
const rawConfig = readFileSync(configPath, 'utf8');
const config = parseJsonc(rawConfig);

describe('wrangler.jsonc — R2 binding (only stateful binding post-CMS removal)', () => {
  it('declares the ARTICLES R2 binding at top level', () => {
    expect(config.r2_buckets).toBeDefined();
    const articles = config.r2_buckets?.find((b) => b.binding === 'ARTICLES');
    expect(articles).toBeDefined();
    expect(articles?.bucket_name).toBe('articles-content');
  });

  it('marks ARTICLES as remote in dev (wrangler dev hits real bucket, not local sim)', () => {
    // Without `remote: true` the R2 binding falls back to an empty local
    // simulator and `/api/img/*` returns 404 for every cover. RCA B10
    // (2026-05-08). The flag is the supported replacement for the
    // deprecated `--remote` CLI flag.
    const articles = config.r2_buckets?.find((b) => b.binding === 'ARTICLES');
    expect(articles?.remote).toBe(true);
  });
});

describe('wrangler.jsonc — CMS surface fully purged', () => {
  it('declares zero KV namespaces (SESSION + CMS_INDEX gone with CMS)', () => {
    expect(config.kv_namespaces ?? []).toEqual([]);
  });

  it('does not declare CF_ACCESS_ALLOWED_HOSTS in vars', () => {
    expect(config.vars?.CF_ACCESS_ALLOWED_HOSTS).toBeUndefined();
  });

  it('contains zero CF_ACCESS_* / DEV_BYPASS_ACCESS / DEPLOY_HOOK_URL refs', () => {
    expect(rawConfig).not.toMatch(/CF_ACCESS|DEV_BYPASS_ACCESS|DEPLOY_HOOK_URL/);
  });

  it('drops the /admin/* glob from run_worker_first (admin surface deleted)', () => {
    const globs = config.assets?.run_worker_first ?? [];
    expect(globs).not.toContain('/admin/*');
    // /api/* stays so SSR endpoints (img streamer, health) reach the worker.
    expect(globs).toContain('/api/*');
  });
});

describe('.env.example — single-source schema', () => {
  const envExample = readFileSync(path.join(repoRoot, '.env.example'), 'utf8');

  it.each(['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT', 'R2_BUCKET_NAME'])(
    'lists build-time key %s',
    (varName) => {
      expect(envExample).toMatch(new RegExp(`^${varName}=`, 'm'));
    }
  );

  it.each(['CF_ACCESS_TEAM_DOMAIN', 'CF_ACCESS_AUD', 'CF_ACCESS_AUTHOR_EMAIL', 'DEPLOY_HOOK_URL', 'DEV_BYPASS_ACCESS'])(
    'does NOT list dropped CMS-only key %s',
    (varName) => {
      expect(envExample).not.toMatch(new RegExp(`^${varName}=`, 'm'));
    }
  );

  it('.dev.vars.example is gone (single source = .env.example)', () => {
    expect(() => readFileSync(path.join(repoRoot, '.dev.vars.example'))).toThrow();
  });
});

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

interface D1Binding {
  binding: string;
  database_name: string;
  database_id: string;
}

interface WranglerConfig {
  compatibility_date?: string;
  r2_buckets?: R2BucketBinding[];
  kv_namespaces?: KvBinding[];
  d1_databases?: D1Binding[];
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

describe('wrangler.jsonc — EmDash stateful bindings', () => {
  it('declares only the MEDIA R2 binding (ARTICLES retired with the R2 markdown pipeline)', () => {
    expect(config.r2_buckets?.map((b) => b.binding)).toEqual(['MEDIA']);
    expect(config.r2_buckets?.[0]?.bucket_name).toBe('emdash-media');
  });

  it('keeps MEDIA on local simulation (no remote flag) so dev/e2e never write the production bucket', () => {
    expect(config.r2_buckets?.[0]?.remote).toBeUndefined();
  });

  it('declares the DB D1 binding with a real database id', () => {
    const db = config.d1_databases?.find((d) => d.binding === 'DB');
    expect(db?.database_id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('pins compatibility_date at or after 2026-02-24 (older dates make Astro treat workerd as Node and every SSR body renders as "[object Object]")', () => {
    expect((config.compatibility_date ?? '') >= '2026-02-24').toBe(true);
  });
});

describe('wrangler.jsonc — CMS surface fully purged', () => {
  it('declares exactly the SESSION KV namespace with a real id (EmDash admin auth lives in Astro sessions)', () => {
    const kv = config.kv_namespaces ?? [];
    expect(kv.map((n) => n.binding)).toEqual(['SESSION']);
    expect(kv[0]?.id).toMatch(/^[0-9a-f]{32}$/);
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

describe('astro.config.mjs — sessions real, EmDash wired', () => {
  const astroConfig = readFileSync(path.join(repoRoot, 'astro.config.mjs'), 'utf8');

  it('does NOT null-driver Astro sessions (EmDash admin auth breaks silently without a real session store; SESSION KV in wrangler.jsonc satisfies deploy error 10210 from withastro/astro#15802)', () => {
    expect(astroConfig).not.toMatch(/unstorage\/drivers\/null/);
  });

  it('registers emdash with D1 database and R2 MEDIA storage', () => {
    expect(astroConfig).toMatch(/emdash\(\{/);
    expect(astroConfig).toMatch(/d1\(\{\s*binding:\s*'DB'/);
    expect(astroConfig).toMatch(/r2\(\{\s*binding:\s*'MEDIA'/);
  });

  it('keeps EmDash routes in run_worker_first so the asset binding cannot 404 them', () => {
    expect(config.assets?.run_worker_first).toContain('/_emdash/*');
  });
});

describe('.env.example — single-source schema', () => {
  const envExample = readFileSync(path.join(repoRoot, '.env.example'), 'utf8');

  it.each(['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT', 'R2_BUCKET_NAME'])(
    'does NOT list retired R2 loader key %s (content now lives in EmDash D1/R2 bindings)',
    (varName) => {
      expect(envExample).not.toMatch(new RegExp(`^${varName}=`, 'm'));
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

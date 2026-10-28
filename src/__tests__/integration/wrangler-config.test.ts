import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
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
  remote?: boolean;
}

interface D1Binding {
  binding: string;
  database_name: string;
  database_id: string;
  remote?: boolean;
}

interface WranglerConfig {
  name?: string;
  account_id?: string;
  compatibility_date?: string;
  compatibility_flags?: string[];
  routes?: { pattern: string; custom_domain: boolean }[];
  workers_dev?: boolean;
  preview_urls?: boolean;
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

execFileSync(process.execPath, ['--input-type=module', '--eval', "import { voidPlugin } from 'void'; voidPlugin();"], {
  cwd: repoRoot,
  timeout: 30_000,
  stdio: 'pipe'
});
const configPath = path.join(repoRoot, '.void-wrangler.jsonc');
const rawConfig = readFileSync(configPath, 'utf8');
const config = parseJsonc(rawConfig);

describe('Void configuration — existing Worker identity', () => {
  it('preserves the Worker and account', () => {
    expect({ name: config.name, account_id: config.account_id }).toEqual({
      name: 'portfolio',
      account_id: 'dee584c21793767c25eee4cebc062726'
    });
  });

  it('preserves the custom domain and URL visibility', () => {
    expect({ routes: config.routes, workers_dev: config.workers_dev, preview_urls: config.preview_urls }).toEqual({
      routes: [{ pattern: 'mrugesh.dev', custom_domain: true }],
      workers_dev: false,
      preview_urls: true
    });
  });

  it('preserves the existing D1 database identity', () => {
    expect(config.d1_databases?.[0]).toMatchObject({
      binding: 'DB',
      database_name: 'emdash-db',
      database_id: 'c9986d13-d392-4839-bbb1-014afc131260'
    });
  });

  it('preserves the existing session namespace identity', () => {
    expect(config.kv_namespaces?.[0]).toMatchObject({
      binding: 'SESSION',
      id: '2e04f6b05af0486f9de09797027d5fc0'
    });
  });

  it('keeps all stateful resources local in development', () => {
    const bindings = [...(config.d1_databases ?? []), ...(config.r2_buckets ?? []), ...(config.kv_namespaces ?? [])];
    expect(bindings.some((binding) => binding.remote)).toBe(false);
  });

  it('retains Node compatibility for Astro and EmDash', () => {
    expect(config.compatibility_flags).toContain('nodejs_compat');
  });

  it('has no competing root Wrangler configuration', () => {
    expect(
      ['wrangler.jsonc', 'wrangler.json', 'wrangler.toml'].some((file) => existsSync(path.join(repoRoot, file)))
    ).toBe(false);
  });
});

describe('Void configuration — EmDash stateful bindings', () => {
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

describe('Void configuration — legacy CMS surface stays purged, EmDash session store present', () => {
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

  it('does NOT null-driver Astro sessions (EmDash admin auth breaks silently without a real session store; SESSION KV satisfies deploy error 10210 from withastro/astro#15802)', () => {
    expect(astroConfig).not.toMatch(/unstorage\/drivers\/null/);
  });

  it('adds Void without replacing the Astro adapter', () => {
    expect(astroConfig).toMatch(/plugins:\s*\[voidPlugin\(\),\s*tailwindcss\(\)\]/);
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

describe('env.example — local environment template', () => {
  const envExample = readFileSync(path.join(repoRoot, 'env.example'), 'utf8');

  it.each(['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT', 'R2_BUCKET_NAME'])(
    'does NOT list retired R2 loader key %s (content now lives in EmDash D1/R2 bindings)',
    (varName) => {
      expect(envExample).not.toMatch(new RegExp(`^${varName}=`, 'm'));
    }
  );

  it.each(['EMDASH_ENCRYPTION_KEY', 'EMDASH_TOKEN'])('lists EmDash key %s', (varName) => {
    expect(envExample).toMatch(new RegExp(`^${varName}=`, 'm'));
  });

  it.each(['CF_ACCESS_TEAM_DOMAIN', 'CF_ACCESS_AUD', 'CF_ACCESS_AUTHOR_EMAIL', 'DEPLOY_HOOK_URL', 'DEV_BYPASS_ACCESS'])(
    'does NOT list dropped CMS-only key %s',
    (varName) => {
      expect(envExample).not.toMatch(new RegExp(`^${varName}=`, 'm'));
    }
  );

  it.each(['.env.example', '.dev.vars.example'])('does not keep the unsupported dotenv file %s', (file) => {
    expect(existsSync(path.join(repoRoot, file))).toBe(false);
  });
});

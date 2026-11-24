import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import config from '../../../cloudflare.config';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const productionConfig = config({ isPreview: false, mode: undefined });
const worker = productionConfig.worker;
const previewWorker = config({ isPreview: true, mode: undefined }).worker;
const rawConfig = readFileSync(path.join(repoRoot, 'cloudflare.config.ts'), 'utf8');
const astroConfig = readFileSync(path.join(repoRoot, 'astro.config.mjs'), 'utf8');
const pkg = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));

describe('Cloudflare configuration — existing Worker identity', () => {
  it('keeps existing remote secrets on upload and takes variables only from this config', () => {
    expect(worker.unsafe?.metadata?.keep_bindings).toEqual(['secret_text', 'secret_key']);
  });

  it('preserves the Worker, account, custom domain and URL visibility', () => {
    expect({
      name: worker.name,
      accountId: productionConfig.accountId,
      domains: worker.domains,
      workersDev: worker.workersDev,
      previewUrls: worker.previewUrls
    }).toEqual({
      name: 'portfolio',
      accountId: 'dee584c21793767c25eee4cebc062726',
      domains: ['mrugesh.dev'],
      workersDev: false,
      previewUrls: true
    });
  });

  it('preserves the runtime compatibility date and Node support', () => {
    expect(worker.compatibilityDate).toBe('2026-02-24');
    expect(worker.compatibilityFlags).toContain('nodejs_compat');
  });

  it('has no competing Void or root Wrangler configuration', () => {
    for (const file of ['void.config.ts', 'void.lock.json', 'wrangler.jsonc', 'wrangler.json', 'wrangler.toml']) {
      expect(existsSync(path.join(repoRoot, file)), file).toBe(false);
    }
    expect(astroConfig).not.toMatch(/voidPlugin|configPath/);
  });

  it('preserves invocation logs and traces', () => {
    expect(worker.observability).toEqual({
      logs: { enabled: true, invocationLogs: true },
      traces: { enabled: true }
    });
  });
});

describe('Cloudflare configuration — EmDash resources', () => {
  it('preserves the existing D1 database identity', () => {
    expect(worker.env.DB).toMatchObject({
      type: 'd1',
      name: 'emdash-db',
      id: 'c9986d13-d392-4839-bbb1-014afc131260'
    });
  });

  it('preserves the existing session namespace and media bucket', () => {
    expect(worker.env.SESSION).toMatchObject({ type: 'kv', id: '2e04f6b05af0486f9de09797027d5fc0' });
    expect(worker.env.MEDIA).toMatchObject({ type: 'r2', name: 'emdash-media' });
    expect(
      Object.entries(worker.env)
        .filter(([, binding]) => binding.type === 'kv')
        .map(([name]) => name)
    ).toEqual(['SESSION']);
    expect(
      Object.entries(worker.env)
        .filter(([, binding]) => binding.type === 'r2')
        .map(([name]) => name)
    ).toEqual(['MEDIA']);
  });

  it('keeps stateful bindings local in development', () => {
    for (const binding of [worker.env.DB, worker.env.SESSION, worker.env.MEDIA]) {
      expect(binding.dev?.remote).not.toBe(true);
    }
  });

  it('declares runtime encryption as a secret, not an embedded value', () => {
    expect(worker.env.EMDASH_ENCRYPTION_KEY).toEqual({ type: 'secret' });
  });

  it('keeps API and EmDash routes ahead of static assets', () => {
    expect(worker.env.ASSETS).toEqual({ type: 'assets' });
    expect(worker.assets?.runWorkerFirst).toEqual(['/api/*', '/_emdash/*']);
  });

  it('retains Sentry public variables', () => {
    expect(worker.env.PUBLIC_SENTRY_ENVIRONMENT).toEqual({ type: 'text', value: 'production' });
    expect(worker.env.PUBLIC_SENTRY_DSN).toMatchObject({ type: 'text', value: expect.stringContaining('ingest.') });
  });

  it('keeps retired CMS configuration absent', () => {
    expect(rawConfig).not.toMatch(/CF_ACCESS|DEV_BYPASS_ACCESS|DEPLOY_HOOK_URL/);
  });
});

describe('Cloudflare configuration — Worker Previews', () => {
  it('binds the shared staging data, never production', () => {
    expect(previewWorker.env.DB).toMatchObject({
      type: 'd1',
      name: 'emdash-db-preview',
      id: '994b3893-56cc-4dfd-abfe-4cb8a1381545'
    });
    expect(previewWorker.env.SESSION).toMatchObject({ type: 'kv', id: '6e1d014294854034bcf0f8e669c9c29a' });
    expect(previewWorker.env.MEDIA).toMatchObject({ type: 'r2', name: 'emdash-media-preview' });
  });

  it('reports to Sentry as preview', () => {
    expect(previewWorker.env.PUBLIC_SENTRY_ENVIRONMENT).toEqual({ type: 'text', value: 'preview' });
  });

  it('leaves out settings a Preview upload rejects or must not claim', () => {
    expect(previewWorker.unsafe).toBeUndefined();
    expect(previewWorker.domains).toBeUndefined();
  });

  it('keeps the Worker identity and the encryption secret', () => {
    expect(previewWorker.name).toBe('portfolio');
    expect(previewWorker.env.EMDASH_ENCRYPTION_KEY).toEqual({ type: 'secret' });
  });
});

describe('native Cloudflare workflow', () => {
  it('uses cf for development, builds and deployment, with no version uploads', () => {
    expect(pkg.scripts.dev).toBe('cf dev');
    expect(pkg.scripts.develop).toBe('cf dev');
    expect(pkg.scripts['do:build']).toBe('cf build');
    expect(pkg.scripts['do:deploy']).toBe('cf deploy --prebuilt --force');
    expect(pkg.scripts['do:versions:upload']).toBeUndefined();
    expect(pkg.scripts['versions:upload']).toBeUndefined();
    expect(pkg.devDependencies.void).toBeUndefined();
    expect(pkg.devDependencies.wrangler).toBeUndefined();
  });

  it('installs no Wrangler, not even as an optional peer', () => {
    const lockfile = readFileSync(path.join(repoRoot, 'pnpm-lock.yaml'), 'utf8');
    expect(lockfile).not.toMatch(/^ {2}'?wrangler@/m);
    expect(lockfile).not.toMatch(/\(wrangler@/);
  });

  it('keeps build and deploy on the cf scripts', () => {
    expect({ build: pkg.scripts.build, deploy: pkg.scripts.deploy }).toEqual({
      build: 'vp run do:build',
      deploy: 'vp run do:build && vp run do:deploy'
    });
  });

  it('builds before the local preview', () => {
    expect(pkg.scripts.preview).toMatch(/^vp run do:build && /);
  });

  it('builds before the end-to-end tests check the deployment package', () => {
    expect(pkg.scripts['test:e2e']).toMatch(/^vp run do:build && /);
  });

  it('keeps local state in the cf default directory with isolated e2e overrides', () => {
    expect(astroConfig).toContain("process.env.PORTFOLIO_E2E_STATE_DIR ?? '.cloudflare/state'");
  });

  it('keeps real Astro sessions and EmDash D1/R2 integration', () => {
    expect(astroConfig).not.toMatch(/unstorage\/drivers\/null/);
    expect(astroConfig).toMatch(/emdash\(\{/);
    expect(astroConfig).toMatch(/d1\(\{\s*binding:\s*'DB'/);
    expect(astroConfig).toMatch(/r2\(\{\s*binding:\s*'MEDIA'/);
  });

  it('batches EmDash D1 reads through a D1 session', () => {
    expect(astroConfig).toMatch(/d1\(\{\s*binding:\s*'DB',\s*session:\s*'auto',\s*coalesce:\s*true\s*\}\)/);
  });

  it('has no compatibility flag that blocks D1 session queries', () => {
    for (const workerConfig of [worker, previewWorker]) {
      expect(workerConfig.compatibilityFlags).not.toContain('global_fetch_strictly_public');
    }
  });
});

describe('env.example — local environment template', () => {
  const envExample = readFileSync(path.join(repoRoot, 'env.example'), 'utf8');

  it.each(['EMDASH_ENCRYPTION_KEY', 'EMDASH_TOKEN'])('lists EmDash key %s', (varName) => {
    expect(envExample).toMatch(new RegExp(`^${varName}=`, 'm'));
  });

  it.each([
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_ENDPOINT',
    'R2_BUCKET_NAME',
    'CF_ACCESS_TEAM_DOMAIN',
    'CF_ACCESS_AUD',
    'CF_ACCESS_AUTHOR_EMAIL',
    'DEPLOY_HOOK_URL',
    'DEV_BYPASS_ACCESS'
  ])('does not list retired key %s', (varName) => {
    expect(envExample).not.toMatch(new RegExp(`^${varName}=`, 'm'));
  });
});

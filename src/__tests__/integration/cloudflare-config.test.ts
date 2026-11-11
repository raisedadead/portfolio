import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import config from '../../../cloudflare.config';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const worker = config.worker;
const rawConfig = readFileSync(path.join(repoRoot, 'cloudflare.config.ts'), 'utf8');
const astroConfig = readFileSync(path.join(repoRoot, 'astro.config.mjs'), 'utf8');
const pkg = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const turbo = JSON.parse(readFileSync(path.join(repoRoot, 'turbo.json'), 'utf8'));

describe('Cloudflare configuration — existing Worker identity', () => {
  it('keeps existing remote secrets and dashboard variables on upload', () => {
    expect(worker.unsafe?.metadata?.keep_bindings).toEqual(['secret_text', 'secret_key', 'plain_text', 'json']);
  });

  it('preserves the Worker, account, custom domain and URL visibility', () => {
    expect({
      name: worker.name,
      accountId: config.accountId,
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

describe('native Cloudflare workflow', () => {
  it('uses cf for development, builds, deployment and version uploads', () => {
    expect(pkg.scripts['do:develop']).toBe('cf dev');
    expect(pkg.scripts['do:build']).toBe('cf build');
    expect(pkg.scripts['do:deploy']).toBe('cf deploy --prebuilt --force');
    expect(pkg.scripts['do:versions:upload']).toBe('cf workers versions create --prebuilt');
    expect(pkg.devDependencies.void).toBeUndefined();
    expect(pkg.devDependencies.wrangler).toBeUndefined();
  });

  it('keeps turbo out of the build and deploy paths', () => {
    expect({
      build: pkg.scripts.build,
      deploy: pkg.scripts.deploy,
      versionsUpload: pkg.scripts['versions:upload']
    }).toEqual({
      build: 'pnpm run do:build',
      deploy: 'pnpm run do:build && pnpm run do:deploy',
      versionsUpload: 'pnpm run do:build && pnpm run do:versions:upload'
    });
    expect(turbo.tasks['do:deploy']).toBeUndefined();
    expect(turbo.tasks['do:versions:upload']).toBeUndefined();
  });

  it('caches the build output required for preview and prebuilt deployment', () => {
    expect(turbo.tasks['do:build'].outputs).toContain('.cloudflare/output/**');
    expect(turbo.tasks['do:build'].outputs).toContain('.cloudflare/types/**');
    expect(turbo.tasks['do:build'].outputs).not.toContain('.void/preview-deploy-config.json');
  });

  it('preserves the existing local-state path and isolated e2e overrides', () => {
    expect(astroConfig).toContain("process.env.PORTFOLIO_E2E_STATE_DIR ?? '.wrangler/state'");
  });

  it('keeps real Astro sessions and EmDash D1/R2 integration', () => {
    expect(astroConfig).not.toMatch(/unstorage\/drivers\/null/);
    expect(astroConfig).toMatch(/emdash\(\{/);
    expect(astroConfig).toMatch(/d1\(\{\s*binding:\s*'DB'/);
    expect(astroConfig).toMatch(/r2\(\{\s*binding:\s*'MEDIA'/);
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

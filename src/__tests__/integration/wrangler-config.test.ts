import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface R2BucketBinding {
  binding: string;
  bucket_name: string;
  preview_bucket_name?: string;
}

interface KvBinding {
  binding: string;
  id: string;
}

interface WranglerConfig {
  r2_buckets?: R2BucketBinding[];
  kv_namespaces?: KvBinding[];
  env?: {
    preview?: {
      r2_buckets?: R2BucketBinding[];
    };
  };
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

/**
 * Minimal JSONC stripper: removes `//` line comments and `/* ... *\/` block comments.
 * Trailing commas are tolerated by JSON.parse only after this strip — we don't strip them
 * because Wrangler's JSONC parser accepts them but JSON.parse does not. Strategy: strip
 * trailing commas before parse.
 */
function parseJsonc(raw: string): WranglerConfig {
  const noLineComments = raw.replace(/^\s*\/\/.*$/gm, '');
  const noBlockComments = noLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
  const noTrailingCommas = noBlockComments.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(noTrailingCommas) as WranglerConfig;
}

describe('wrangler.jsonc R2 bindings', () => {
  const configPath = path.join(repoRoot, 'wrangler.jsonc');
  const config = parseJsonc(readFileSync(configPath, 'utf8'));

  it('declares the ARTICLES R2 binding at top level', () => {
    expect(config.r2_buckets).toBeDefined();
    const articles = config.r2_buckets?.find((b) => b.binding === 'ARTICLES');
    expect(articles).toBeDefined();
    expect(articles?.bucket_name).toBe('articles-content-prd');
    expect(articles?.preview_bucket_name).toBe('articles-content-stg');
  });

  it('declares the ARTICLES R2 binding for the preview environment', () => {
    const previewBuckets = config.env?.preview?.r2_buckets;
    expect(previewBuckets).toBeDefined();
    const articles = previewBuckets?.find((b) => b.binding === 'ARTICLES');
    expect(articles).toBeDefined();
    expect(articles?.bucket_name).toBe('articles-content-stg');
  });

  it('keeps the existing SESSION KV binding intact', () => {
    const session = config.kv_namespaces?.find((b) => b.binding === 'SESSION');
    expect(session).toBeDefined();
    expect(session?.id).toBe('15e1b8365ada4c6bb01c761e25dcf3aa');
  });
});

describe('.env.example — single-source schema', () => {
  const envExamplePath = path.join(repoRoot, '.env.example');
  const envExample = readFileSync(envExamplePath, 'utf8');

  describe('build-time keys', () => {
    it.each(['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT', 'R2_BUCKET_NAME', 'PUBLIC_USE_R2_LOADER'])(
      'lists %s',
      (varName) => {
        expect(envExample).toMatch(new RegExp(`^${varName}=`, 'm'));
      }
    );
  });

  describe('Worker-runtime keys (mirrored to .dev.vars by sync-dev-vars.mjs)', () => {
    it.each([
      'CF_ACCESS_TEAM_DOMAIN',
      'CF_ACCESS_AUD',
      'CF_ACCESS_AUTHOR_EMAIL',
      'DEPLOY_HOOK_URL',
      'DEV_BYPASS_ACCESS'
    ])('lists %s without PUBLIC_ prefix', (varName) => {
      expect(envExample).toMatch(new RegExp(`^${varName}=`, 'm'));
      expect(envExample).not.toMatch(new RegExp(`^PUBLIC_${varName}=`, 'm'));
    });
  });

  it('.dev.vars.example is gone (single source = .env.example)', () => {
    expect(() => readFileSync(path.join(repoRoot, '.dev.vars.example'))).toThrow();
  });
});

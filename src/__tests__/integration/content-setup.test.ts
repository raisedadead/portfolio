/**
 * Post-migration content setup gate.
 *
 * The legacy `src/content/articles` submodule has been removed (P2/T2.4).
 * Blog content now ships from the Cloudflare R2 bucket `articles-content-prd`
 * via `src/lib/r2-loader.ts`, configured by `wrangler.jsonc` and the
 * environment roster in `.env.example`.
 *
 * These tests guard against regressions that would re-introduce submodule
 * coupling or stash the markdown back into a local directory.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Content Setup', () => {
  describe('legacy submodule fully detached', () => {
    it('.gitmodules does not exist', () => {
      expect(existsSync(join(repoRoot, '.gitmodules'))).toBe(false);
    });

    it('src/content/articles does not exist', () => {
      expect(existsSync(join(repoRoot, 'src/content/articles'))).toBe(false);
    });

    it('.git/modules has no `src/content/articles` worktree', () => {
      const stale = join(repoRoot, '.git/modules/src/content/articles');
      expect(existsSync(stale)).toBe(false);
    });
  });

  describe('R2 binding wired', () => {
    it('wrangler.jsonc declares the ARTICLES R2 binding', () => {
      const wrangler = readFileSync(join(repoRoot, 'wrangler.jsonc'), 'utf8');
      expect(wrangler).toMatch(/"binding":\s*"ARTICLES"/);
      expect(wrangler).toMatch(/"bucket_name":\s*"articles-content-prd"/);
    });

    it('.env.example documents the build-time R2 roster', () => {
      const envExample = readFileSync(join(repoRoot, '.env.example'), 'utf8');
      for (const key of [
        'R2_ACCESS_KEY_ID',
        'R2_SECRET_ACCESS_KEY',
        'R2_ENDPOINT',
        'R2_BUCKET_NAME',
        'PUBLIC_USE_R2_LOADER'
      ]) {
        expect(envExample).toMatch(new RegExp(`^${key}=`, 'm'));
      }
    });
  });
});

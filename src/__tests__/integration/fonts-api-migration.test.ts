// Regression guard for Phase 3 / C26 (A4):
// Manual `@font-face` + `<link rel="preload">` blocks were replaced
// with Astro's Fonts API (`fonts: [...]` in astro.config.mjs +
// `<Font cssVariable preload />` in base-layout). This file pins the
// post-migration shape so a future revert / drift fails CI fast.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');

const astroConfig = readFileSync(path.join(root, 'astro.config.mjs'), 'utf-8');
const globalCss = readFileSync(path.join(root, 'src/styles/global.css'), 'utf-8');
const baseLayout = readFileSync(path.join(root, 'src/layouts/base-layout.astro'), 'utf-8');

describe('Astro Fonts API — migration shape (V10, A4)', () => {
  it('astro.config.mjs declares all three families via fontProviders.local()', () => {
    expect(astroConfig).toMatch(/import\s*{[^}]*\bfontProviders\b[^}]*}\s*from\s*['"]astro\/config['"]/);
    expect(astroConfig).toMatch(/cssVariable:\s*['"]--font-inter['"]/);
    expect(astroConfig).toMatch(/cssVariable:\s*['"]--font-space-grotesk['"]/);
    expect(astroConfig).toMatch(/cssVariable:\s*['"]--font-jetbrains-mono['"]/);
  });

  it('points each variant at src/assets/fonts/, not public/fonts/', () => {
    // Astro recommends src/ to avoid duplicating font files in the build output.
    expect(astroConfig).toMatch(/src\/assets\/fonts\/inter\/inter-700\.woff2/);
    expect(astroConfig).not.toMatch(/['"]\/fonts\//);
  });

  it('global.css contains zero @font-face rules (Astro emits them at build)', () => {
    // Match the actual at-rule, not the literal substring inside comments.
    expect(globalCss).not.toMatch(/@font-face\s*\{/);
  });

  it('base-layout imports Font from astro:assets and preloads critical weights', () => {
    expect(baseLayout).toMatch(/import\s*{[^}]*\bFont\b[^}]*}\s*from\s*["']astro:assets["']/);
    expect(baseLayout).toMatch(/<Font\s+cssVariable=["']--font-inter["']\s+preload\s*\/>/);
    expect(baseLayout).toMatch(/<Font\s+cssVariable=["']--font-space-grotesk["']\s+preload\s*\/>/);
    expect(baseLayout).toMatch(/<Font\s+cssVariable=["']--font-jetbrains-mono["']\s*\/>/);
  });

  it('drops the legacy manual <link rel="preload"> font blocks', () => {
    expect(baseLayout).not.toMatch(/rel=["']preload["'][^>]*href=["']\/fonts\//);
  });
});

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const redirectsText = readFileSync(path.join(repoRoot, 'public/_redirects'), 'utf8');
const configText = readFileSync(path.join(repoRoot, 'astro.config.mjs'), 'utf8');

const rules = redirectsText
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [source, destination, status] = line.split(/\s+/);
    return { source, destination, status };
  });

describe('public/_redirects admin entries', () => {
  it.each(['/admin', '/admin/', '/blog/admin', '/blog/admin/'])(
    'sends %s to the EmDash admin with a temporary 302',
    (source) => {
      expect(rules).toContainEqual({ source, destination: '/_emdash/admin', status: '302' });
    }
  );

  it('declares no admin rule as 301 (a permanent redirect is cached forever by browsers)', () => {
    const adminRules = rules.filter((rule) => rule.destination === '/_emdash/admin');
    expect(adminRules.length).toBeGreaterThan(0);
    expect(adminRules.every((rule) => rule.status === '302')).toBe(true);
  });
});

describe('astro.config.mjs does not duplicate the redirect surface', () => {
  it('declares no redirects key (Astro SSR redirect routes downgrade an unmatched destination to 301: node_modules/astro/dist/core/redirects/render.js computeRedirectStatus)', () => {
    expect(configText).not.toMatch(/^\s*redirects:/m);
  });
});

/**
 * Asserts the runtime-relevant fields of `astro.config.mjs`. Right now
 * this file's only job is to gate the post-P3 image.remotePatterns shape
 * — `mrugesh.dev` only, no third-party CDN holdovers — but it's the right
 * place to add more `astro.config` invariants as they accumulate.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const configText = readFileSync(path.join(process.cwd(), 'astro.config.mjs'), 'utf8');

describe('astro.config.mjs image.remotePatterns', () => {
  it('allows mrugesh.dev', () => {
    expect(configText).toMatch(/hostname:\s*'mrugesh\.dev'/);
  });

  it('does not list any freecodecamp.org host', () => {
    expect(configText).not.toMatch(/hostname:\s*'(www|cdn)\.freecodecamp\.org'/);
  });

  it('does not list cdn.hashnode.com', () => {
    expect(configText).not.toMatch(/hostname:\s*'cdn\.hashnode\.com'/);
  });
});

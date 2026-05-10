// Pages set per-route `<head>` content via `<Fragment slot="head">`
// (e.g. blog/index.astro injects `dns-prefetch` for the freeCodeCamp
// RSS image host). The named slot only reaches the rendered HTML if
// every layer in the layout chain declares it.
//
// 2026-05 regression: blog/index used the slot but no layout defined
// it, so the prefetch never landed. Source meta-gate guards the chain.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const baseLayout = readFileSync(path.resolve(here, '../../layouts/base-layout.astro'), 'utf-8');
const mainLayout = readFileSync(path.resolve(here, '../../layouts/main-layout.astro'), 'utf-8');

describe('Layout head slot — chain integrity', () => {
  it('base-layout exposes a named "head" slot inside <head>', () => {
    // Slot must be inside the <head> block, before </head>.
    const headBlock = baseLayout.match(/<head>([\s\S]*?)<\/head>/);
    expect(headBlock, 'base-layout has no <head> block').not.toBeNull();
    expect(headBlock![1]).toMatch(/<slot[^>]*name=["']head["']/);
  });

  it('main-layout forwards the named "head" slot to BaseLayout', () => {
    // Astro slot forwarding: a child element with both `slot="head"`
    // (which named slot of the *parent* it fills) and `name="head"`
    // (which named slot it accepts from *its own* callers).
    expect(mainLayout).toMatch(
      /<slot[^>]*name=["']head["'][^>]*slot=["']head["']|<slot[^>]*slot=["']head["'][^>]*name=["']head["']/
    );
  });
});

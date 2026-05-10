// Regression guard for the 2026-05 layout SSR bug:
// `<ErrorBoundary client:only="react">` (and later `client:load`)
// wrapping the body `<slot />` killed first-paint everywhere. Even
// `client:load` failed because Astro slot HTML ≠ React vnodes — React
// 19 bails on the hydration mismatch and re-renders the subtree
// client-side, which tears down nested islands and goes blank.
//
// Definitive fix: nothing wraps the body slot. Stand-alone islands
// (e.g. ConsentBanner) live as siblings of the slot, not parents.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const baseLayoutPath = path.resolve(here, '../../layouts/base-layout.astro');
const baseLayout = readFileSync(baseLayoutPath, 'utf-8');

describe('BaseLayout — SSR slot integrity', () => {
  it('the body <slot /> is NOT wrapped in any React island', () => {
    // Extract body block and find the slot. Walk back from the slot
    // and assert the most-immediate enclosing element is `<body>`,
    // not a React component.
    const bodyMatch = baseLayout.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    expect(bodyMatch, 'base-layout has no <body>').not.toBeNull();
    const body = bodyMatch![1];

    // Anything between `<body>` and the first `<slot />` should not
    // contain an opening React-component tag (PascalCase) with a
    // `client:*` directive that hasn't already been closed.
    const slotIdx = body.indexOf('<slot');
    expect(slotIdx, 'no <slot /> inside <body>').toBeGreaterThanOrEqual(0);
    const before = body.slice(0, slotIdx);

    // Open React-component tags before the slot
    const openTags = before.match(/<([A-Z][A-Za-z0-9]*)\b[^>]*\bclient:[a-z]+/g) ?? [];
    // Same components closed before the slot
    const closeTags = before.match(/<\/[A-Z][A-Za-z0-9]*>/g) ?? [];
    expect(
      openTags.length,
      `Body slot is wrapped in React island(s): ${openTags.join(', ')}. ` +
        `Wrapping the slot in a client:* component breaks hydration ` +
        `(Astro slot HTML is not React vnodes — React 19 bails and ` +
        `re-renders client-side, blanking nested islands).`
    ).toBe(closeTags.length);
  });

  it('does not reference the dropped ErrorBoundary or ClientProviders', () => {
    expect(baseLayout).not.toMatch(/ErrorBoundary|ClientProviders/);
  });

  it('renders ConsentBanner with client:only="react" so it does not SSR', () => {
    // V11 (Phase 3 / A7): client:idle SSRs the banner, then unmounts on
    // hydration → ~50ms flash for returning users whose preference is
    // already set. client:only skips SSR entirely. Banner is a sibling
    // of the body slot, not a parent, so this is safe per the SSR
    // invariant above.
    expect(baseLayout).toMatch(/<ConsentBanner\s+client:only=["']react["']\s*\/>/);
    expect(baseLayout).not.toMatch(/<ConsentBanner\s+client:idle\s*\/>/);
  });
});

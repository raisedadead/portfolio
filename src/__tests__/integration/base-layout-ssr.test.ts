// Regression guard for the 2026-05 layout SSR bug:
// `<ErrorBoundary client:only="react">` wrapping the body `<slot />`
// disabled SSR for the entire page subtree, producing a blank first
// paint everywhere. Fix is `client:load`, which keeps client hydration
// while letting Astro emit the SSR'd slot HTML.
//
// Source-level meta-gate (cheap, no AstroContainer infra). Pairs with
// the planned crawler-visible-body e2e check in Phase 2.4.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const baseLayoutPath = path.resolve(here, '../../layouts/base-layout.astro');
const baseLayout = readFileSync(baseLayoutPath, 'utf-8');

describe('BaseLayout — SSR slot integrity', () => {
  it('does NOT wrap the body slot in a client:only React island', () => {
    // `client:only` skips HTML server rendering. If ErrorBoundary uses
    // it, the entire `<slot />` content disappears from SSR output.
    expect(baseLayout).not.toMatch(/<ErrorBoundary[^>]*client:only/);
  });

  it('hydrates ErrorBoundary with client:load so SSR keeps the slot', () => {
    expect(baseLayout).toMatch(/<ErrorBoundary[^>]*client:load/);
  });
});

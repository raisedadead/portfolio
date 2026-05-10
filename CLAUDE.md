# CLAUDE.md

Project notes — non-obvious only. Commands, deps, and tsconfig are
discoverable from `package.json` / `tsconfig.json`; not duplicated here.

## Stack

Astro 6 (SSR, `@astrojs/cloudflare` 13 adapter) + React 19 islands +
Tailwind 4. Markdown sourced from R2 at build time; freeCodeCamp RSS
as a second collection. Sentry client + server. pnpm enforced via
`packageManager`.

## Layout SSR — non-obvious gotcha

The body `<slot />` in `src/layouts/base-layout.astro` is **NOT**
wrapped in any `client:*` React island. Wrapping it (any directive,
including `client:load`) breaks first paint — Astro emits the slot's
HTML, but React 19 sees a hydration mismatch (slot HTML ≠ React
vnodes) and tears down the subtree. Stand-alone islands (e.g.
`ConsentBanner`) live as **siblings** of the slot, not parents.
Regression test: `src/__tests__/integration/base-layout-ssr.test.ts`.

`<slot name="head" />` is exposed in base-layout and forwarded through
main-layout, so per-route `<Fragment slot="head">` (e.g. blog/index DNS
prefetch) actually lands. Regression test:
`src/__tests__/integration/layout-head-slot.test.ts`.

## Content & R2

- Bucket layout: `posts/<slug>.md`, `drafts/<slug>.md`,
  `assets/images/<slug>/<file>` in `articles-content`. Single bucket;
  `wrangler dev` reads it directly via `remote: true` on the R2 binding.
- `src/content.config.ts` wires `r2MarkdownLoader` directly. The loader
  rewrites legacy `../assets/images/<slug>/<file>` references to
  `/api/img/<slug>/<file>` so they resolve through the R2 streamer at
  runtime. Build fails loudly without R2 credentials — no glob fallback.
- Migration: `node scripts/migrate-articles-to-r2.mjs --source <path>
  --bucket <name> [--dry-run|--commit]`. Idempotent (md5 + ETag skip).
  Requires an R2 token with **read+write** scope.

## API surface

Two SSR endpoints only:

- `/api/img/[...path]` — streams images from the R2 `ARTICLES`
  bucket. `prerender = false`. Accessed via paths the R2 loader
  rewrites in markdown frontmatter and bodies.
- `/api/health` — minimal liveness probe. Returns
  `{ status: 'healthy', timestamp }` with `cache-control: no-store`.
  No CORS allow-all, no request-header echo.

`wrangler.jsonc → assets.run_worker_first: ["/api/*"]` ensures these
hit the worker before the static-asset binding 404s them.

## Secrets / env

`.env` is the single source. `.envrc` (committed) hooks direnv so vars
load on `cd` into the project. Build-time vars (Sentry, R2, Turbo)
land in CI via Workers Build env. There are no runtime secrets — the
worker reads only `vars` declared in `wrangler.jsonc`.

## Sentry on Cloudflare

Sentry MUST be the first integration in `astro.config.mjs`. Request
handler auto-instrumentation is off for workerd compatibility.

`sentry.{client,server}.config.ts` gate `Sentry.init()` on environment
detection — workerd rejects `addEventListener('load', _, true)` from
`browserTracingIntegration`, so we skip init on workerd
(`globalThis.WebSocketPair`) and outside browsers. Sentry stays live
in real Node SSR and real browsers.

## React 19 + bundler

`astro.config.mjs` aliases `react-dom/server` → `react-dom/server.edge`
in production to dodge the MessageChannel polyfill that
`server.browser` pulls in.

## Hydration directives

- `<Nav client:load>` — mobile menu must be tappable on load, not
  after `requestIdleCallback` fires (1–2s lag with `client:idle`).
- `<Background client:idle>` — pure visual, defers JS work.
- `<ScrollButton client:visible>` — fixed-position button.
- `<ConsentBanner client:only="react">` — sibling of the body slot
  (never a parent — see "Layout SSR" above). `client:only` skips SSR
  so returning users with a stored choice don't see a 50ms flash of
  the banner being unmounted on hydration.
- All `<ExpandableSection client:visible>` on /uses + /about — fold-out
  cards, hydrate when scrolled to.

## Styling

Tailwind 4 with brutalist tokens in `src/styles/global.css`:
`brutalist-{button,card,input}`, hard-edge shadows
`--shadow-brutal-{sm,md,lg,xl}`. Fonts (Inter, Space Grotesk,
JetBrains Mono) are loaded via Astro's Fonts API — `fonts: [...]` in
`astro.config.mjs` with `fontProviders.local()`, font files in
`src/assets/fonts/` (not `public/`, per Astro's no-duplicate-build
guidance). `<Font cssVariable preload />` in `base-layout.astro` head
emits the `@font-face` declarations and preload links for the
critical weights (Inter 700, Space Grotesk 400). Tailwind's
`--font-display`/`--font-sans`/`--font-mono` aliases in `@theme`
reference the family names directly, decoupling the design tokens
from Astro's per-family `cssVariable`. Regression test:
`src/__tests__/integration/fonts-api-migration.test.ts`.

Astro `optimizedFallbacks` is disabled per family (`fallbacks: []`)
because the bundled `fontkitten` parser rejects our `.woff2` files
("Unknown font format"). Our hand-curated system-font fallback chain
in `@theme` already covers the gap; revisit if Astro swaps to a
parser that handles these files.

## Background canvas

`src/components/background/` is layered for perf — static gradient
(z-1) + animated canvas (z-2, `client:idle` hydration). Grain texture
renders at 50% res; resize debounces grain regen 150 ms. Canvas
opacity fades in over 1.8 s.

The Background persists across page navigations via
`<ClientRouter />` + `transition:persist='background'`.

## Testing

- Vitest + happy-dom + `pool: 'forks'` (required for stability).
- Test files in `src/__tests__/{unit,integration,component,pages}/`.
- jest-axe for a11y. `toHaveNoViolations` is registered globally in
  `vitest.setup.ts`; types augmented in `src/types/vitest-jest-axe.d.ts`.
- Playwright e2e against `wrangler dev --config dist/server/...`. R2
  binding is `remote: true` so the suite hits the real staging bucket.
- Source meta-gates guard layout SSR (`base-layout-ssr.test.ts`,
  `layout-head-slot.test.ts`) and wrangler config drift
  (`wrangler-config.test.ts`).

## Path alias

`@/*` → `./src/*` (`tsconfig.json` + `vitest.config.ts`).

## Known dev-time noise

- `wrangler dev` logs `Enabling sessions with Cloudflare KV with the
  SESSION KV binding` on every start. This is hardcoded in
  `@astrojs/cloudflare` 13.x ([Astro #15802](https://github.com/withastro/astro/issues/15802));
  the message fires regardless of whether `Astro.session` is used.
  We don't use Astro Sessions, so the warning is harmless. No
  `SESSION` KV binding exists in `wrangler.jsonc`.

## Audit reference

Phase 3 (Astro 6.3 + adapter 13.5 overhaul) decisions and the
Astro CSP / ClientRouter / Shiki incompatibility (A12, deferred)
are documented in `.scratchpad/dossier/` — `PLAN.md`, `SPEC.md`,
`AUDIT.md`, and `AUDIT-astro6-cloudflare.md` (the deep-research note
with sources cited).

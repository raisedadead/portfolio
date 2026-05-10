# CLAUDE.md

Project notes — non-obvious only. Commands, deps, and tsconfig are
discoverable from `package.json` / `tsconfig.json`; not duplicated here.

## Stack

Astro 6 (SSR, `@astrojs/cloudflare` 13 adapter) + React 19 islands +
Tailwind 4. Markdown sourced from R2 at build time; freeCodeCamp RSS
as a second collection. Sentry client + server. pnpm enforced via
`packageManager`.

## Layout SSR — non-obvious gotcha

`src/layouts/base-layout.astro` wraps `<slot />` in `<ErrorBoundary
client:load>`. **Never `client:only`** — `client:only` skips HTML
server rendering for the subtree, which leaves the entire body empty
on first paint until React hydrates. Regression test:
`src/__tests__/integration/base-layout-ssr.test.ts`.

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
- `<ClientProviders client:idle>` — GA consent banner, non-critical.
- `<ErrorBoundary client:load>` — see "Layout SSR" above.
- All `<ExpandableSection client:visible>` on /uses + /about — fold-out
  cards, hydrate when scrolled to.

## Styling

Tailwind 4 with brutalist tokens in `src/styles/global.css`:
`brutalist-{button,card,input}`, hard-edge shadows
`--shadow-brutal-{sm,md,lg,xl}`. All fonts (Inter, Space Grotesk,
JetBrains Mono) declared via `@font-face` with `font-display: swap`
(or `optional` for the two preloaded critical weights). No JS-side
font loading — the FontFace API block was redundant with CSS.

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

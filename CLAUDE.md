# CLAUDE.md

Project notes — non-obvious only. Commands, deps, and tsconfig are
discoverable from `package.json` / `tsconfig.json`; not duplicated here.

## Stack

Astro 6 (SSR, Cloudflare adapter) + React 19 islands + Tailwind 4.
Markdown sourced from R2 at build time; freeCodeCamp RSS as a second
collection. Sentry client + server. pnpm enforced via `packageManager`.

## Content & R2

- Bucket layout: `posts/<slug>.md`, `drafts/<slug>.md`,
  `assets/images/<slug>/<file>` in `articles-content-prd` (preview/dev
  → `articles-content-stg`, picked up via `preview_bucket_name` on the
  binding — wrangler dev never hits prod R2).
- `src/content.config.ts` wires `r2MarkdownLoader` directly. The loader
  rewrites legacy `../assets/images/<slug>/<file>` references to
  `/api/img/<slug>/<file>` so they resolve through the R2 streamer at
  runtime. Build fails loudly without R2 credentials — no glob fallback.
- Migration: `node scripts/migrate-articles-to-r2.mjs --source <path>
  --bucket <name> [--dry-run|--commit]`. Idempotent (md5 + ETag skip).
  Requires an R2 token with **read+write** scope.

## CMS surface

`/admin/*` + `/api/cms/*` gated by Cloudflare Access JWT. Single-author
allowlist (`hi@mrugesh.dev`). Posts are stored in `posts/<slug>.md`
with a `draft` frontmatter flag — publish flips it to `false` and fires
the Workers Build deploy hook.

- Pure libs: `src/lib/cms-{access-guard,middleware,posts,publish}.ts`.
  Bindings are passed in via interfaces so vitest never imports
  `astro:middleware` / `cloudflare:workers`.
- `src/lib/cloudflare-env-bridge.ts` is a workerd-only env shim. The
  middleware reaches it via guarded dynamic import — Node-mode
  prerender catches the `cloudflare:` resolve failure and falls
  through.
- `wrangler.jsonc → assets.run_worker_first` puts CMS paths in front of
  the static-asset binding so the gate fires before a stray asset
  lookup. Without it, `/admin` would serve the static 404 page.
- Setup runbook: `docs/cms-setup.md` (KV namespace, CF Access app,
  `wrangler secret put` for the four runtime keys).

## Secrets / env

`.env` is the single source. `.envrc` (committed) hooks direnv so vars
load on `cd`. `pnpm develop` and `pnpm preview` regenerate `.dev.vars`
from `.env` via `scripts/sync-dev-vars.mjs` — only the runtime-only
subset (`CF_ACCESS_*`, `DEPLOY_HOOK_URL`, `DEV_BYPASS_ACCESS`). Schema
lives in `.env.example`. Production secrets land in the Worker secret
store via `wrangler secret put`.

`DEV_BYPASS_ACCESS=1` opens the gate **only** under `astro dev` — gated
by `import.meta.env.DEV`. Production builds drop the bypass branch.

## Sentry on Cloudflare

Sentry MUST be the first integration in `astro.config.mjs`. Request
handler auto-instrumentation is off for workerd compatibility.

`sentry.{client,server}.config.ts` gate `Sentry.init()` on environment
detection — workerd rejects `addEventListener('load', _, true)` from
`browserTracingIntegration`, so we skip init on workerd
(`globalThis.WebSocketPair`) and outside browsers. Sentry is still live
in real Node SSR (e.g. prerender) and in real browsers.

The middleware emits `api.response_time` distribution + `api.requests`
count for every `/api/*` response (including 401s).

## React 19 + bundler

`astro.config.mjs` aliases `react-dom/server` → `react-dom/server.edge`
in production to dodge the MessageChannel polyfill that
`server.browser` pulls in.

## Styling

Tailwind 4 with brutalist tokens in `src/styles/global.css`:
`brutalist-{button,card,input}`, hard-edge shadows
`--shadow-brutal-{sm,md,lg,xl}`. Critical fonts preload; rest lazy via
FontFace API.

## Background canvas

`src/components/background/` is layered for perf — static gradient
(z-1) + animated canvas (z-2, `client:idle` hydration). Grain texture
renders at 50% res; resize debounces grain regen 150 ms. Canvas opacity
fades in over 1.8 s.

The Background persists across page navigations via
`<ClientRouter />` + `transition:persist='background'`.

## Testing

- Vitest + happy-dom + `pool: 'forks'` (required for stability).
- Test files in `src/__tests__/{unit,integration,component,pages}/`.
- jest-axe for a11y. `toHaveNoViolations` is registered globally in
  `vitest.setup.ts`; types augmented in `src/types/vitest-jest-axe.d.ts`.
- Playwright e2e against `wrangler dev --config dist/server/...`. R2
  binding is `remote: true` so the suite hits the real staging bucket.

## Path alias

`@/*` → `./src/*` (`tsconfig.json` + `vitest.config.ts`).

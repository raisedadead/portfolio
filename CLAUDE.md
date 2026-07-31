# CLAUDE.md

Caveman notes. Non-obvious only — traps, invariants, and why.

Versions, deps, scripts, paths, aliases: read `package.json`, `tsconfig.json`, `astro.config.mjs`, `wrangler.jsonc`. Never mirror them here. They rot.

## pnpm

`postinstall` must be a **direct** `wrangler types` call. Never route through turbo.

Turbo spawns nested `pnpm run` mid-install. pnpm re-verifies deps on every `pnpm run`, auto-installs when node_modules looks stale, recurses forever. CI dies OOM / SIGTERM. Turbo cache hits mask it locally. Direct binary call has no nested `pnpm run`, so loop cannot form.

`verifyDepsBeforeRun: false` in `pnpm-workspace.yaml` = same defense for any other `pnpm run` during install.

Native build scripts approved via `allowBuilds` map. Older `onlyBuiltDependencies` / `ignoredBuiltDependencies` keys are silently ignored now — silently, so check the map.

## Deploy — Cloudflare Workers Builds

CF runs build and deploy as **two separate commands** in one container. Deploy command must not rebuild.

- Top-level scripts (`build`, `lint`, `test`) wrap turbo. Local + GitHub Actions.
- `do:*` scripts are raw, turbo-free executors.

CF deploy command must be a `do:*` script. Anything turbo-wrapped re-enters turbo, and its build dep re-runs the whole build inside the deploy sandbox.

Deploy targets the adapter-emitted `dist/server/wrangler.json`, not root `wrangler.jsonc`. Root alone deploys the wrong, unbuilt worker.

## Layout SSR — do not break

Body `<slot />` in base-layout is **never** wrapped in a `client:*` island. Any directive breaks first paint: Astro emits the slot HTML, React sees a hydration mismatch, tears the subtree down.

Stand-alone islands go **sibling** to the slot, never parent.

`<slot name="head" />` is forwarded base → main layout so per-route `<Fragment slot="head">` actually lands.

Both guarded by source meta-gate tests. Keep them.

## Content / R2

One bucket. `posts/<slug>.md`, `drafts/<slug>.md`, `assets/images/<slug>/<file>`.

Loader rewrites legacy `../assets/images/…` refs to the `/api/img/…` streamer so they resolve at runtime.

Build **fails loud** without R2 creds. No glob fallback — that is deliberate.

`wrangler dev` reads the bucket directly via `remote: true` on the binding. Means e2e hits the **real** bucket, not a mock.

`run_worker_first` on `/api/*` is load-bearing. Without it the static-asset binding 404s the endpoints before the worker ever sees them.

## Sentry

Must be the **first** integration in `astro.config.mjs` — it wraps the others.

`Sentry.init()` is gated on environment detection. workerd rejects `addEventListener('load', _, true)` from `browserTracingIntegration`, so skip init on workerd (detect `globalThis.WebSocketPair`) and outside browsers. Stays live in real Node SSR and real browsers.

Request-handler auto-instrumentation is off for workerd compatibility.

## React / bundler

Production aliases `react-dom/server` → `react-dom/server.edge`. Dodges the MessageChannel polyfill that `server.browser` drags in.

## Hydration — only the non-obvious

- Nav is `client:load`. Mobile menu must be tappable on load; `client:idle` gives 1–2s of dead taps.
- ConsentBanner is `client:only`. Skips SSR so returning users with a stored choice never see the banner flash and unmount. Sibling of the slot — see Layout SSR.

Everything else is routine visible/idle deferral for visual or below-fold work.

## Fonts

Astro Fonts API with the local provider. Font files live in `src/assets/fonts`, **not** `public/` — Astro's no-duplicate-build guidance.

`<Font cssVariable preload />` in the base-layout head emits the `@font-face` rules and preloads for critical weights.

Tailwind `--font-*` aliases reference family names directly, decoupling design tokens from Astro's per-family `cssVariable`.

`optimizedFallbacks` is disabled per family. The bundled font parser rejects our woff2 files ("Unknown font format"). Hand-curated system fallback chain covers the gap. Revisit if Astro swaps parsers.

## Background

Static gradient layer + animated canvas layer. Canvas hydrates idle; grain renders at half res.

Persists across navigation via `<ClientRouter />` plus `transition:persist` on the wrapper div in main-layout. The attribute is on the wrapper, not the component.

## Testing

`pool: 'forks'` is **required** for stability. happy-dom environment.

jest-axe `toHaveNoViolations` registered globally in the vitest setup file.

Playwright runs against `wrangler dev` on built output, against the real R2 bucket.

Source meta-gates guard layout SSR and wrangler config drift.

**Turbo cache keys:** cached tasks declare no `inputs`, so turbo hashes all tracked files. This is deliberate. An `inputs` allowlist narrower than what a task actually reads makes breakage invisible — the task replays a stale green forever. Cost is a few extra cache misses on cheap tasks. Do not reintroduce allowlists without checking the task's real read set.

## Dev noise — ignore

`wrangler dev` logs `Enabling sessions with Cloudflare KV with the SESSION KV binding` on every start. Hardcoded in the Cloudflare adapter ([withastro/astro#15802](https://github.com/withastro/astro/issues/15802)); fires whether or not sessions are used. We don't use Astro Sessions and no SESSION binding exists. Harmless.

## History

Phase 3 audit decisions and the Astro CSP / ClientRouter / Shiki incompatibility (A12, deferred) live in `.scratchpad/dossier/`.

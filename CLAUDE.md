# CLAUDE.md

Non-obvious only — traps, invariants, and why.

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

## Content — EmDash CMS

Content lives in EmDash (D1 `DB`, media in R2 `MEDIA`, admin at `/_emdash/admin`). Blog pages query `getEmDashCollection('posts')` at request time — the whole site is SSR, zero prerendered pages.

Do **not** reintroduce `prerender = true` anywhere: workerd prerendering writes `[object Object]` into every emitted HTML file (astro/adapter bug), and node prerendering dies on EmDash's `cloudflare:workers` import. Full SSR sidesteps both.

`compatibility_date` must stay ≥ 2026-02-24. Older dates give `process` the `[object process]` toString tag under `nodejs_compat`, Astro then takes its Node render path (async-iterable body), and workerd stringifies every SSR page to the literal `[object Object]`. Meta-gate enforces it.

EmDash admin auth lives in **Astro sessions** → the SESSION KV binding is required and the old null-driver workaround must stay dead. Session writes silently no-op on a null driver and every admin login loops.

`run_worker_first` on `/api/*` **and** `/_emdash/*` is load-bearing. Without it the static-asset binding 404s the endpoints before the worker ever sees them.

One-shot import from the old articles repo: `scripts/import-articles-to-emdash.mjs` (dry-run default, idempotent by slug, dev-bypass auth locally / `--token` against prod). Body markdown → Portable Text via `markdownToPortableText` from `emdash/client`; images upload through the media API.

Shiki must use `shiki/core` + the JavaScript regex engine with statically imported langs — full `shiki` dynamic-imports grammars and fails for every language on workerd (silent fallback to unstyled `<pre>`).

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

**wrangler is pinned to 4.98.0** (stable miniflare 4, matching the adapter's). wrangler ≥4.120 bundles a miniflare 5 **alpha**: its R2/DO local sim is unstable under load, and it silently upgrades DO sqlite schemas in `.wrangler` state that the adapter's miniflare 4 then cannot open (`SENTRY_DO SQLite failed: _cf_ALARM has 3 columns`). Do not let Renovate bump it past stable-miniflare-4 territory (≤4.115.x) until miniflare 5 is stable.

Playwright runs against `wrangler dev` on built output. `e2e/global-setup.ts` seeds local EmDash state (astro dev + dev-bypass + fixture import from `e2e/fixtures/content/`), then snapshots `.wrangler/state` → `.wrangler/preview` for wrangler. The snapshot is not optional: wrangler bundles a **newer miniflare** than the adapter and upgrades DO sqlite schemas in place — run it on the shared state dir once and `astro dev`/`astro build` crash with `SENTRY_DO SQLite failed: table _cf_ALARM has 3 columns` until the state is wiped.

Source meta-gates guard layout SSR and wrangler config drift.

**Turbo cache keys:** cached tasks declare no `inputs`, so turbo hashes all tracked files. This is deliberate. An `inputs` allowlist narrower than what a task actually reads makes breakage invisible — the task replays a stale green forever. Cost is a few extra cache misses on cheap tasks. Do not reintroduce allowlists without checking the task's real read set.

## Dev noise — ignore

`wrangler dev` logs `Enabling sessions with Cloudflare KV with the SESSION KV binding` on every start ([withastro/astro#15802](https://github.com/withastro/astro/issues/15802)). Since the EmDash migration this is accurate — sessions are real and the SESSION binding exists. Still noise, no action.

## History

Phase 3 audit decisions and the Astro CSP / ClientRouter / Shiki incompatibility (A12, deferred) live in `.scratchpad/dossier/`.

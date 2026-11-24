# Tooling

This guide tells you which tool owns each job in this project.

## Tool for each job

- Vite+ (`vp`) owns installs, package scripts, lint, format, unit tests, and git hooks.
- `@cloudflare/oxlint-config` supplies the lint rules. The `lint` block in `vite.config.ts` spreads it and adds the project rules.
- pnpm is the package manager under `vp`. `vp install` runs it.
- The Cloudflare CLI (`cf`) owns dev, build, preview deploys, and deploys. `cf` runs `astro dev` and `astro build`.
- `astro check` owns type checks.
- Playwright owns end-to-end tests.

## Rules

- Install with `vp install`. Do not run `pnpm` directly.
- If a job has a package script, run the script with `vp run`, for example `vp run lint` or `vp run build`. The scripts are in `package.json`.
- If a job has no script, run the tool with `vp exec`, for example `vp exec cf previews deploy`.
- Do not run `vp dev`, `vp build`, `vp preview`, or `vp check`. They are Vite+ commands, not the package scripts. Use `vp run dev`, `vp run build`, `vp run preview`, or `vp run check`.
- To turn on a lint rule from `presetRulesPendingMigration` in `vite.config.ts`, remove it from the list, fix its findings, and commit the rule alone.
- Do not add Wrangler or a Wrangler config file. `cloudflare.config.ts` is the only Worker config.
- Do not use `turbo`. The package scripts and `vp` replace it.
- Do not use Husky or lint-staged. The `staged` block in `vite.config.ts` and `.vite-hooks/` replace them.

## Deploys

Read the "Deploys" section of [`.github/CONTRIBUTING.md`](../../.github/CONTRIBUTING.md) before a deploy, a rollback, or a dashboard change.

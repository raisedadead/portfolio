# Tooling

This guide tells you which tool owns each job in this project.

## Tool for each job

- Vite+ (`vp`) owns lint, format, unit tests, and git hooks.
- The Cloudflare CLI (`cf`) owns dev, build, preview deploys, and deploys. `cf` runs `astro dev` and `astro build`.
- `astro check` owns type checks.
- Playwright owns end-to-end tests.
- pnpm owns installs and runs the package scripts.

## Rules

- If a job has a package script, run the script, for example `pnpm lint` or `pnpm build`. The scripts are in `package.json`.
- If a job has no script, run the tool with `pnpm exec`, for example `pnpm exec cf previews deploy`.
- Do not run `vp dev`, `vp build`, or `vp preview`. They run plain Vite, not Astro.
- Do not add Wrangler or a Wrangler config file. `cloudflare.config.ts` is the only Worker config.
- Do not use `turbo`. The package scripts and `vp` replace it.
- Do not use Husky or lint-staged. The `staged` block in `vite.config.ts` and `.vite-hooks/` replace them.

## Deploys

Read the "Deploys" section of [`.github/CONTRIBUTING.md`](../../.github/CONTRIBUTING.md) before a deploy, a rollback, or a dashboard change.

# Cloudflare docs

This guide lists the Cloudflare doc pages that this project uses, and tells you how to read them.

## Read a page

1. Find the page in the lists below.
1. Fetch the page as Markdown. Add `/index.md` to the URL, or send the `Accept: text/markdown` header.
1. If the lists do not have the page, run `vp exec cf docs search "<question>"`.
1. If the search does not find it, read the index for the product, for example `https://developers.cloudflare.com/workers/llms.txt`.
1. If you need a skill or an MCP server for Cloudflare, read [Docs for agents](https://developers.cloudflare.com/docs-for-agents/index.md).

Do not read `llms-full.txt` files. They are too large for one task.

Do not follow a `wrangler` step in a guide. Use the `cf` equivalent from the [Wrangler to cf reference](https://developers.cloudflare.com/cf/wrangler/reference/index.md).

## Cloudflare CLI and `cloudflare.config.ts`

- [Develop, build, and deploy](https://developers.cloudflare.com/cf/projects/index.md): `cf dev`, `cf build`, `cf deploy --prebuilt`, modes, and previews.
- [Programmatic configuration](https://developers.cloudflare.com/cf/projects/cloudflare-config/index.md): `defineConfig`, `bindings.*`, and modes.
- [Configuration explorer](https://developers.cloudflare.com/cf/projects/config-explorer/index.md): each typed field of `cloudflare.config.ts`.
- [Environment variables](https://developers.cloudflare.com/cf/environment-variables/index.md): the variables that `cf` reads.
- [Use cf with coding agents](https://developers.cloudflare.com/cf/agents/index.md): `cf cli search` and `cf schema`.
- [Use cf in CI](https://developers.cloudflare.com/cf/ci/index.md): API tokens and non-interactive runs.

## Build and framework

- [Astro on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/index.md): the Astro adapter.
- [Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/index.md): the plugin that `@astrojs/cloudflare` uses.
- [Vite+ on Workers](https://developers.cloudflare.com/workers/vite-plugin/vite-plus/index.md): how Vite+ and `cf` share the work.
- [Static Assets](https://developers.cloudflare.com/workers/static-assets/index.md): `assets.runWorkerFirst` and the `ASSETS` binding.
- [Bindings per development mode](https://developers.cloudflare.com/workers/local-development/bindings-per-env/index.md): local and remote bindings in `cf dev`.

## Deploys and previews

- [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/index.md) and [its configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/index.md): the build and deploy commands.
- [Previews](https://developers.cloudflare.com/workers/previews/index.md) and [preview resources](https://developers.cloudflare.com/workers/previews/resources/index.md): Worker Previews and their staging data.
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/index.md): the `mrugesh.dev` domain.
- [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/index.md): `EMDASH_ENCRYPTION_KEY`.
- [Compatibility flags](https://developers.cloudflare.com/workers/configuration/compatibility-flags/index.md): `nodejs_compat` and the compatibility date.

## Storage

- [D1 Workers Binding API](https://developers.cloudflare.com/d1/worker-api/index.md): the `DB` binding.
- [D1 read replication](https://developers.cloudflare.com/d1/best-practices/read-replication/index.md): the D1 Sessions API. Read it only if you set `session` in `d1()`.
- [D1 import and export](https://developers.cloudflare.com/d1/best-practices/import-export-data/index.md): backups and data moves.
- [KV API](https://developers.cloudflare.com/kv/api/index.md): the `SESSION` binding.
- [R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/index.md): the `MEDIA` binding.
- [R2 local development](https://developers.cloudflare.com/r2/local-development/index.md): local media state.

## Observability

- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/index.md): invocation logs.
- [Traces](https://developers.cloudflare.com/workers/observability/traces/index.md): Worker traces.
- [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/index.md): a review list for Worker code.

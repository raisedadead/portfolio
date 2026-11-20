# EmDash docs

This guide tells you how to look up EmDash documentation, and lists the pages that this project uses.

## Look up a fact

Use the `emdash-docs` MCP server to verify an EmDash API, hook, config option, or pattern. Prefer the docs MCP over your training data. The docs show the current published behaviour.

This repo does not configure the `emdash-docs` server. If your session does not have it, call its `search_docs` tool with `curl`:

```bash
curl -sL -X POST https://docs.emdashcms.com/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_docs","arguments":{"query":"<question>","max_results":4}}}'
```

## Pages for this project

- [Configuration reference](https://docs.emdashcms.com/reference/configuration/): the `emdash()`, `d1()`, and `r2()` options.
- [Deploy to Cloudflare](https://docs.emdashcms.com/deployment/cloudflare/): the bindings that EmDash needs.
- [Database options](https://docs.emdashcms.com/deployment/database/): the `d1()` options.
- [Core database migrations](https://docs.emdashcms.com/deployment/core-migrations/): migrations after an upgrade.
- [Media library](https://docs.emdashcms.com/guides/media-library/): media storage and the `Image` component.
- [SEO](https://docs.emdashcms.com/guides/seo/): head metadata, sitemaps, and `robots.txt`.
- [AI tools](https://docs.emdashcms.com/guides/ai-tools/) and [MCP server reference](https://docs.emdashcms.com/reference/mcp-server/): the MCP server of the site at `/_emdash/api/mcp`.
- [REST API](https://docs.emdashcms.com/reference/rest-api/): the admin API that `scripts/import-articles-to-emdash.mjs` and `scripts/prepare-e2e-state.mjs` call.

## Rules

- Keep `emdash` and `@emdash-cms/cloudflare` on the same version.
- Do not change the value of **Settings > SEO > robots.txt** or **Disallow AI training**. The route `src/pages/robots.txt.ts` replaces the EmDash `robots.txt`, so those settings have no effect.
- Do not follow a `wrangler` step in an EmDash guide. Read [`cloudflare.md`](cloudflare.md) for the `cf` equivalent.

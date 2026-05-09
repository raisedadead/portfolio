# CMS setup runbook

Operator runbook for first-time provisioning of the in-repo CMS that
ships under `/admin/*` + `/api/cms/*`. Read once before deploy; you do
not need to re-run any of this between commits.

## Prerequisites

- Cloudflare account with Workers + R2 + KV + Cloudflare One (Access).
- `pnpm`, `wrangler` (already in dev deps).
- A Cloudflare One Zero Trust tenant (free tier is fine). The CMS gate
  uses Cloudflare Access; team domain example: `mrugesh.cloudflareaccess.com`.

---

## 1. Provision the KV namespace for the post-index cache

`/api/cms/posts` reads from a KV-backed dashboard list cache (`CMS_INDEX`).
Create the namespace and paste its id into `wrangler.jsonc`:

```bash
wrangler kv namespace create CMS_INDEX
# → output includes:
#   { binding = "CMS_INDEX", id = "<namespace-id>" }
```

Open `wrangler.jsonc` and replace the placeholder id (`cms-index-placeholder-replace-before-deploy`)
with the real namespace id under `kv_namespaces[]`. Commit the change.

> Restart trigger: editing `wrangler.jsonc` requires a `pnpm develop`
> restart so wrangler reloads the binding map.

---

## 2. Configure the Cloudflare Access self-hosted application

In the Cloudflare dashboard:

1. **Zero Trust → Access → Applications → Add application → Self-hosted.**
2. **Application domain.** Apply to two paths on `mrugesh.dev`:
   - `mrugesh.dev/admin*`
   - `mrugesh.dev/api/cms*`
3. **Identity providers.** Enable at least one (Google, GitHub, or
   one-time-pin email). The CMS gate verifies the identity's `email`
   claim against the single-author allowlist set below.
4. **Policies.** Single rule: `Include → Emails → hi@mrugesh.dev`.
5. Save and grab the **Application AUD tag** (64-char hex) shown on the
   application overview page.

---

## 3. Set the runtime secrets

The Worker reads four runtime values from the `env` binding:

| key                      | source            | example                            |
| ------------------------ | ----------------- | ---------------------------------- |
| `CF_ACCESS_TEAM_DOMAIN`  | CF Zero Trust UI  | `mrugesh.cloudflareaccess.com`     |
| `CF_ACCESS_AUD`          | Application page  | `d9f1a8d2c3b4e5f60718293a4b5c6d7e` |
| `CF_ACCESS_AUTHOR_EMAIL` | allowlist single  | `hi@mrugesh.dev`                   |
| `DEPLOY_HOOK_URL`        | CF Workers Builds | `https://api.cloudflare.com/...`   |

Locally — populate `.env` (single source, gitignored). `pnpm develop`
regenerates `.dev.vars` from these via `scripts/sync-dev-vars.mjs`.

In production — push them with `wrangler secret put`:

```bash
wrangler secret put CF_ACCESS_TEAM_DOMAIN
wrangler secret put CF_ACCESS_AUD
wrangler secret put CF_ACCESS_AUTHOR_EMAIL
wrangler secret put DEPLOY_HOOK_URL
```

Each command prompts for the value once (it is never logged). The
secrets land in the Workers secret store per-Worker; they never appear
in `wrangler.jsonc`.

> **Never** put `DEV_BYPASS_ACCESS=1` into the secret store. The dev
> bypass is gated on `import.meta.env.DEV` and only meaningful in your
> local `astro dev`. Production builds drop the literal entirely
> (V15 invariant).

---

## 4. Get the deploy webhook URL

1. **Workers & Pages → portfolio → Builds → Deploy hooks → Create deploy hook.**
2. Name it `cms-publish`, branch `main`.
3. Copy the URL — it is the only credential, treat it like a password.
4. `wrangler secret put DEPLOY_HOOK_URL` and paste.

The CMS publish action POSTs JSON `{ reason, firedAt }` to this URL,
which kicks off a fresh Workers Build and redeploys the site from R2.

---

## 5. First deploy

```bash
pnpm build      # produces dist/server with the new bindings
pnpm deploy     # wrangler deploy — uses the CMS_INDEX id you set in step 1
```

Visit `https://mrugesh.dev/admin`. Cloudflare Access will redirect you
to the IDP, then back to `/admin` once the JWT cookie is set. The post
list should populate from `articles-content-prd` and the `Publish &
deploy` button should be available on any draft.

---

## Troubleshooting

| symptom                                                 | cause / fix                                                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/admin` returns 401 with `missing_token`               | Access policy not yet applied OR identity is logged out — re-auth at the Access app URL.                        |
| `/admin` returns 401 with `wrong_email`                 | Logged-in identity is not on the allowlist. Check `CF_ACCESS_AUTHOR_EMAIL` matches the IDP claim.               |
| `/api/cms/posts` returns 503 `cms_not_configured`       | `CMS_INDEX` KV binding is missing — re-run step 1 and redeploy.                                                 |
| Publish returns 502 `hook_failed` or `hook_unreachable` | `DEPLOY_HOOK_URL` is wrong, expired, or the build hook was deleted. Re-run step 4.                              |
| Post saves succeed but blog index does not update       | Publish was not fired; or the Workers Build did not pick up the new R2 content (rare — check builds dashboard). |

---

## Rollback

If the CMS surface needs to be rolled back, see `docs/cms-rollback.md`.

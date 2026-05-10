# CMS post-merge setup

Steps to make `/admin` functional after merging `refactor/cms` to `main`.
Cloudflare Access app is assumed already provisioned (`mrugesh.dev/admin*`

- `mrugesh.dev/api/cms*`, allowlist `hi@mrugesh.dev`).

Public site stays up throughout — gate failures are author-only.

## 1. Runtime secrets

```bash
wrangler secret put CF_ACCESS_TEAM_DOMAIN   # e.g. mrugesh.cloudflareaccess.com
wrangler secret put CF_ACCESS_AUD           # 64-char AUD tag from the app
wrangler secret put CF_ACCESS_AUTHOR_EMAIL  # hi@mrugesh.dev
wrangler secret put DEPLOY_HOOK_URL         # from step 2
```

Take effect immediately, no redeploy needed.

Never push `DEV_BYPASS_ACCESS` — production builds drop it; it's local-only.

## 2. Deploy hook

CF dashboard → Workers & Pages → portfolio → Settings → Build → Deploy
hooks → Create. Name `cms-publish`, branch `main`. The URL is the
credential — treat it like a password.

## 3. Preview URL Access (optional)

To gate `<version>-portfolio.<account>.workers.dev` previews with the same
allowlist as production:

CF dashboard → Workers & Pages → portfolio → Settings → Domains & Routes
→ **Enable Cloudflare Access for Preview URLs** → configure policy with
the same `hi@mrugesh.dev` allowlist. Copy the new app's AUD tag.

Append the preview AUD to `CF_ACCESS_AUD` (the verifier accepts a
comma-separated list — order doesn't matter):

```bash
wrangler secret put CF_ACCESS_AUD
# paste: <prod-aud>,<preview-aud>
```

The Worker also enforces a defense-in-depth host allowlist via the
`CF_ACCESS_ALLOWED_HOSTS` var in `wrangler.jsonc` — `mrugesh.dev` plus
the per-version preview pattern. Hits to guarded paths from any other
host return a generic 404.

## 4. Smoke test

```bash
curl -i https://mrugesh.dev/admin            # 401 missing_token (no cookie)
curl -I https://mrugesh.dev/blog             # 200 (public unchanged)
open https://mrugesh.dev/admin               # IdP round-trip → post list
```

In the admin UI: New → write → Save → uncheck Draft → Publish & deploy.
The deploy hook fires; Workers Build redeploys; the post appears on the
public blog within ~30–60 s.

## Failure modes

| symptom                           | fix                                              |
| --------------------------------- | ------------------------------------------------ |
| `/admin` 200 with static 404 body | redeploy — `assets.run_worker_first` not applied |
| 401 `wrong_email`                 | IdP email ≠ `CF_ACCESS_AUTHOR_EMAIL`             |
| 401 `wrong_aud`                   | secret AUD ≠ Access app AUD                      |
| 401 `unknown_kid`                 | `CF_ACCESS_TEAM_DOMAIN` typo or wrong tenant     |
| publish 503 `hook_not_configured` | `DEPLOY_HOOK_URL` secret missing                 |
| publish 502 `hook_failed`         | hook URL stale — recreate, re-`secret put`       |
| `/admin` 404 on a preview URL     | host outside `CF_ACCESS_ALLOWED_HOSTS` — adjust  |

# CMS rollback runbook

If the in-repo CMS, R2 loader, or Cloudflare Access gate is misbehaving
in production, this runbook reverts the site to a known-good state. The
goal is **fastest path to a working public blog** — a degraded author
surface is acceptable for the duration of the incident.

Triage tier first. Most failures only need step 1 or step 2; the full
revert (steps 3+) is reserved for the case where the public site is
broken, not just the author surface.

---

## Step 0 — establish the failure mode

| Symptom                                | Likely tier     |
| -------------------------------------- | --------------- |
| `/admin` 5xx, public site OK           | Tier 1 (CMS)    |
| `/api/cms/*` 5xx, public site OK       | Tier 1 (CMS)    |
| Blog index empty / images 404          | Tier 2 (R2)     |
| Whole site 5xx                         | Tier 3 (revert) |
| Workers Builds CI red after CMS commit | Tier 3 (revert) |

Capture: timestamps, the PH4-\* commit shas in flight, the failing URL,
and a sample response body. Append to the on-call notes before touching
anything.

---

## Tier 1 — disable the CMS surface (public site stays up)

The public site does not depend on `/admin` or `/api/cms` at runtime —
only on the R2 loader at build time. If the gate is misbehaving you can
silence the surface without touching the public flow.

```bash
# 1. Open Cloudflare Zero Trust → Access → Applications.
# 2. Find the "mrugesh.dev/admin*" + "mrugesh.dev/api/cms*" application.
# 3. Either:
#      a. Disable the application — every CMS request 401s instantly, OR
#      b. Tighten the policy to "Block all" for a short window.
```

Deploy not required. Fastest path: ~30 seconds. Author UX is impacted
(can't log in); public reads are untouched.

To re-enable: flip the application back on once the underlying issue is
fixed. No code change needed.

---

## Tier 2 — revert the R2 image streamer / loader

Only relevant if the public blog is degraded (no images, empty index).
Roll back per-component before reaching for the full revert.

```bash
# Identify the offending change:
git log --oneline src/lib/r2-loader.ts src/pages/api/img/

# Revert the specific commit on the deployed branch (NEVER force push):
git revert <sha-of-broken-commit>
git push                          # user-owned step — confirm before running
# CI redeploys via Workers Builds.
```

Common roll-points:

- `src/pages/api/img/[...path].ts` (B10/B11/B13 history) — `wrangler.jsonc`
  `r2_buckets[].remote = true` is required for staging dev parity. Verify
  before reverting unrelated commits.
- `src/lib/r2-loader.ts` `renderMarkdown` integration (B12). Reverting
  this brings back empty post bodies — consider a forward-fix instead.

If the R2 bucket itself is stale (publish webhook fired but new content
isn't reachable), force-rebuild via `wrangler kv key delete cms:index:v1`
on the `CMS_INDEX` namespace and POST the deploy hook again.

---

## Tier 3 — full sprint revert (public site is broken)

Use only when steps 1–2 are insufficient. This restores the
articles-submodule path that pre-dated this sprint. Cost: ~30 minutes,
loses CMS authoring entirely until the next deploy.

### 3.1. Find the cutover commit

The R2 cutover landed in `chore(content): flip default loader to R2`
(see `git log --oneline --grep="flip default loader"`). Anything before
that commit ran on the submodule.

### 3.2. Revert the sprint to a known-good baseline

Pick the commit immediately before P1 opened (the last `main` commit on
the submodule path). On a new branch:

```bash
git checkout main
git checkout -b ops/cms-rollback
git revert --no-commit <sprint-start-sha>..HEAD   # range-revert P1..P5
# Resolve conflicts: prefer the older submodule-loader code.
git commit -m "revert: roll back CMS + R2 sprint (incident <id>)"
```

### 3.3. Restore the submodule

```bash
# Re-init the submodule. The articles repo is preserved at
# git@github.com:raisedadead/articles.git per D1.
git submodule add git@github.com:raisedadead/articles.git src/content/articles
git submodule update --init --recursive
git add .gitmodules src/content/articles
git commit -m "ops: re-add articles submodule for rollback"
```

### 3.4. Restore CI access to the submodule

In the GitHub Actions secrets, ensure `ARTICLES_PAT` is still valid
(read-only PAT scoped to `raisedadead/articles`). Then re-add the workflow
flags reverted in P2:

```yaml
# .github/workflows/{e2e,re-build,re-test}.yml — restore on the rollback branch
- uses: actions/checkout@v5
  with:
    submodules: true
    token: ${{ secrets.ARTICLES_PAT }}
```

### 3.5. Drop the CMS bindings from `wrangler.jsonc`

Remove `r2_buckets[ARTICLES]`, `kv_namespaces[CMS_INDEX]`, and
`assets.run_worker_first`. Keep the `SESSION` KV.

### 3.6. Redeploy

```bash
pnpm install
pnpm build       # Now uses the glob loader, not R2.
pnpm deploy      # user-owned — confirm before running.
```

Post-rollback checks:

- `/blog` lists 14 posts.
- `/blog/<any-known-slug>` renders body + cover.
- `/api/cms/*` returns 404 (route gone — confirms revert).
- Sentry shows no new errors after the redeploy.

### 3.7. Downgrade traffic if needed

If you need additional time to investigate, route traffic away from the
new Worker entirely:

```bash
# Cloudflare dashboard → Workers & Pages → portfolio → Triggers
# Pause the route or restore an earlier deployment from "Deployments".
```

The deployment history retains the pre-CMS Worker bundles. Pinning back
to one is a 5-second click and does not require a code revert.

---

## Forward-fix vs revert decision matrix

| Issue                                               | Pick           |
| --------------------------------------------------- | -------------- |
| 1 known commit, single regression, low blast radius | Forward-fix    |
| 5xx on public surface for >5 min                    | Tier 3 revert  |
| Author can't log in but public OK                   | Tier 1 silence |
| Workers Builds failing on every PR                  | Forward-fix    |
| Customer report of broken blog post                 | Tier 2 revert  |

Always prefer the smallest revert that restores public availability —
never bundle a revert with a forward-fix in the same commit. If both
are needed, ship them as two commits behind the same PR.

---

## After-action

Once the public site is stable, file a follow-up issue (or add to
`AUDIT.md`) capturing:

1. Failing commit sha and the shipped sprint task that introduced it.
2. The detection signal (CI red, customer report, Sentry alert).
3. The chosen tier and time-to-recovery.
4. The forward-fix plan, if any.

Update `references/DRIFT-CHECK.md` if the failure exposes a check that
should be added to phase boundaries.

---
title: 'How to delete GitHub Actions Caches with GitHub CLI'
date: 2022-11-02
cover: ../assets/images/how-to-delete-github-actions-caches-with-github-cli/cover.webp
tags:
  - github
  - cli
  - github-actions
---

GitHub Actions caches can grow stale. The GitHub CLI makes cleanup fast.

## List the caches

```bash
gh cache list --limit 100
```

## Delete them

```bash
gh cache delete --all
```

That is all you need for a clean slate.

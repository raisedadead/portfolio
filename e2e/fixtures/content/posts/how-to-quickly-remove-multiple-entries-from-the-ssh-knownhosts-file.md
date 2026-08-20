---
title: 'How to quickly remove multiple entries from the SSH known_hosts file'
date: 2023-01-15
cover: ../assets/images/how-to-quickly-remove-multiple-entries-from-the-ssh-knownhosts-file/cover.webp
tags:
  - ssh
  - devops
seo:
  title: 'Quickly delete multiple SSH known_hosts entries'
  description: 'Quickly remove multiple SSH known_hosts entries using a custom z-Shell fzf widget'
---

When you rebuild machines often, stale SSH host keys pile up in your `known_hosts` file.

## The quick fix

Remove a single entry with `ssh-keygen`:

```bash
ssh-keygen -R "hostname.example.com"
```

For bulk cleanup, list the entries first:

```
cat ~/.ssh/known_hosts | wc -l
```

Then use an fzf widget to select and delete interactively.

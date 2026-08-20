---
title: 'How to use a .dockerignore file: A comprehensive guide with examples'
date: 2023-03-20
cover: ../assets/images/how-to-use-a-dockerignore-file-a-comprehensive-guide-with-examples/cover.webp
tags:
  - docker
  - best-practices
---

A `.dockerignore` file keeps your Docker build context lean and your images small.

## A sensible default

```plaintext
node_modules
.git
*.log
```

Docker reads this file from the root of the build context before sending files to the daemon.

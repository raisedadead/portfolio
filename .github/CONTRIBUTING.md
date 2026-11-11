### Contributing

Thanks for checking out this codebase. I am grateful for your feedback, suggestions and contributions.

#### Getting started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

#### Local configuration

- Edit `cloudflare.config.ts` for Worker settings and bindings. The Cloudflare CLI and Astro adapter use pinned beta releases.
- Copy `env.example` to `.env` for local values. Keep secret values out of `cloudflare.config.ts`.
- Local D1, R2 and KV bindings use local data, not production data. Development retains `.cloudflare/state`; preview and end-to-end tests use separate state directories.
- `pnpm build` creates `.cloudflare/output`. `pnpm run deploy` builds and deploys it. `pnpm exec cf previews deploy` builds and deploys a Worker Preview for the current branch.

#### Deploys

- Workers Builds deploys `main` with `pnpm run do:deploy`. Other branches deploy a Worker Preview with `pnpm exec cf previews deploy`.
- Worker Previews use separate staging data. `node scripts/seed-preview-data.mjs` fills an empty staging database and bucket with the end-to-end test content.
- Do not change the Worker in the Cloudflare dashboard or with the API. The next deploy from `main` overwrites such a change. To restore the config now, start a main build:

  ```bash
  pnpm exec cf builds create cc20f4aaea3249688c2131e6b1ae11b8 --branch main
  ```

- To roll back, revert the commit with `git revert` and merge it. Do not roll back in the dashboard.

#### Found something broken?

Create an issue on the tracker [here](https://github.com/raisedadead/raisedadead/issues/new).

#### Have a something to contribute in code?

Send a pull request, and I will buy you a :coffee: or :beer:, if we meet IRL!

_Cheers, and happy contributing!_

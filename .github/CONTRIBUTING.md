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
- Local D1, R2 and KV bindings use local data, not production data. Development retains `.wrangler/state`; preview and end-to-end tests use separate state directories.
- `pnpm build` creates `.cloudflare/output`. `pnpm run deploy` builds and deploys it. `pnpm run versions:upload` builds and uploads a version without activating it.

#### Found something broken?

Create an issue on the tracker [here](https://github.com/raisedadead/raisedadead/issues/new).

#### Have a something to contribute in code?

Send a pull request, and I will buy you a :coffee: or :beer:, if we meet IRL!

_Cheers, and happy contributing!_

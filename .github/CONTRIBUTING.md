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

- Edit `void.config.ts` for Worker settings and bindings. Void generates `.void-wrangler.jsonc`; do not edit it.
- Copy `env.example` to `.env` for local values. Void reads only `.env`; it rejects `.dev.vars` and `.env.example`.
- Local D1, R2 and KV bindings use local data, not production data.

#### Found something broken?

Create an issue on the tracker [here](https://github.com/raisedadead/raisedadead/issues/new).

#### Have a something to contribute in code?

Send a pull request, and I will buy you a :coffee: or :beer:, if we meet IRL!

_Cheers, and happy contributing!_

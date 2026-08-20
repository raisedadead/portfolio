# portfolio

> Nothing fancy here, just my [portfolio website][personal-website].

## What is this about?

My personal website built with [Astro](https://astro.build) and React, deployed on [Cloudflare](https://cloudflare.com). It features my blog posts, projects, and a bit about me.

## Tech Stack

- **Framework**: [Astro](https://astro.build) (full SSR, no prerendered routes) with [React](https://react.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Animation**: [Motion](https://motion.dev)
- **Icons**: [Heroicons](https://heroicons.com)
- **Content**: [EmDash CMS](https://emdashcms.com) — posts in [Cloudflare D1](https://developers.cloudflare.com/d1/), media in [R2](https://developers.cloudflare.com/r2/), admin sessions in [KV](https://developers.cloudflare.com/kv/)
- **Rendering**: Portable Text bodies, code highlighted with [Shiki](https://shiki.style), fonts self-hosted through the [Astro Fonts API](https://docs.astro.build/en/guides/fonts/)
- **Testing**: [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react), with [Playwright](https://playwright.dev) for end-to-end
- **Tooling**: [Turborepo](https://turbo.build) with [oxlint and oxfmt](https://oxc.rs)
- **Monitoring**: [Sentry](https://sentry.io)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com) via [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- **Package Manager**: [pnpm](https://pnpm.io)

## Link

> ### <https://mrugesh.dev>

## Contributing

See [this guide](.github/CONTRIBUTING.md) for details.

## License

Code is licensed under the ISC License - see [LICENSE](./LICENSE) file for details.

Content is licensed under CC BY-NC-ND 4.0 - see [LICENSE-CC](./LICENSE-CC) file for details.

## Stats

![Repobeats][repobeats-img]

[personal-website]: https://mrugesh.dev
[repobeats-img]: https://repobeats.axiom.co/api/embed/7554011ecd870f9d366a22f913161e180165ec85.svg 'Repobeats analytics image'

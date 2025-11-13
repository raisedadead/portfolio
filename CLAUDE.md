# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Astro 5, React 19, and Tailwind CSS 4, deployed on Cloudflare Workers. Blog content is sourced from Hashnode using `astro-loader-hashnode`.

## Development Commands

### Setup
```bash
pnpm install           # Install dependencies (uses pnpm, required)
```

### Development
```bash
pnpm develop          # Start dev server (alias: pnpm dev)
pnpm build            # Production build
pnpm preview          # Preview production build locally (uses wrangler)
pnpm deploy           # Deploy to Cloudflare
```

### Testing
```bash
pnpm test                  # Run all tests once
pnpm test:watch            # Run tests in watch mode
pnpm test:watch:ui         # Run tests with Vitest UI
pnpm test:coverage         # Run tests with coverage report
pnpm test:update           # Update test snapshots
```

### Code Quality
```bash
pnpm lint              # Lint with oxlint
pnpm lint:fix          # Auto-fix lint issues
pnpm format            # Format code with prettier
pnpm format:check      # Check formatting
pnpm check             # Type-check with Astro
```

### Turbo Commands
All above commands can be prefixed with `turbo:` for optimized caching (e.g., `pnpm turbo:build`). Turbo is configured with remote caching support.

### Cloudflare Workers
```bash
pnpm cf-typegen        # Generate Cloudflare Workers types
```
This runs automatically after `pnpm install` and is a dependency for build/develop tasks.

## Architecture

### Tech Stack
- **Framework**: Astro 5 (SSR mode) with React 19 islands
- **Styling**: Tailwind CSS 4 with custom brutalist design system
- **Animation**: Motion (motion/react) for React components
- **Deployment**: Cloudflare Workers (adapter: @astrojs/cloudflare)
- **Content**: Hashnode CMS via astro-loader-hashnode
- **Testing**: Vitest + React Testing Library + happy-dom
- **Monitoring**: Sentry (client + server)
- **Build Tool**: Turbo (monorepo caching)

### Key Files
- `astro.config.mjs` - Astro configuration with Cloudflare adapter, Sentry integration, React
- `wrangler.jsonc` - Cloudflare Workers deployment config
- `src/content/config.ts` - Content collections (blog posts from Hashnode)
- `src/layouts/base-layout.astro` - Root HTML layout with font loading strategy
- `src/layouts/main-layout.astro` - Main page wrapper with Background component
- `src/components/background/` - Animated canvas background (waves + birds + grain) with layered architecture
- `turbo.json` - Turborepo task pipeline and caching config

### Directory Structure
```
src/
├── components/       # React components
│   ├── background/  # Animated background (gradient, canvas, waves, birds)
│   ├── blog/        # Blog-specific components
│   ├── forms/       # Form components
│   ├── layout/      # Nav, Footer, Profile
│   ├── sentry/      # Error boundary
│   └── ui/          # Reusable UI components
├── content/         # Content collections config
├── layouts/         # Astro layouts (base, main)
├── lib/             # Utilities (cn, utils, etc.)
├── pages/           # Astro routes
├── styles/          # Global CSS (Tailwind config)
├── types/           # TypeScript type definitions
└── __tests__/       # Test files
```

### Path Aliases
- `@/*` → `./src/*` (configured in tsconfig.json and vitest.config.ts)

### Content Management
Blog posts are loaded from Hashnode (mrugesh.hashnode.dev) using `astro-loader-hashnode`. The loader fetches posts at build time and stores them in the content layer. Access via `getCollection('blog')`.

### View Transitions
Uses Astro's native view transitions (`<ClientRouter />`) with `transition:persist` for background animation. The Background component persists across page navigations.

### Background Canvas Performance
The Background component (`src/components/background/`) has a layered architecture with specific optimization:
- **Gradient Layer**: Static CSS gradient background (z-1)
- **Canvas Layer**: Animated waves, birds, and grain texture (z-2)
- Uses `client:idle` directive for deferred hydration
- Canvas animations start after hydration with requestAnimationFrame
- Grain texture generated synchronously on initial load at 50% resolution
- Resize handling: immediate canvas dimension update, debounced grain regeneration (150ms)
- Canvas layer fades in with `motion` (opacity 0 → 1, duration 1.8s)

### Styling System
Uses Tailwind CSS 4 with custom brutalist design tokens in `src/styles/global.css`:
- Custom utility classes: `brutalist-button`, `brutalist-card`, `brutalist-input`
- Hard-edge shadows: `--shadow-brutal-{sm,md,lg,xl}`
- Font loading: Critical fonts preloaded, non-critical lazy loaded via FontFace API
- Custom color tokens with semantic aliases

### React 19 Compatibility
Uses `react-dom/server.edge` in production (not `react-dom/server.browser`) to avoid MessageChannel polyfill issues. Configured in `astro.config.mjs` vite.resolve.alias.

### TypeScript Configuration
- Strict mode enabled
- JSX runtime: react-jsx
- Module resolution: bundler (Vite)
- Extends: astro/tsconfigs/strict

### Testing Setup
- Environment: happy-dom
- Pool: forks (required for stability)
- Setup file: vitest.setup.ts
- Coverage: v8 provider with html/json reports
- Globals enabled for describe/it/expect

### Deployment
Deployed to Cloudflare Workers using wrangler:
- Preview via `pnpm preview` (wrangler dev)
- Deploy via `pnpm deploy` (wrangler deploy)
- Custom domain: mrugesh.dev
- Assets binding for static files
- Smart placement mode enabled

### Environment Variables
See `.env.example` for required variables:
- Sentry: PUBLIC_SENTRY_DSN, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT
- Turbo: TURBO_API, TURBO_TEAM, TURBO_TOKEN, TURBO_REMOTE_CACHE_SIGNATURE_KEY

### Sentry Integration
Sentry MUST be the first integration in `astro.config.mjs` to wrap other integrations. Source maps are uploaded automatically when SENTRY_AUTH_TOKEN is set. Request handler auto-instrumentation is disabled for Cloudflare Workers compatibility.

## Code Standards

### TypeScript
- Use strict types, never `any`
- Leverage path alias `@/*` for imports
- Follow Astro's TypeScript conventions

### React Components
- Use functional components with hooks
- Client directives: `client:idle` for most components, `client:visible` for below-fold
- Use `motion/react` for animations (not framer-motion)
- Prefer React 19 features (use hook, useActionState, etc.)

### Styling
- Use Tailwind utilities first
- Use brutalist utility classes for consistent design
- Avoid inline styles except for dynamic values (e.g., canvas styles)

### Git Workflow
- Husky pre-commit hooks run lint-staged (oxlint + prettier)
- Conventional commits encouraged
- Main branch: `main`

### Linting
- Uses oxlint (fast Rust-based linter)
- Config: `.oxlintrc.json`
- Auto-fix available via `pnpm lint:fix`

### Package Manager
**REQUIRED**: Use `pnpm` only (enforced by packageManager field). Do not use npm or yarn.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Astro 5, React 19, and Tailwind CSS 4, deployed on Cloudflare Workers. Blog content sourced from Hashnode using `astro-loader-hashnode` loader.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server
pnpm develop

# Build for production (auto-generates Cloudflare types)
pnpm build

# Preview production build locally
pnpm preview

# Deploy to Cloudflare
pnpm deploy

# Linting and formatting
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check

# Testing
pnpm test                 # Run all tests
pnpm test <file-path>     # Run single test file
pnpm test:coverage       # Run with coverage report
pnpm test:watch          # Watch mode
pnpm test:watch:ui       # Watch with UI
pnpm test:update         # Update snapshots

# Type checking
pnpm check               # Run Astro type checker

# Lighthouse performance auditing
pnpm lighthouse          # Collect metrics
pnpm lighthouse:assert   # Run assertions

# Cloudflare type generation
pnpm cf-typegen          # Runs automatically on postinstall and prebuild

# CI/Automated scripts (use turbo: prefix with dotenv)
pnpm turbo:build
pnpm turbo:test
pnpm turbo:lint
# ... other turbo: prefixed commands available
```

## Architecture

### Tech Stack
- **Framework**: Astro 5 with SSR adapter for Cloudflare Workers
- **UI**: React 19 components with Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: Heroicons
- **Content**: Astro Content Collections with Hashnode loader
- **Testing**: Vitest with React Testing Library and happy-dom
- **Deployment**: Cloudflare Workers with Smart Placement

### Project Structure

```
src/
├── components/         # React components (.tsx)
│   ├── blog/          # Blog-specific components (BentoGrid, BlogCard, BlogSearch)
│   └── ...            # Shared UI components
├── layouts/           # Astro layouts (base-layout, main-layout)
├── pages/             # Astro pages (file-based routing)
│   ├── api/          # API endpoints (health.ts, ping.ts)
│   └── blog/         # Blog pages ([slug].astro, index.astro)
├── content/           # Content collections config (Hashnode loader)
├── lib/               # Utilities (blog-utils, formatDate, image-optimizer, syntax-highlighter)
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── __tests__/         # Test files
    ├── unit/          # Unit tests
    ├── integration/   # Integration tests
    ├── components/    # Component tests
    └── pages/         # Page tests
```

### Key Technical Details

**Layout Hierarchy**: Layouts nest as **Page → MainLayout → BaseLayout**. Pages only import MainLayout, which wraps BaseLayout internally. BaseLayout handles HTML structure and SEO, MainLayout adds Nav/Footer/Background. MainLayout accepts a `variant` prop ('main', 'prose', 'legal') that only affects content wrapper styling.

**Path Aliases**: Use `@/*` for `./src/*` imports (configured in tsconfig.json and vitest.config.ts)

**React 19 Setup**: Production builds use `react-dom/server.edge` alias to avoid MessageChannel polyfill requirements (see astro.config.mjs:42)

**Blog System**:
- Content loaded via `astro-loader-hashnode` from mrugesh.hashnode.dev (max 1000 posts)
- Bento grid layout uses `getBentoGridSpan()` for alternating card sizes (6-pattern cycle, see lib/blog-utils.ts:20)
- Supports search, tag filtering, and pagination with "Load More" functionality
- Tag utilities: `getAllTags()`, `getTagsWithCount()`, `filterPostsByTag()`, `getTagBySlug()`

**Image Handling**:
- Cloudflare compile-time image service
- Remote images allowed from cdn.hashnode.com
- Custom image optimizer in `lib/image-optimizer.ts`

**API Routes**:
- Health check: `/api/health`
- Ping endpoint: `/api/ping`

**Cloudflare Configuration**:
- Workers compatibility_date: 2025-06-16
- nodejs_compat enabled
- Smart Placement mode
- Observability enabled
- Custom domains: mrugesh.dev, www.mrugesh.dev

**TypeScript**: Strict mode with Astro strict config, no `any` types allowed

**Testing**:
- Environment: happy-dom with React Testing Library
- Test files: `*.test.ts`, `*.test.tsx`, `*.spec.ts`
- Coverage excludes: node_modules, dist, coverage, config files, __tests__, __mocks__

**Lighthouse CI**:
- Tests pages: home, /blog, /about, and specific blog posts
- Runs 3 times per URL for consistency
- Config: `.github/lighthouse/lhci.json`

**Husky & lint-staged**: Auto-formats JS/TS/Astro files and runs ESLint on pre-commit

## Package Management

- **Package Manager**: pnpm (v10.19.0)
- Use `pnpm add <package>` to install dependencies
- Use `pnpm add -D <package>` for dev dependencies
- Check for latest versions before adding packages
- Only built dependencies: @tailwindcss/oxide, esbuild, sharp, workerd

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Mrugesh Mohapatra built with Astro + React, deployed on Cloudflare Pages. Features static site generation with partial hydration for optimal performance.

## Key Commands

```bash
# Development
pnpm develop         # Start dev server (astro dev)
pnpm build          # Build for production
pnpm preview        # Build and preview with wrangler
pnpm deploy         # Build and deploy to Cloudflare

# Code Quality
pnpm lint           # Run ESLint
pnpm lint:fix       # Fix ESLint issues
pnpm format         # Format with Prettier
pnpm format:check   # Check formatting

# Testing
pnpm test           # Run all tests once
pnpm test:watch     # Watch mode for all tests
pnpm test:watch:ui  # Vitest UI
pnpm test:update    # Update snapshots

# Run single test file
pnpm test:watch -- --run src/__tests__/components/nav.test.tsx

# Cloudflare
pnpm cf-typegen     # Generate Cloudflare types (auto-runs on postinstall)
pnpm exec wrangler  # Access wrangler CLI commands
```

## Architecture

### Tech Stack

- **Framework**: Astro 5 with React 19 integration for interactive components
- **Content**: Astro Content Layer API with `astro-loader-hashnode` for blog posts from hn.mrugesh.dev
- **Styling**: Tailwind CSS v4 with Vite plugin
- **Deployment**: Cloudflare Pages with edge runtime
- **Testing**: Vitest with React Testing Library and happy-dom environment

### Key Patterns

1. **Partial Hydration**: React components use `client:idle` or `client:load` directives for selective hydration
2. **Type Safety**: Shared types in `/src/types/` with strict TypeScript (no `any` types)
3. **Content Collections**: Blog posts fetched at build time via Content Layer API, defined in `/src/content.config.ts`
4. **Error Boundaries**: All pages handle loading and error states with proper fallbacks
5. **Performance**: Static generation with edge delivery, inlined critical CSS

### Testing Strategy

- Component tests in `__tests__/` directory mirroring source structure
- Test utilities in `src/__tests__/test-utils.ts` for common setup
- Global test setup in `vitest.setup.ts`
- Coverage reports exclude test files and config
- Tests focus on user interactions, accessibility, and component behavior

### Development Workflow

1. **Pre-commit Hooks**: Husky runs ESLint and Prettier via lint-staged on staged files
2. **Type Generation**: Cloudflare types auto-generated on postinstall and prebuild
3. **Build Process**: TypeScript compilation → Astro build → Cloudflare worker generation
4. **Local Preview**: Uses wrangler dev to simulate Cloudflare edge environment

## Important Notes

- **React 19 Compatibility**: Production builds require `react-dom/server.edge` alias (configured in astro.config.mjs)
- **Cloudflare KV**: SESSION binding required for deployment (configured in wrangler.jsonc)
- **Image Optimization**: Uses Cloudflare's compile service for images
- **Content Source**: Blog posts fetched from Hashnode publication at build time
- **Package Manager**: Uses pnpm with specific built dependencies for native modules
- **Path Aliases**: `@/` maps to `./src/` directory in tests and components

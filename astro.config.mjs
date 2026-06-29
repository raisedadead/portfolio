import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';
// eslint-disable-next-line import/default -- False positive: @sentry/astro exports default via conditional exports
import sentry from '@sentry/astro';

export default defineConfig({
  site: 'https://mrugesh.dev',

  prefetch: true,

  // workaround: withastro/astro#15802 — null driver stops adapter injecting SESSION KV binding (deploy error 10210)
  session: {
    driver: { entrypoint: 'unstorage/drivers/null' }
  },

  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: 'node',
    // CI builds run unauthenticated; skip the remote-proxy session that
    // `remote: true` on the R2 binding would otherwise trigger during
    // `astro build`. Local dev keeps the default (true) so E2E hits the
    // real staging bucket — see RCA B10.
    remoteBindings: !process.env.CI
  }),

  integrations: [
    // Sentry MUST be first to wrap other integrations
    sentry({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        disable: !process.env.SENTRY_AUTH_TOKEN,
        rewriteSources: (source) => {
          return source.replace(/^.*\/dist\//, '~/dist/');
        }
      },
      unstable_sentryVitePluginOptions: {
        release: {
          name: process.env.PUBLIC_SENTRY_RELEASE || 'dev'
        }
      },
      autoInstrumentation: {
        requestHandler: false // Disabled for Cloudflare Workers
      }
    }),
    react(),
    sitemap({
      lastmod: new Date(),
      changefreq: 'weekly',
      priority: 1,
      filter: (page) => {
        return (
          !page.includes('/terms') &&
          !page.includes('/refunds') &&
          !page.includes('/privacy') &&
          !page.includes('/blog/tag/')
        );
      }
    })
  ],

  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        ? {
            'react-dom/server': 'react-dom/server.edge'
          }
        : undefined
    },

    plugins: [tailwindcss()]
  },

  build: {
    inlineStylesheets: 'auto'
  },

  image: {
    // R2-hosted images stream from /api/img/[...path] under the same
    // origin (`mrugesh.dev`). The freeCodeCamp covers continue to render
    // via raw <img> tags from the RSS feed, so they do not need an
    // entry here — `image.remotePatterns` only governs Astro's <Image>
    // component, not bare <img> elements.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mrugesh.dev'
      }
    ]
  },

  fonts: [
    {
      provider: fontProviders.local(),
      fallbacks: [],
      name: 'Inter',
      cssVariable: '--font-inter',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/inter/inter-400.woff2'] },
          { weight: 600, style: 'normal', src: ['./src/assets/fonts/inter/inter-600.woff2'] },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/inter/inter-700.woff2'] }
        ]
      }
    },
    {
      provider: fontProviders.local(),
      fallbacks: [],
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/space-grotesk/space-grotesk-400.woff2'] },
          { weight: 600, style: 'normal', src: ['./src/assets/fonts/space-grotesk/space-grotesk-600.woff2'] },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/space-grotesk/space-grotesk-700.woff2'] }
        ]
      }
    },
    {
      provider: fontProviders.local(),
      fallbacks: [],
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/jetbrains-mono/jetbrains-mono-400.woff2'] }
        ]
      }
    }
  ]
});

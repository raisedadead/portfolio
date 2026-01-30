import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';
// eslint-disable-next-line import/default -- False positive: @sentry/astro exports default via conditional exports
import sentry from '@sentry/astro';

export default defineConfig({
  site: 'https://mrugesh.dev',

  prefetch: true,

  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true
    }
  }),

  integrations: [
    // Sentry MUST be first to wrap other integrations
    sentry({
      sourceMapsUploadOptions: {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        enabled: !!process.env.SENTRY_AUTH_TOKEN,
        release: {
          name: process.env.PUBLIC_SENTRY_RELEASE || 'dev'
        },
        cleanArtifacts: true,
        rewriteSources: (source) => {
          // Normalize paths for Sentry UI
          return source.replace(/^.*\/dist\//, '~/dist/');
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com'
      },
      {
        protocol: 'https',
        hostname: 'www.freecodecamp.org'
      },
      {
        protocol: 'https',
        hostname: 'cdn.freecodecamp.org'
      }
    ]
  }
});

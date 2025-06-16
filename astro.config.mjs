import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://mrugesh.dev',
  adapter: cloudflare({
    imageService: 'compile',
    runtime: {
      mode: 'remote'
    },
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    sitemap({
      lastmod: new Date(),
      changefreq: 'monthly',
      priority: 1,
      filter: (page) => {
        return (
          !page.includes('/terms') &&
          !page.includes('/refunds') &&
          !page.includes('/privacy')
        );
      }
    })
  ],

  vite: {
    build: {
      minify: false
    },
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        ? {
            'react-dom/server': 'react-dom/server.edge'
          }
        : undefined
    }
  },

  build: {
    inlineStylesheets: 'auto'
  },

  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com'
      }
    ]
  }
});

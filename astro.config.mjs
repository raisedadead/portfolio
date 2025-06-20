import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mrugesh.dev',
  prefetch: true,
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
    sitemap({
      lastmod: new Date(),
      changefreq: 'monthly',
      priority: 1,
      filter: (page) => {
        return !page.includes('/terms') && !page.includes('/refunds') && !page.includes('/privacy');
      }
    })
  ],

  vite: {
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
      }
    ]
  }
});

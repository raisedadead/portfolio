// @ts-check
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from './src/env/server.mjs';

import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';

const isProductionBuild = process.env.NODE_ENV === 'production';
const shouldOpenAnalyzer = process.env.OPEN_ANALYZER === 'true';
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

const nextConfig = defineNextConfig({
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com'
      }
    ]
  },
  redirects: async () => {
    return [
      {
        source: '/ama',
        destination: 'https://github.com/raisedadead/ama/discussions/14',
        basePath: false,
        permanent: false
      },
      {
        source: '/contact',
        destination: '/about',
        permanent: false
      },
      {
        source: '/dotfiles',
        destination: 'https://github.com/raisedadead/dotfiles',
        permanent: false
      },
      {
        source: '/links',
        destination: 'https://bio.link/mrugesh',
        basePath: false,
        permanent: false
      },
      {
        source: '/meet',
        destination: 'https://topmate.io/mrugesh',
        basePath: false,
        permanent: false
      },
      {
        source: '/meet/personal',
        destination:
          'https://cal.com/mrugesh/meet?duration=30&layout=month_view',
        basePath: false,
        permanent: false
      },
      {
        source: '/meet/freecodecamp',
        destination: 'https://calendar.app.google/AfQByQkijweg98736',
        basePath: false,
        permanent: false
      }
    ];
  }
});

const configSentry = withSentryConfig(nextConfig, {
  org: 'mrugesh',
  telemetry: false,
  project: 'portfolio-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  authToken: sentryAuthToken
});

const configAnalyzerAndSentry = withBundleAnalyzer({
  enabled: isProductionBuild,
  openAnalyzer: shouldOpenAnalyzer
})(configSentry);

const config = isProductionBuild ? configAnalyzerAndSentry : configSentry;
export default config;

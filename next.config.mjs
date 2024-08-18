// @ts-check
/**
 * @type {import('next').NextConfig}
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from './src/env/server.mjs';

import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import { Config } from 'next-recompose-plugins';
import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';

const config = new Config(() => ({
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
  redirects: async () => [
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
      destination: 'https://cal.com/mrugesh/meet?duration=30&layout=month_view',
      basePath: false,
      permanent: false
    },
    {
      source: '/meet/freecodecamp',
      destination: 'https://calendar.app.google/AfQByQkijweg98736',
      basePath: false,
      permanent: false
    }
  ]
}))
  .applyPlugin(
    (phase, _args, config) =>
      withBundleAnalyzer({ enabled: phase === PHASE_PRODUCTION_BUILD })(config),
    '@next/bundle-analyzer'
  )
  .applyPlugin(
    (_phase, _args, config) =>
      withSentryConfig(config, {
        org: 'mrugesh-mohapatra',
        project: 'javascript-nextjs',
        silent: !process.env.CI,
        widenClientFileUpload: true,
        reactComponentAnnotation: { enabled: true },
        tunnelRoute: '/monitoring',
        hideSourceMaps: true,
        disableLogger: true,
        automaticVercelMonitors: true,
        authToken: process.env.SENTRY_AUTH_TOKEN
      }),
    '@sentry/nextjs'
  )
  .build();

export default config;

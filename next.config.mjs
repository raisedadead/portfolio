// @ts-check
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from './src/env/server.mjs';

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

export default defineNextConfig({
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

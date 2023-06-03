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
  experimental: {
    nextScriptWorkers: true
  },
  redirects: async () => {
    return [
      {
        source: '/links',
        destination: 'https://bio.link/mrugesh',
        basePath: false,
        permanent: false
      },
      {
        source: '/contact',
        destination: '/about',
        permanent: false
      },
      {
        source: '/meet',
        destination: 'https://topmate.io/mrugesh',
        basePath: false,
        permanent: false
      },
      {
        source: '/meet/fcc',
        destination:
          'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0sgE0ZnfSxZQ9fc8fNMW_3bGoA9im9vJ-0ADu_dcMAkvt4GJxVMhzM7IkclZ-6NV1g7KTNrOxa',
        basePath: false,
        permanent: false
      }
    ];
  }
});

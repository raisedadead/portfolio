import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const isProductionBuild = process.env.NODE_ENV === 'production';
const shouldOpenAnalyzer = process.env.OPEN_ANALYZER === 'true';

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  reactStrictMode: true,
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
};

const configAnalyzer = withBundleAnalyzer({
  enabled: isProductionBuild,
  openAnalyzer: shouldOpenAnalyzer
})(nextConfig);

const config = isProductionBuild ? configAnalyzer : nextConfig;
export default config;

if (process.env.NODE_ENV === 'development') {
  import('@opennextjs/cloudflare').then(({ initOpenNextCloudflareForDev }) => {
    initOpenNextCloudflareForDev();
  });
}

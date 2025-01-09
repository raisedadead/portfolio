/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
  siteUrl: 'https://mrugesh.dev',
  generateRobotsTxt: true,
  sitemapSize: 1000,
  exclude: ['/contact', '/404', '/privacy', '/terms', '/refunds', '/about'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: '*',
        disallow: [
          '/contact',
          '/404',
          '/privacy',
          '/terms',
          '/refunds',
          '/about'
        ]
      }
    ],
    additionalSitemaps: ['https://hn.mrugesh.dev/sitemap.xml']
  }
};

export default nextSitemapConfig;

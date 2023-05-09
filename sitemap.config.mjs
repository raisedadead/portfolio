/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
  siteUrl: 'https://mrugesh.dev',
  generateRobotsTxt: true,
  sitemapSize: 1000,
  exclude: ['/contact', '/404', '/privacy', '/terms', '/refunds']
};

export default nextSitemapConfig;

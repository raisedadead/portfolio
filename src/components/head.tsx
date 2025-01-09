import Head from 'next/head';
import { useRouter } from 'next/router';

interface MetaHeadProps {
  pageTitle?: string;
  pageDescription?: string;
  pageUrl?: string;
  pageImage?: string;
  setCanonicalBlogBaseURL?: boolean;
  blogSlug?: string;
}

export const MetaHead: React.FC<MetaHeadProps> = ({
  pageTitle,
  pageDescription,
  pageUrl,
  pageImage,
  setCanonicalBlogBaseURL,
  blogSlug
}) => {
  const router = useRouter();
  const defaultTitle =
    'Mrugesh Mohapatra — Portfolio of a nocturnal developer.';
  const defaultDescription =
    'Namaste! I am a technologist based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.';
  const defaultUrl = 'https://mrugesh.dev';
  const defaultImage = 'http://mrugesh.dev/images/og-image.webp';
  const blogBaseUrl = 'https://hn.mrugesh.dev';

  const getCanonicalUrl = (): string => {
    // For blog pages, return the blog URLs
    if (setCanonicalBlogBaseURL) {
      if (blogSlug) {
        return `${blogBaseUrl}/${blogSlug}`;
      }
      return blogBaseUrl;
    }

    // For explicitly provided URLs, use them directly
    if (pageUrl) {
      return pageUrl;
    }

    // For regular pages, construct the URL
    const path = router.asPath || '/';

    // If it's the home page, return just the domain
    if (path === '/') {
      return defaultUrl;
    }

    // Clean the path: remove query string and trailing slash
    const pathWithoutQuery = path.includes('?')
      ? path.substring(0, path.indexOf('?'))
      : path;
    const cleanPath = pathWithoutQuery.endsWith('/')
      ? pathWithoutQuery.slice(0, -1)
      : pathWithoutQuery;

    return `${defaultUrl}${cleanPath}`;
  };

  const canonicalUrl = getCanonicalUrl();
  const title = pageTitle ? `${pageTitle} • Mrugesh Mohapatra` : defaultTitle;
  const description = pageDescription || defaultDescription;
  const image = pageImage || defaultImage;

  return (
    <Head>
      <meta charSet='UTF-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel='canonical' href={canonicalUrl} />
      <meta name='author' content='Mrugesh Mohapatra' />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:site_name' content='Mrugesh Mohapatra' />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content={canonicalUrl} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:creator' content='@raisedadead' />

      {/* Favicon */}
      <link rel='icon' type='image/png' href='/favicon.ico' />

      {/* Theme Color */}
      <meta name='theme-color' content='#32ded4' />
    </Head>
  );
};

export default MetaHead;

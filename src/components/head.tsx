import Head from 'next/head';

interface MetaHeadProps {
  pageTitle?: string;
  pageDescription?: string;
  pageUrl?: string;
  pageImage?: string;
}

export const MetaHead: React.FC<MetaHeadProps> = ({
  pageTitle,
  pageDescription,
  pageUrl,
  pageImage
}) => {
  const defaultTitle =
    'Mrugesh Mohapatra — Portfolio of a nocturnal developer.';
  const defaultDescription =
    'Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.';
  const defaultUrl = 'https://mrugesh.dev';
  const defaultImage = 'http://mrugesh.dev/images/og-image.webp';

  const title = pageTitle ? `${pageTitle} • Mrugesh Mohapatra` : defaultTitle;
  const description = pageDescription || defaultDescription;
  const url = pageUrl || defaultUrl;
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
      <link rel='canonical' href={url} />
      <meta name='author' content='Mrugesh Mohapatra' />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={url} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:site_name' content='Mrugesh Mohapatra' />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content={url} />
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

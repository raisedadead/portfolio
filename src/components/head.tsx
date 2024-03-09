import Head from 'next/head';

export const MetaHead: React.FC<{ pageTitle?: string }> = ({ pageTitle }) => {
  const defaultOGImage = 'http://mrugesh.dev/images/og-image.webp';
  const defaultTitle =
    'Mrugesh Mohapatra — Portfolio of a nocturnal developer.';
  const defaultUrl = 'https://mrugesh.dev';
  const defaultDescription =
    'Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.';
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>
          {pageTitle ? `${pageTitle} • Mrugesh Mohapatra` : defaultTitle}
        </title>
        <meta name='description' content={defaultDescription} />
        {/* Google / Search Engine Tags */}
        <meta itemProp='name' content={defaultTitle} />
        <meta itemProp='description' content={defaultDescription} />
        <meta itemProp='image' content={defaultOGImage} />
        {/* Facebook Meta Tags */}
        <meta property='og:url' content={defaultUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={defaultTitle} />
        <meta property='og:description' content={defaultDescription} />
        <meta property='og:image' content={defaultOGImage} />
        {/* Twitter Meta Tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={defaultTitle} />
        <meta name='twitter:description' content={defaultDescription} />
        <meta name='twitter:image' content={defaultOGImage} />
      </Head>
    </>
  );
};

export default MetaHead;

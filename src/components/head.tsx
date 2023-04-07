import Head from 'next/head';
import Script from 'next/script';

export const MetaHead = () => {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Mrugesh Mohapatra — Portfolio of a nocturnal developer.</title>
        <meta
          name='description'
          content='Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.'
        />
        {/* Google / Search Engine Tags */}
        <meta
          itemProp='name'
          content='Mrugesh Mohapatra — Portfolio of a nocturnal developer.'
        />
        <meta
          itemProp='description'
          content='Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.'
        />
        <meta itemProp='image' content='http://mrugesh.dev/cover.png' />
        {/* Facebook Meta Tags */}
        <meta property='og:url' content='https://mrugesh.dev' />
        <meta property='og:type' content='website' />
        <meta
          property='og:title'
          content='Mrugesh Mohapatra — Portfolio of a nocturnal developer.'
        />
        <meta
          property='og:description'
          content='Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.'
        />
        <meta property='og:image' content='http://mrugesh.dev/cover.png' />
        {/* Twitter Meta Tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Mrugesh Mohapatra — Portfolio of a nocturnal developer.'
        />
        <meta
          name='twitter:description'
          content='Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.'
        />
        <meta name='twitter:image' content='http://mrugesh.dev/cover.png' />
      </Head>
      <Script
        id='google-analytics'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTM_ID}');
  `
        }}
      />
    </>
  );
};

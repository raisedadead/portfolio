import Head from 'next/head';
import { Partytown } from '@builder.io/partytown/react';

export const MetaHead: React.FC<{ pageTitle?: string }> = ({ pageTitle }) => {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>
          {pageTitle
            ? `${pageTitle} • Mrugesh Mohapatra`
            : 'Mrugesh Mohapatra — Portfolio of a nocturnal developer.'}
        </title>
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
        <meta
          itemProp='image'
          content='http://mrugesh.dev/images/og-image.webp'
        />
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
        <meta
          property='og:image'
          content='http://mrugesh.dev/images/og-image.webp'
        />
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
        <meta
          name='twitter:image'
          content='http://mrugesh.dev/images/og-image.webp'
        />
        <Partytown debug={true} forward={['dataLayer.push']} />
        <script
          id='google-analytics'
          type='text/partytown'
          dangerouslySetInnerHTML={{
            __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', 'GTM-W539SFX');
`
          }}
        />
      </Head>
    </>
  );
};

export default MetaHead;

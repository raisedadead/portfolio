// ./app/layout.tsx
import { FC } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

import '../styles/globals.css';

const RootLayout: FC<{
  children: React.ReactNode;
}> = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}) => {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
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
    </html>
  );
};

export const metadata: Metadata = {
  title: {
    default: 'Mrugesh Mohapatra — Portfolio of a nocturnal developer.',
    template: '%s | Mrugesh Mohapatra'
  },
  description:
    'Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'icon',
      url: '/favicon.ico'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en-US',
    url: 'https://mrugesh.dev',
    title: 'Mrugesh Mohapatra — Portfolio of a nocturnal developer.',
    siteName: 'Mrugesh Mohapatra',
    description:
      'Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.',
    images: [
      {
        url: '/images/cover.png',
        width: 1200,
        height: 630,
        alt: 'Mrugesh Mohapatra — Portfolio of a nocturnal developer.'
      }
    ]
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mrugesh Mohapatra — Portfolio of a nocturnal developer.',
    description:
      'Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering.',
    site: '@raisedadead',
    creator: '@raisedadead',
    images: ['/images/cover.png']
  },
  manifest: '/manifest.json'
};

export default RootLayout;

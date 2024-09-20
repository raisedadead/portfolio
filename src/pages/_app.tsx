import type { AppType } from 'next/dist/shared/lib/utils';
import '@/styles/globals.css';
import { fontSans, fontMono } from '@/components/fonts';
import ConsentBanner from '@/components/consent-banner';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { GA_TRACKING_ID, updateGAConsent } from '@/lib/utils';
import { DarkModeProvider } from '@/contexts/dark-mode-context';

const MyApp: AppType = ({ Component, pageProps }) => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('ga-consent');
    setHasConsent(consent === 'true');
  }, []);

  return (
    <DarkModeProvider>
      <style jsx global>{`
        html {
          font-family: ${fontSans.style.fontFamily};
        }
        code {
          font-family: ${fontMono.style.fontFamily};
        }
      `}</style>
      {hasConsent && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy='afterInteractive'
          onLoad={updateGAConsent}
        />
      )}
      <Component {...pageProps} />
      <ConsentBanner setHasConsent={setHasConsent} />
    </DarkModeProvider>
  );
};

export default MyApp;

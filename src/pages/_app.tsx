import type { AppType } from 'next/dist/shared/lib/utils';
import '@/styles/globals.css';
import ConsentBanner from '@/components/consent-banner';
import { DarkModeProvider } from '@/contexts/dark-mode-context';
import { GA_TRACKING_ID, updateGAConsent } from '@/lib/utils';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const MyApp: AppType = ({ Component, pageProps }) => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('ga-consent');
    setHasConsent(consent === 'true');
  }, []);

  return (
    <DarkModeProvider>
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

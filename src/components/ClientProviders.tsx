import ConsentBanner from '@/components/consent-banner';
import { GA_TRACKING_ID, updateGAConsent } from '@/lib/utils';
import type React from 'react';
import { useEffect, useState } from 'react';

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('ga-consent');
    setHasConsent(consent === 'true');
  }, []);

  useEffect(() => {
    if (hasConsent) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      script.async = true;
      script.onload = () => updateGAConsent();
      document.head.appendChild(script);
    }
  }, [hasConsent]);

  return (
    <>
      {children}
      <ConsentBanner setHasConsent={setHasConsent} />
    </>
  );
};

export default ClientProviders;

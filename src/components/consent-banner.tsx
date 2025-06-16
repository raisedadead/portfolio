import { CustomLink as Link } from '@/components/custom-link';
import { loadGAScript, updateGAConsent } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ConsentBannerProps {
  setHasConsent: (value: boolean) => void;
}

function ConsentBanner({ setHasConsent }: ConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('ga-consent');
    setShowBanner(!hasConsent);
  }, []);

  const handleConsent = (granted: boolean) => {
    localStorage.setItem('ga-consent', granted.toString());
    setShowBanner(false);
    setHasConsent(granted);

    if (granted) {
      updateGAConsent();
      loadGAScript();
    }
  };

  if (!showBanner) return null;

  return (
    <div className='fixed right-0 bottom-0 left-0 bg-gray-800 px-4 py-2 shadow-lg'>
      <div className='container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <p className='mb-2 text-sm text-white sm:mb-0 sm:text-base'>
          We use third-party services to improve how users interact with our
          website. Refer to our{' '}
          <Link
            href='/privacy'
            className='text-blue-300 underline transition-colors duration-200 hover:text-blue-400'
          >
            privacy policy
          </Link>
          . Do you accept this?
        </p>
        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={() => handleConsent(true)}
            className='transform rounded bg-blue-700 px-4 py-1 text-sm font-medium text-white transition-colors duration-200 hover:scale-105 hover:bg-blue-800'
          >
            Accept
          </button>
          <button
            type='button'
            onClick={() => handleConsent(false)}
            className='transform rounded border border-white px-4 py-1 text-sm font-medium text-white transition-colors duration-200 hover:scale-105 hover:bg-white hover:text-gray-800'
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsentBanner;

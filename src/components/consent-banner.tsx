// Self-contained GA consent banner. Reads `localStorage` for prior
// choice, loads the GA script if previously granted, otherwise shows
// the banner. Renders nothing once a choice has been made.
//
// Lives as a sibling of the body slot, NOT a wrapper. Wrapping the
// Astro `<slot />` in a React component that uses `{children}` causes
// React 19 to bail on hydration (Astro slot HTML ≠ React vnodes), so
// the entire body subtree gets re-rendered client-side and nested
// islands lose their hydration → blank page.

import { useEffect, useState } from 'react';
import { CustomLink as Link } from '@/components/custom-link';
import { loadGAScript, updateGAConsent } from '@/lib/utils';

type ConsentState = 'unknown' | 'granted' | 'denied';

function readStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unknown';
  const stored = window.localStorage.getItem('ga-consent');
  if (stored === 'true') return 'granted';
  if (stored === 'false') return 'denied';
  return 'unknown';
}

function persistConsent(granted: boolean): void {
  try {
    window.localStorage.setItem('ga-consent', granted.toString());
  } catch {
    // localStorage may be full or blocked (private browsing). Banner
    // re-appears next visit; not catastrophic.
  }
}

function ConsentBanner(): React.JSX.Element | null {
  const [consent, setConsent] = useState<ConsentState>('unknown');

  useEffect(() => {
    const initial = readStoredConsent();
    setConsent(initial);
    if (initial === 'granted') {
      // User previously granted — boot GA on every page load.
      updateGAConsent();
      loadGAScript();
    }
  }, []);

  const handleConsent = (granted: boolean): void => {
    persistConsent(granted);
    setConsent(granted ? 'granted' : 'denied');
    if (granted) {
      updateGAConsent();
      loadGAScript();
    }
  };

  // Hide if a choice was already made (or until SSR-side first render).
  if (consent !== 'unknown') return null;

  return (
    <div className='fixed right-0 bottom-0 left-0 bg-gray-800 px-4 py-2 shadow-lg'>
      <div className='container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <p className='mb-2 text-sm text-white sm:mb-0 sm:text-base'>
          We use third-party services to improve how users interact with our website. Refer to our{' '}
          <Link href='/privacy' className='text-blue-300 underline transition-all duration-100 hover:text-blue-400'>
            privacy policy
          </Link>
          . Do you accept this?
        </p>
        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={() => handleConsent(true)}
            className='transform rounded bg-blue-700 px-4 py-1 text-sm font-medium text-white transition-all duration-100 hover:scale-105 hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none'
          >
            Accept
          </button>
          <button
            type='button'
            onClick={() => handleConsent(false)}
            className='transform rounded border-2 border-white px-4 py-1 text-sm font-medium text-white transition-all duration-100 hover:scale-105 hover:bg-white hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none'
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsentBanner;

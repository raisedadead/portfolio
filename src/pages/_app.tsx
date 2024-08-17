import type { AppType } from 'next/dist/shared/lib/utils';
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';

import '@/styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <GoogleTagManager gtmId='GTM-W539SFX' />
      <Script
        src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "9d84395d99af4272b20ef8e6c9e19ecf"}'
      />
    </>
  );
};

export default MyApp;

import type { AppType } from 'next/dist/shared/lib/utils';
import { GoogleTagManager } from '@next/third-parties/google';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <GoogleTagManager gtmId='GTM-W539SFX' />
    </>
  );
};

export default MyApp;

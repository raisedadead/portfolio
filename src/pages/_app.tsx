import type { AppType } from 'next/dist/shared/lib/utils';
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import * as Fonts from '@/components/fonts';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${Fonts.IBMPlexSans.style.fontFamily};
        }

        code {
          font-family: ${Fonts.IBMPlexMono.style.fontFamily};
        }

        p {
          font-family: ${Fonts.IBMPlexMono.style.fontFamily};
        }
      `}</style>
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

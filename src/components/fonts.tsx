import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

export const IBMPlexMono = IBM_Plex_Mono({
  display: 'swap',
  subsets: ['latin-ext'],
  variable: '--font-ibm-plex-mono',
  weight: '400'
});

export const IBMPlexSans = IBM_Plex_Sans({
  display: 'swap',
  subsets: ['latin-ext'],
  variable: '--font-ibm-plex-sans',
  weight: '400'
});

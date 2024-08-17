import { Bricolage_Grotesque } from 'next/font/google';
import { Space_Mono } from 'next/font/google';

export const fontMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: '400'
});

export const fontSans = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: '400'
});

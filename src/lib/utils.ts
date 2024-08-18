import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SENTRY_DSN =
  'https://e83b9674c3a509c1ef068ddd63d3adfd@o4507798912958464.ingest.us.sentry.io/4507798914859008';

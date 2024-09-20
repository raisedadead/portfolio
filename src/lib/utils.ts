import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DOMNode, Element } from 'html-react-parser';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SENTRY_DSN =
  'https://e83b9674c3a509c1ef068ddd63d3adfd@o4507798912958464.ingest.us.sentry.io/4507798914859008';

export const GA_TRACKING_ID = 'G-VD9T0P1KLN';

export function updateGAConsent() {
  // @ts-expect-error: gtag is added by Google Analytics script
  window.gtag('consent', 'update', {
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    ad_storage: 'granted',
    analytics_storage: 'granted'
  });
}

export function loadGAScript() {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

const isElement = (node: DOMNode): node is Element => {
  return node.type === 'tag';
};

export const extractTextContent = (node: DOMNode): string => {
  if (node.type === 'text') {
    return node.data || '';
  }
  if (isElement(node) && node.children) {
    return (node.children as DOMNode[]).map(extractTextContent).join('');
  }
  return '';
};

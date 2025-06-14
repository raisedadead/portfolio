import { type ClassValue, clsx } from 'clsx';
import type { DOMNode, Element } from 'html-react-parser';
import { twMerge } from 'tailwind-merge';

export const GA_TRACKING_ID = 'G-VD9T0P1KLN';

export const updateGAConsent = () => {
  // @ts-expect-error: gtag is added by Google Analytics script
  window.gtag('consent', 'update', {
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    ad_storage: 'granted',
    analytics_storage: 'granted'
  });
};

export const loadGAScript = () => {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

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

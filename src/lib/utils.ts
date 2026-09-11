import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GA_TRACKING_ID = 'G-VD9T0P1KLN';

export function loadGAScript(): void {
  if (window.gtag) return;

  const dataLayer = (window.dataLayer ??= []);
  // https://developers.google.com/tag-platform/gtagjs
  window.gtag = function (): void {
    dataLayer.push(arguments);
  };
  window.gtag('consent', 'update', {
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    ad_storage: 'granted',
    analytics_storage: 'granted'
  });
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);

  const script = document.createElement('script');
  script.id = 'google-analytics';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

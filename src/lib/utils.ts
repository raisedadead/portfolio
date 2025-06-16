import { type ClassValue, clsx } from 'clsx';
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

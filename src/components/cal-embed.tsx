import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

// Configuration constants
const CAL_CONFIG = {
  namespace: 'meet',
  link: 'mrugesh/meet',
  brandColor: '#DF9E62',
  layout: 'month_view'
} as const;

const UI_CONFIG = {
  cssVarsPerTheme: {
    light: { 'cal-brand': CAL_CONFIG.brandColor },
    dark: { 'cal-brand': CAL_CONFIG.brandColor }
  },
  hideEventTypeDetails: false,
  layout: CAL_CONFIG.layout
} as const;

interface CalButtonProps {
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}

export default function CalButton({ className = '', 'aria-label': ariaLabel, children }: CalButtonProps) {
  useEffect(() => {
    const initializeCalendar = async () => {
      try {
        const cal = await getCalApi({ namespace: CAL_CONFIG.namespace });
        cal('ui', UI_CONFIG);
      } catch (error) {
        console.error('Failed to initialize calendar:', error);
      }
    };

    initializeCalendar();
  }, []);

  return (
    <button
      data-cal-namespace={CAL_CONFIG.namespace}
      data-cal-link={CAL_CONFIG.link}
      data-cal-config={JSON.stringify({ layout: CAL_CONFIG.layout })}
      className={`cal-embed-button ${className}`.trim()}
      aria-label={ariaLabel}
      type='button'
    >
      {children}
    </button>
  );
}

import { getCalApi } from '@calcom/embed-react';
import { useRef } from 'react';

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
  const calApi = useRef<ReturnType<typeof getCalApi> | null>(null);

  const loadCal = () => {
    calApi.current ??= getCalApi({ namespace: CAL_CONFIG.namespace }).then((cal) => {
      cal('ui', UI_CONFIG);
      return cal;
    });
    return calApi.current;
  };

  const preload = () => {
    void loadCal();
  };

  const openBooking = () => {
    void loadCal().then((cal) => cal('modal', { calLink: CAL_CONFIG.link, config: { layout: CAL_CONFIG.layout } }));
  };

  return (
    <button
      className={`cal-embed-button ${className}`.trim()}
      aria-label={ariaLabel}
      type='button'
      onPointerEnter={preload}
      onFocus={preload}
      onClick={openBooking}
    >
      {children}
    </button>
  );
}

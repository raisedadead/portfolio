import { loadGAScript } from '@/lib/utils';

type Consent = 'true' | 'false' | null;

function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem('ga-consent');
    return value === 'true' || value === 'false' ? value : null;
  } catch {
    return null;
  }
}

export function installConsentBanner(): () => void {
  let choice: Consent = null;

  const syncBanner = (): void => {
    const consent = choice ?? readConsent();
    const banner = document.getElementById('consent-banner');
    if (banner) banner.hidden = consent !== null;
    if (consent === 'true') loadGAScript();
  };

  const handleClick = (event: MouseEvent): void => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('button[data-consent]');
    const banner = document.getElementById('consent-banner');
    if (!button || !banner?.contains(button)) return;
    const value = button.dataset.consent;
    if (value !== 'true' && value !== 'false') return;
    choice = value;
    try {
      window.localStorage.setItem('ga-consent', value);
    } catch {}
    syncBanner();
  };

  document.addEventListener('click', handleClick);
  document.addEventListener('astro:after-swap', syncBanner);
  syncBanner();

  return () => {
    document.removeEventListener('click', handleClick);
    document.removeEventListener('astro:after-swap', syncBanner);
  };
}

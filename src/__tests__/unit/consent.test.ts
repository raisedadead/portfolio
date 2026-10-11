import { installConsentBanner } from '@/lib/consent';
import { GA_TRACKING_ID } from '@/lib/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function mountBanner(): HTMLElement {
  document.body.innerHTML = `<div id="consent-banner" hidden>
    <button data-consent="true">Accept</button>
    <button data-consent="false">Decline</button>
  </div>`;
  return document.getElementById('consent-banner')!;
}

function choose(value: 'true' | 'false'): void {
  document.querySelector<HTMLButtonElement>(`[data-consent="${value}"]`)!.click();
}

const disposers: Array<() => void> = [];

function install(): void {
  disposers.push(installConsentBanner());
}

describe('Consent banner', () => {
  beforeEach(() => {
    localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
    document.head.innerHTML = '';
    mountBanner();
    const appendChild = document.head.appendChild.bind(document.head);
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLScriptElement) node.type = 'text/plain';
      return appendChild(node);
    });
  });

  afterEach(() => {
    for (const dispose of disposers.splice(0)) dispose();
    vi.restoreAllMocks();
  });

  it('shows the banner without analytics before a choice', () => {
    install();
    expect(document.getElementById('consent-banner')!.hidden).toBe(false);
    expect(window.gtag).toBeUndefined();
    expect(document.head.querySelector('script')).toBeNull();
  });

  it('treats an invalid stored value as no consent', () => {
    localStorage.setItem('ga-consent', 'yes');
    install();
    expect(document.getElementById('consent-banner')!.hidden).toBe(false);
    expect(window.gtag).toBeUndefined();
  });

  it('keeps analytics disabled after decline and navigation', () => {
    install();
    choose('false');
    expect(localStorage.getItem('ga-consent')).toBe('false');
    const banner = mountBanner();
    document.dispatchEvent(new Event('astro:after-swap'));
    expect(banner.hidden).toBe(true);
    expect(window.gtag).toBeUndefined();
    expect(document.head.querySelector('script')).toBeNull();
  });

  it('initializes the real analytics queue once after acceptance', () => {
    install();
    choose('true');
    expect(localStorage.getItem('ga-consent')).toBe('true');
    expect(window.dataLayer?.map((entry) => Array.from(entry))).toEqual([
      [
        'consent',
        'update',
        {
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          ad_storage: 'granted',
          analytics_storage: 'granted'
        }
      ],
      ['js', expect.any(Date)],
      ['config', GA_TRACKING_ID]
    ]);
    const banner = mountBanner();
    document.dispatchEvent(new Event('astro:after-swap'));
    expect(banner.hidden).toBe(true);
    expect(document.head.querySelectorAll('script[src*="googletagmanager.com"]')).toHaveLength(1);
    expect(window.dataLayer).toHaveLength(3);
  });

  it('initializes analytics for a stored acceptance', () => {
    localStorage.setItem('ga-consent', 'true');
    install();
    expect(window.gtag).toBeTypeOf('function');
    expect(document.getElementById('consent-banner')!.hidden).toBe(true);
  });

  it('does not initialize analytics for a stored refusal', () => {
    localStorage.setItem('ga-consent', 'false');
    install();
    expect(document.getElementById('consent-banner')!.hidden).toBe(true);
    expect(window.gtag).toBeUndefined();
  });

  it('preserves the analytics queue when navigation replaces the head', () => {
    localStorage.setItem('ga-consent', 'true');
    install();
    document.head.innerHTML = '';
    mountBanner();
    document.dispatchEvent(new Event('astro:after-swap'));
    expect(window.dataLayer).toHaveLength(3);
    expect(document.head.querySelector('script')).toBeNull();
  });

  it('keeps acceptance through navigation when storage writes fail', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });
    install();
    choose('true');
    const banner = mountBanner();
    document.dispatchEvent(new Event('astro:after-swap'));
    expect(banner.hidden).toBe(true);
    expect(window.gtag).toBeTypeOf('function');
  });

  it('shows a usable banner when storage reads fail', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    install();
    expect(document.getElementById('consent-banner')!.hidden).toBe(false);
    choose('false');
    const banner = mountBanner();
    document.dispatchEvent(new Event('astro:after-swap'));
    expect(banner.hidden).toBe(true);
    expect(window.gtag).toBeUndefined();
  });

  it('handles choices on the new banner after navigation', () => {
    install();
    mountBanner();
    document.dispatchEvent(new Event('astro:after-swap'));
    choose('true');
    expect(window.gtag).toBeTypeOf('function');
    expect(document.getElementById('consent-banner')!.hidden).toBe(true);
  });

  it('ignores consent values outside the banner', () => {
    install();
    const button = document.createElement('button');
    button.dataset.consent = 'true';
    document.body.appendChild(button);
    button.click();
    expect(window.gtag).toBeUndefined();
  });
});

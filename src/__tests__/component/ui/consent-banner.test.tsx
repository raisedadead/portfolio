import ConsentBanner from '@/components/consent-banner';
import { GA_TRACKING_ID } from '@/lib/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
    document.head.innerHTML = '';
    const appendChild = document.head.appendChild.bind(document.head);
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLScriptElement) node.type = 'text/plain';
      return appendChild(node);
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('does not initialize analytics before a choice or after declining', () => {
    const { unmount } = render(<ConsentBanner />);
    expect(window.gtag).toBeUndefined();
    expect(document.head.querySelector('script')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Decline' }));
    expect(localStorage.getItem('ga-consent')).toBe('false');
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument();
    unmount();
    render(<ConsentBanner />);
    expect(window.gtag).toBeUndefined();
    expect(document.head.querySelector('script')).toBeNull();
  });

  it('initializes the real GA queue on acceptance and loads the script once across remounts', () => {
    const { unmount } = render(<ConsentBanner />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(localStorage.getItem('ga-consent')).toBe('true');
    expect(window.gtag).toBeTypeOf('function');
    const commands = window.dataLayer?.map((entry) => Array.from(entry));
    expect(commands).toEqual([
      [
        'consent',
        'update',
        { ad_user_data: 'granted', ad_personalization: 'granted', ad_storage: 'granted', analytics_storage: 'granted' }
      ],
      ['js', expect.any(Date)],
      ['config', GA_TRACKING_ID]
    ]);
    expect(document.head.querySelectorAll('script[src*="googletagmanager.com"]')).toHaveLength(1);
    unmount();
    render(<ConsentBanner />);
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument();
    expect(document.head.querySelectorAll('script[src*="googletagmanager.com"]')).toHaveLength(1);
    expect(window.dataLayer).toHaveLength(3);
  });

  it('initializes analytics for a returning visitor who accepted', () => {
    localStorage.setItem('ga-consent', 'true');
    render(<ConsentBanner />);
    expect(window.gtag).toBeTypeOf('function');
    expect(document.head.querySelector('script[src*="googletagmanager.com"]')).not.toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('keeps the initialized queue when navigation replaces the document head', () => {
    localStorage.setItem('ga-consent', 'true');
    const { unmount } = render(<ConsentBanner />);
    document.head.innerHTML = '';
    unmount();
    render(<ConsentBanner />);
    expect(window.dataLayer).toHaveLength(3);
    expect(document.head.querySelector('script')).toBeNull();
  });

  it('still accepts consent when storage cannot persist the choice', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });
    render(<ConsentBanner />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(window.gtag).toBeTypeOf('function');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

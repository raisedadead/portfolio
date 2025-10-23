import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GA_TRACKING_ID, cn, loadGAScript, updateGAConsent } from '@/lib/utils';

// Unmock utils for this test file - we need real implementations
vi.unmock('@/lib/utils');

describe('utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2', { class3: true, class4: false });
      expect(result).toBe('class1 class2 class3');
    });

    it('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-8');
      expect(result).toBe('p-8');
    });

    it('merges conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn('base', { active: isActive, disabled: isDisabled });
      expect(result).toBe('base active');
    });

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });
  });

  describe('GA_TRACKING_ID constant', () => {
    it('exports correct Google Analytics tracking ID', () => {
      expect(GA_TRACKING_ID).toBe('G-VD9T0P1KLN');
    });
  });

  describe('updateGAConsent function', () => {
    beforeEach(() => {
      // Mock window.gtag
      vi.stubGlobal('gtag', vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('calls gtag with consent update', () => {
      updateGAConsent();

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        ad_storage: 'granted',
        analytics_storage: 'granted'
      });
    });

    it('calls gtag exactly once', () => {
      updateGAConsent();

      expect(window.gtag).toHaveBeenCalledTimes(1);
    });

    it('grants all consent types', () => {
      updateGAConsent();

      const mockGtag = window.gtag as ReturnType<typeof vi.fn>;
      const [[, , consentConfig]] = mockGtag.mock.calls;

      expect(consentConfig.ad_user_data).toBe('granted');
      expect(consentConfig.ad_personalization).toBe('granted');
      expect(consentConfig.ad_storage).toBe('granted');
      expect(consentConfig.analytics_storage).toBe('granted');
    });
  });

  describe('loadGAScript function', () => {
    let appendChildSpy: ReturnType<typeof vi.spyOn>;
    let scriptElements: HTMLScriptElement[] = [];

    beforeEach(() => {
      document.head.innerHTML = '';
      scriptElements = [];

      // Spy on appendChild to capture script elements without actually appending them
      // This prevents happy-dom from fetching the scripts and causing NetworkError
      appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
        if (node instanceof HTMLScriptElement) {
          scriptElements.push(node);
        }
        return node;
      }) as ReturnType<typeof vi.spyOn>;
    });

    afterEach(() => {
      appendChildSpy.mockRestore();
      document.head.innerHTML = '';
    });

    it('creates script element with correct src', () => {
      loadGAScript();

      expect(scriptElements).toHaveLength(1);
      expect(scriptElements[0].src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`);
    });

    it('sets async attribute on script', () => {
      loadGAScript();

      expect(scriptElements).toHaveLength(1);
      expect(scriptElements[0].async).toBe(true);
    });

    it('appends script to document head', () => {
      loadGAScript();

      expect(appendChildSpy).toHaveBeenCalledTimes(1);
      expect(scriptElements).toHaveLength(1);
    });

    it('creates new script element each time called', () => {
      loadGAScript();
      loadGAScript();

      expect(appendChildSpy).toHaveBeenCalledTimes(2);
      expect(scriptElements).toHaveLength(2);
    });

    it('uses correct Google Tag Manager URL format', () => {
      loadGAScript();

      expect(scriptElements).toHaveLength(1);
      expect(scriptElements[0].src).toMatch(/^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+$/);
    });
  });
});

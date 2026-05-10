import ConsentBanner from '@/components/consent-banner';
import { loadGAScript, updateGAConsent } from '@/lib/utils';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/utils');

describe('ConsentBanner — self-contained variant', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  describe('initial render — unknown consent', () => {
    it('renders the banner copy when no consent is stored', async () => {
      await act(async () => {
        render(<ConsentBanner />);
      });
      expect(screen.getByText(/third-party services/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /accept/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /decline/i })).toBeTruthy();
    });

    it('does not load GA on initial mount when consent is unknown', async () => {
      await act(async () => {
        render(<ConsentBanner />);
      });
      expect(vi.mocked(loadGAScript)).not.toHaveBeenCalled();
      expect(vi.mocked(updateGAConsent)).not.toHaveBeenCalled();
    });
  });

  describe('initial render — stored consent', () => {
    it('does not render banner when consent was previously granted', async () => {
      localStorage.setItem('ga-consent', 'true');
      await act(async () => {
        render(<ConsentBanner />);
      });
      expect(screen.queryByText(/third-party services/i)).toBeNull();
    });

    it('does not render banner when consent was previously denied', async () => {
      localStorage.setItem('ga-consent', 'false');
      await act(async () => {
        render(<ConsentBanner />);
      });
      expect(screen.queryByText(/third-party services/i)).toBeNull();
    });

    it('boots GA on mount when consent was previously granted', async () => {
      localStorage.setItem('ga-consent', 'true');
      await act(async () => {
        render(<ConsentBanner />);
      });
      expect(vi.mocked(loadGAScript)).toHaveBeenCalledOnce();
      expect(vi.mocked(updateGAConsent)).toHaveBeenCalledOnce();
    });

    it('does NOT boot GA on mount when consent was previously denied', async () => {
      localStorage.setItem('ga-consent', 'false');
      await act(async () => {
        render(<ConsentBanner />);
      });
      expect(vi.mocked(loadGAScript)).not.toHaveBeenCalled();
      expect(vi.mocked(updateGAConsent)).not.toHaveBeenCalled();
    });
  });

  describe('user interaction', () => {
    it('persists consent + loads GA when Accept is clicked', async () => {
      await act(async () => {
        render(<ConsentBanner />);
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /accept/i }));
      });
      expect(localStorage.getItem('ga-consent')).toBe('true');
      expect(vi.mocked(loadGAScript)).toHaveBeenCalledOnce();
      expect(vi.mocked(updateGAConsent)).toHaveBeenCalledOnce();
      expect(screen.queryByText(/third-party services/i)).toBeNull();
    });

    it('persists denial + does not load GA when Decline is clicked', async () => {
      await act(async () => {
        render(<ConsentBanner />);
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /decline/i }));
      });
      expect(localStorage.getItem('ga-consent')).toBe('false');
      expect(vi.mocked(loadGAScript)).not.toHaveBeenCalled();
      expect(vi.mocked(updateGAConsent)).not.toHaveBeenCalled();
      expect(screen.queryByText(/third-party services/i)).toBeNull();
    });

    it('survives a localStorage write failure (private browsing)', async () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });
      await act(async () => {
        render(<ConsentBanner />);
      });
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /accept/i }));
      }).not.toThrow();
      localStorage.setItem = originalSetItem;
    });
  });

  describe('a11y', () => {
    it('buttons have type="button" and accessible names', async () => {
      await act(async () => {
        render(<ConsentBanner />);
      });
      const accept = screen.getByRole('button', { name: /accept/i });
      const decline = screen.getByRole('button', { name: /decline/i });
      expect(accept).toHaveAttribute('type', 'button');
      expect(decline).toHaveAttribute('type', 'button');
    });
  });
});

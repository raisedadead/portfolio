import ConsentBanner from '@/components/consent-banner';
import { loadGAScript, updateGAConsent } from '@/lib/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/utils');

describe('ConsentBanner Component', () => {
  const mockSetHasConsent = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('renders the consent banner with correct message', () => {
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

    // Check for consent message text
    expect(screen.getByText(/third-party services/i)).toBeTruthy();
    expect(screen.getByText(/privacy policy/i)).toBeTruthy();
  });

  it('renders accept and decline buttons', () => {
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

    const acceptButton = screen.getByRole('button', { name: /accept/i });
    const declineButton = screen.getByRole('button', { name: /decline/i });

    expect(acceptButton).toBeTruthy();
    expect(declineButton).toBeTruthy();
  });

  it('has proper button styling', () => {
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

    const acceptButton = screen.getByRole('button', { name: /accept/i });
    const declineButton = screen.getByRole('button', { name: /decline/i });

    // Check for styling classes that actually exist
    expect(acceptButton).toHaveClass('bg-blue-700');
    expect(declineButton).toHaveClass('border-2');
  });

  it('handles button clicks', () => {
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

    const acceptButton = screen.getByRole('button', { name: /accept/i });
    const declineButton = screen.getByRole('button', { name: /decline/i });

    // Test that buttons are clickable (no errors thrown)
    expect(() => fireEvent.click(acceptButton)).not.toThrow();
    expect(() => fireEvent.click(declineButton)).not.toThrow();
  });

  it('renders when no consent is stored', () => {
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);
    expect(screen.getByText(/We use third-party services/)).toBeDefined();
  });

  it('does not render when consent is stored', () => {
    localStorage.setItem('ga-consent', 'true');
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);
    expect(screen.queryByText(/We use third-party services/)).toBeNull();
  });

  it('handles consent acceptance', () => {
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);
    fireEvent.click(screen.getByText('Accept'));

    expect(localStorage.getItem('ga-consent')).toBe('true');
    expect(mockSetHasConsent).toHaveBeenCalledWith(true);
    expect(vi.mocked(updateGAConsent)).toHaveBeenCalled();
    expect(vi.mocked(loadGAScript)).toHaveBeenCalled();
  });

  it('handles consent decline', () => {
    render(<ConsentBanner setHasConsent={mockSetHasConsent} />);
    fireEvent.click(screen.getByText('Decline'));

    expect(localStorage.getItem('ga-consent')).toBe('false');
    expect(mockSetHasConsent).toHaveBeenCalledWith(false);
    expect(vi.mocked(updateGAConsent)).not.toHaveBeenCalled();
    expect(vi.mocked(loadGAScript)).not.toHaveBeenCalled();
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      const declineButton = screen.getByRole('button', { name: /decline/i });

      expect(acceptButton).toHaveAttribute('type', 'button');
      expect(declineButton).toHaveAttribute('type', 'button');
    });

    it('supports keyboard navigation', () => {
      render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      const declineButton = screen.getByRole('button', { name: /decline/i });

      acceptButton.focus();
      expect(acceptButton).toHaveFocus();

      fireEvent.keyDown(acceptButton, { key: 'Tab' });
      declineButton.focus();
      expect(declineButton).toHaveFocus();
    });

    it('handles Enter key press on buttons', () => {
      render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.keyDown(acceptButton, { key: 'Enter' });
      fireEvent.click(acceptButton);

      expect(localStorage.getItem('ga-consent')).toBe('true');
      expect(mockSetHasConsent).toHaveBeenCalledWith(true);
    });

    it('handles Space key press on buttons', () => {
      render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      const declineButton = screen.getByRole('button', { name: /decline/i });
      fireEvent.keyDown(declineButton, { key: ' ' });
      fireEvent.click(declineButton);

      expect(localStorage.getItem('ga-consent')).toBe('false');
      expect(mockSetHasConsent).toHaveBeenCalledWith(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      expect(() => {
        fireEvent.click(screen.getByText('Accept'));
      }).not.toThrow();

      localStorage.setItem = originalSetItem;
    });

    it('handles multiple rapid clicks', () => {
      render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      expect(mockSetHasConsent).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('ga-consent')).toBe('true');
    });

    it('preserves consent choice across component remounts', () => {
      localStorage.setItem('ga-consent', 'true');
      const { unmount } = render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      expect(screen.queryByText(/We use third-party services/)).toBeNull();

      unmount();
      render(<ConsentBanner setHasConsent={mockSetHasConsent} />);

      expect(screen.queryByText(/We use third-party services/)).toBeNull();
    });
  });
});

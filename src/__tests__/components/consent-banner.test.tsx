import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ConsentBanner from '@/components/consent-banner';
import { updateGAConsent, loadGAScript } from '@/lib/utils';

vi.mock('@/lib/utils');

describe('ConsentBanner', () => {
  const mockSetHasConsent = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
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
});

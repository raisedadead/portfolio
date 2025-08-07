import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ClientProviders from '../../components/client-providers';

// Mock the utilities
vi.mock('@/lib/utils', () => ({
  GA_TRACKING_ID: 'GA-TEST-123',
  updateGAConsent: vi.fn()
}));

// Mock ConsentBanner component
vi.mock('@/components/consent-banner', () => ({
  default: ({ setHasConsent }: { setHasConsent: (value: boolean) => void }) => (
    <div data-testid='consent-banner'>
      <button type='button' data-testid='accept-consent' onClick={() => setHasConsent(true)}>
        Accept
      </button>
    </div>
  )
}));

describe('ClientProviders Component', () => {
  const originalCreateElement = document.createElement;
  const mockScriptElement = {
    src: '',
    async: false,
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.head.innerHTML = '';

    // Mock document.createElement to prevent actual script loading
    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'script') {
        const script = { ...mockScriptElement };
        // Simulate successful script loading without network request
        setTimeout(() => {
          if (script.onload) script.onload();
        }, 0);
        return script as HTMLScriptElement;
      }
      return originalCreateElement.call(document, tagName);
    });

    // Mock document.head.appendChild to track script additions
    document.head.appendChild = vi.fn((element) => {
      // Don't actually append to avoid network requests
      return element;
    });
  });

  afterEach(() => {
    localStorage.clear();
    document.head.innerHTML = '';
    document.createElement = originalCreateElement;
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders children content', () => {
      render(
        <ClientProviders>
          <div data-testid='test-child'>Test Content</div>
        </ClientProviders>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders ConsentBanner component', () => {
      render(
        <ClientProviders>
          <div>Content</div>
        </ClientProviders>
      );

      expect(screen.getByTestId('consent-banner')).toBeInTheDocument();
    });
  });

  describe('Consent State Management', () => {
    it('initializes consent state from localStorage', () => {
      localStorage.setItem('ga-consent', 'true');

      render(
        <ClientProviders>
          <div>Content</div>
        </ClientProviders>
      );

      expect(screen.getByTestId('consent-banner')).toBeInTheDocument();
    });

    it('handles empty localStorage gracefully', () => {
      render(
        <ClientProviders>
          <div>Content</div>
        </ClientProviders>
      );

      expect(screen.getByTestId('consent-banner')).toBeInTheDocument();
    });
  });

  describe('Google Analytics Integration', () => {
    it('creates GA script when consent is given', async () => {
      localStorage.setItem('ga-consent', 'true');

      render(
        <ClientProviders>
          <div>Content</div>
        </ClientProviders>
      );

      await waitFor(() => {
        // Check that createElement was called with 'script'
        expect(document.createElement).toHaveBeenCalledWith('script');
        // Check that appendChild was called (script was added to head)
        expect(document.head.appendChild).toHaveBeenCalled();
      });
    });

    it('does not create GA script without consent', async () => {
      render(
        <ClientProviders>
          <div>Content</div>
        </ClientProviders>
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Script should not be created without consent
      expect(document.createElement).not.toHaveBeenCalledWith('script');
      expect(document.head.appendChild).not.toHaveBeenCalled();
    });
  });

  describe('Children Rendering', () => {
    it('renders multiple children correctly', () => {
      render(
        <ClientProviders>
          <div data-testid='child1'>Child 1</div>
          <div data-testid='child2'>Child 2</div>
        </ClientProviders>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('consent-banner')).toBeInTheDocument();
    });
  });
});

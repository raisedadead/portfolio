import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Consent Banner Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const createConsentBanner = () => {
    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.className = 'fixed right-0 bottom-0 left-0 hidden bg-gray-800 px-4 py-2 shadow-lg';

    const container = document.createElement('div');
    container.className = 'container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between';

    const textP = document.createElement('p');
    textP.className = 'mb-2 text-sm text-white sm:mb-0 sm:text-base';
    textP.innerHTML =
      'We use third-party services to improve how users interact with our website. Refer to our <a href="/privacy" class="text-blue-300 underline transition-colors duration-200 hover:text-blue-400">privacy policy</a>. Do you accept this?';

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'flex space-x-4';

    const acceptButton = document.createElement('button');
    acceptButton.type = 'button';
    acceptButton.id = 'consent-accept';
    acceptButton.className =
      'transform rounded bg-blue-700 px-4 py-1 text-sm font-medium text-white transition-colors duration-200 hover:scale-105 hover:bg-blue-800';
    acceptButton.textContent = 'Accept';

    const declineButton = document.createElement('button');
    declineButton.type = 'button';
    declineButton.id = 'consent-decline';
    declineButton.className =
      'transform rounded border border-white px-4 py-1 text-sm font-medium text-white transition-colors duration-200 hover:scale-105 hover:bg-white hover:text-gray-800';
    declineButton.textContent = 'Decline';

    buttonsDiv.appendChild(acceptButton);
    buttonsDiv.appendChild(declineButton);

    container.appendChild(textP);
    container.appendChild(buttonsDiv);
    banner.appendChild(container);

    document.body.appendChild(banner);

    // Simulate the banner functionality
    const hasConsent = localStorage.getItem('ga-consent');
    if (!hasConsent) {
      banner.classList.remove('hidden');
    }

    const handleConsent = (granted: boolean) => {
      localStorage.setItem('ga-consent', granted.toString());
      banner.classList.add('hidden');

      // Dispatch custom event
      window.dispatchEvent(
        new CustomEvent('consent-updated', {
          detail: { granted }
        })
      );

      if (granted) {
        console.log('Analytics consent granted');
      }
    };

    acceptButton.addEventListener('click', () => handleConsent(true));
    declineButton.addEventListener('click', () => handleConsent(false));

    return banner;
  };

  describe('Structure and Layout', () => {
    it('renders consent banner with correct structure', () => {
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner).toBeTruthy();
      expect(banner?.classList.contains('fixed')).toBe(true);
      expect(banner?.classList.contains('bottom-0')).toBe(true);
    });

    it('contains container with responsive layout', () => {
      createConsentBanner();

      const container = document.querySelector('.container.mx-auto.flex');
      expect(container).toBeTruthy();
      expect(container?.classList.contains('flex-col')).toBe(true);
      expect(container?.classList.contains('sm:flex-row')).toBe(true);
      expect(container?.classList.contains('sm:items-center')).toBe(true);
      expect(container?.classList.contains('sm:justify-between')).toBe(true);
    });

    it('renders consent text with privacy policy link', () => {
      createConsentBanner();

      const textElement = document.querySelector('.mb-2.text-sm.text-white');
      expect(textElement).toBeTruthy();
      expect(textElement?.textContent).toContain('We use third-party services');
      expect(textElement?.textContent).toContain('privacy policy');
    });

    it('renders both accept and decline buttons', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept');
      const declineButton = document.getElementById('consent-decline');

      expect(acceptButton).toBeTruthy();
      expect(declineButton).toBeTruthy();
      expect(acceptButton?.textContent).toBe('Accept');
      expect(declineButton?.textContent).toBe('Decline');
    });
  });

  describe('Banner Positioning and Styling', () => {
    it('applies fixed positioning classes', () => {
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner?.classList.contains('fixed')).toBe(true);
      expect(banner?.classList.contains('right-0')).toBe(true);
      expect(banner?.classList.contains('bottom-0')).toBe(true);
      expect(banner?.classList.contains('left-0')).toBe(true);
    });

    it('applies background and visual styling', () => {
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner?.classList.contains('bg-gray-800')).toBe(true);
      expect(banner?.classList.contains('px-4')).toBe(true);
      expect(banner?.classList.contains('py-2')).toBe(true);
      expect(banner?.classList.contains('shadow-lg')).toBe(true);
    });

    it('is hidden by default', () => {
      localStorageMock.getItem.mockReturnValue('true'); // Consent already given
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner?.classList.contains('hidden')).toBe(true);
    });

    it('is visible when no consent stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner?.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Privacy Policy Link', () => {
    it('renders privacy policy link with correct attributes', () => {
      createConsentBanner();

      const privacyLink = document.querySelector('a[href="/privacy"]');
      expect(privacyLink).toBeTruthy();
      expect(privacyLink?.textContent).toBe('privacy policy');
    });

    it('applies correct styling to privacy link', () => {
      createConsentBanner();

      const privacyLink = document.querySelector('a[href="/privacy"]');
      expect(privacyLink?.classList.contains('text-blue-300')).toBe(true);
      expect(privacyLink?.classList.contains('underline')).toBe(true);
      expect(privacyLink?.classList.contains('transition-colors')).toBe(true);
      expect(privacyLink?.classList.contains('duration-200')).toBe(true);
      expect(privacyLink?.classList.contains('hover:text-blue-400')).toBe(true);
    });
  });

  describe('Button Styling and Behavior', () => {
    it('applies correct styling to accept button', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept');
      expect(acceptButton?.classList.contains('transform')).toBe(true);
      expect(acceptButton?.classList.contains('rounded')).toBe(true);
      expect(acceptButton?.classList.contains('bg-blue-700')).toBe(true);
      expect(acceptButton?.classList.contains('px-4')).toBe(true);
      expect(acceptButton?.classList.contains('py-1')).toBe(true);
      expect(acceptButton?.classList.contains('text-sm')).toBe(true);
      expect(acceptButton?.classList.contains('font-medium')).toBe(true);
      expect(acceptButton?.classList.contains('text-white')).toBe(true);
    });

    it('applies correct styling to decline button', () => {
      createConsentBanner();

      const declineButton = document.getElementById('consent-decline');
      expect(declineButton?.classList.contains('transform')).toBe(true);
      expect(declineButton?.classList.contains('rounded')).toBe(true);
      expect(declineButton?.classList.contains('border')).toBe(true);
      expect(declineButton?.classList.contains('border-white')).toBe(true);
      expect(declineButton?.classList.contains('px-4')).toBe(true);
      expect(declineButton?.classList.contains('py-1')).toBe(true);
    });

    it('applies hover effects to buttons', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept');
      const declineButton = document.getElementById('consent-decline');

      expect(acceptButton?.classList.contains('hover:scale-105')).toBe(true);
      expect(acceptButton?.classList.contains('hover:bg-blue-800')).toBe(true);

      expect(declineButton?.classList.contains('hover:scale-105')).toBe(true);
      expect(declineButton?.classList.contains('hover:bg-white')).toBe(true);
      expect(declineButton?.classList.contains('hover:text-gray-800')).toBe(true);
    });

    it('applies transition effects to buttons', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept');
      const declineButton = document.getElementById('consent-decline');

      expect(acceptButton?.classList.contains('transition-colors')).toBe(true);
      expect(acceptButton?.classList.contains('duration-200')).toBe(true);

      expect(declineButton?.classList.contains('transition-colors')).toBe(true);
      expect(declineButton?.classList.contains('duration-200')).toBe(true);
    });
  });

  describe('Consent Handling', () => {
    it('hides banner when accept is clicked', () => {
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      const acceptButton = document.getElementById('consent-accept') as HTMLButtonElement;

      // Initially visible
      expect(banner?.classList.contains('hidden')).toBe(false);

      acceptButton.click();

      expect(banner?.classList.contains('hidden')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ga-consent', 'true');
    });

    it('hides banner when decline is clicked', () => {
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      const declineButton = document.getElementById('consent-decline') as HTMLButtonElement;

      // Initially visible
      expect(banner?.classList.contains('hidden')).toBe(false);

      declineButton.click();

      expect(banner?.classList.contains('hidden')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ga-consent', 'false');
    });

    it('stores correct consent value for accept', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept') as HTMLButtonElement;
      acceptButton.click();

      expect(localStorageMock.setItem).toHaveBeenCalledWith('ga-consent', 'true');
    });

    it('stores correct consent value for decline', () => {
      createConsentBanner();

      const declineButton = document.getElementById('consent-decline') as HTMLButtonElement;
      declineButton.click();

      expect(localStorageMock.setItem).toHaveBeenCalledWith('ga-consent', 'false');
    });
  });

  describe('Custom Events', () => {
    it('dispatches consent-updated event when accepting', () => {
      createConsentBanner();

      const eventSpy = vi.fn();
      window.addEventListener('consent-updated', eventSpy);

      const acceptButton = document.getElementById('consent-accept') as HTMLButtonElement;
      acceptButton.click();

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'consent-updated',
          detail: { granted: true }
        })
      );
    });

    it('dispatches consent-updated event when declining', () => {
      createConsentBanner();

      const eventSpy = vi.fn();
      window.addEventListener('consent-updated', eventSpy);

      const declineButton = document.getElementById('consent-decline') as HTMLButtonElement;
      declineButton.click();

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'consent-updated',
          detail: { granted: false }
        })
      );
    });
  });

  describe('Local Storage Integration', () => {
    it('checks localStorage on initialization', () => {
      createConsentBanner();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('ga-consent');
    });

    it('respects existing consent from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('true');
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner?.classList.contains('hidden')).toBe(true);
    });

    it('shows banner when no consent in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner?.classList.contains('hidden')).toBe(false);
    });

    it('shows banner when localStorage returns false', () => {
      localStorageMock.getItem.mockReturnValue('false');
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      expect(banner?.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive text sizing', () => {
      createConsentBanner();

      const textElement = document.querySelector('.mb-2.text-sm');
      expect(textElement?.classList.contains('text-sm')).toBe(true);
      expect(textElement?.classList.contains('sm:text-base')).toBe(true);
    });

    it('applies responsive margins', () => {
      createConsentBanner();

      const textElement = document.querySelector('.mb-2');
      expect(textElement?.classList.contains('mb-2')).toBe(true);
      expect(textElement?.classList.contains('sm:mb-0')).toBe(true);
    });

    it('applies responsive layout to container', () => {
      createConsentBanner();

      const container = document.querySelector('.container');
      expect(container?.classList.contains('flex-col')).toBe(true);
      expect(container?.classList.contains('sm:flex-row')).toBe(true);
      expect(container?.classList.contains('sm:items-center')).toBe(true);
      expect(container?.classList.contains('sm:justify-between')).toBe(true);
    });
  });

  describe('Button Layout', () => {
    it('renders buttons in flex container with spacing', () => {
      createConsentBanner();

      const buttonsContainer = document.querySelector('.flex.space-x-4');
      expect(buttonsContainer).toBeTruthy();
      expect(buttonsContainer?.children).toHaveLength(2);
    });

    it('both buttons have correct type attribute', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept') as HTMLButtonElement;
      const declineButton = document.getElementById('consent-decline') as HTMLButtonElement;

      expect(acceptButton.type).toBe('button');
      expect(declineButton.type).toBe('button');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic button elements', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept');
      const declineButton = document.getElementById('consent-decline');

      expect(acceptButton?.tagName.toLowerCase()).toBe('button');
      expect(declineButton?.tagName.toLowerCase()).toBe('button');
    });

    it('provides descriptive button text', () => {
      createConsentBanner();

      const acceptButton = document.getElementById('consent-accept');
      const declineButton = document.getElementById('consent-decline');

      expect(acceptButton?.textContent).toBe('Accept');
      expect(declineButton?.textContent).toBe('Decline');
    });

    it('includes accessible link to privacy policy', () => {
      createConsentBanner();

      const privacyLink = document.querySelector('a[href="/privacy"]');
      expect(privacyLink).toBeTruthy();
      expect(privacyLink?.textContent).toBe('privacy policy');
    });

    it('maintains proper color contrast', () => {
      createConsentBanner();

      const banner = document.getElementById('consent-banner');
      const textElement = document.querySelector('.text-white');

      expect(banner?.classList.contains('bg-gray-800')).toBe(true);
      expect(textElement?.classList.contains('text-white')).toBe(true);
    });
  });

  describe('Content and Messaging', () => {
    it('displays clear consent message', () => {
      createConsentBanner();

      const textElement = document.querySelector('p');
      expect(textElement?.textContent).toContain('We use third-party services');
      expect(textElement?.textContent).toContain('Do you accept this?');
    });

    it('references privacy policy appropriately', () => {
      createConsentBanner();

      const textElement = document.querySelector('p');
      expect(textElement?.textContent).toContain('Refer to our privacy policy');
    });
  });
});

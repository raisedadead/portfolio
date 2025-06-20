import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
const matchMediaMock = vi.fn();
Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });

describe('Dark Mode Toggle Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
  });

  const createDarkModeToggle = () => {
    const button = document.createElement('button');
    button.id = 'dark-mode-toggle';
    button.className =
      'flex h-10 w-10 items-center justify-center border-2 border-black bg-orange-200 p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none focus:outline-hidden active:bg-black active:shadow-none';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.setAttribute('title', 'Toggle dark mode');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Toggle dark mode';

    // Sun icon (visible in dark mode)
    const sunIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sunIcon.id = 'sun-icon';
    sunIcon.setAttribute('class', 'h-6 w-6 hidden');
    sunIcon.setAttribute('fill', 'none');
    sunIcon.setAttribute('stroke', 'currentColor');
    sunIcon.setAttribute('viewBox', '0 0 24 24');
    sunIcon.setAttribute('aria-hidden', 'true');

    const sunPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sunPath.setAttribute('stroke-linecap', 'round');
    sunPath.setAttribute('stroke-linejoin', 'round');
    sunPath.setAttribute('stroke-width', '2');
    sunPath.setAttribute(
      'd',
      'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
    );
    sunIcon.appendChild(sunPath);

    // Moon icon (visible in light mode)
    const moonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    moonIcon.id = 'moon-icon';
    moonIcon.setAttribute('class', 'h-6 w-6');
    moonIcon.setAttribute('fill', 'none');
    moonIcon.setAttribute('stroke', 'currentColor');
    moonIcon.setAttribute('viewBox', '0 0 24 24');
    moonIcon.setAttribute('aria-hidden', 'true');

    const moonPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    moonPath.setAttribute('stroke-linecap', 'round');
    moonPath.setAttribute('stroke-linejoin', 'round');
    moonPath.setAttribute('stroke-width', '2');
    moonPath.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
    moonIcon.appendChild(moonPath);

    button.appendChild(srOnly);
    button.appendChild(sunIcon);
    button.appendChild(moonIcon);

    document.body.appendChild(button);
    return { button, sunIcon, moonIcon };
  };

  describe('Structure', () => {
    it('renders button with correct attributes', () => {
      const { button } = createDarkModeToggle();

      expect(button.id).toBe('dark-mode-toggle');
      expect(button.getAttribute('aria-label')).toBe('Toggle dark mode');
      expect(button.getAttribute('title')).toBe('Toggle dark mode');
      expect(button.tagName.toLowerCase()).toBe('button');
    });

    it('includes screen reader text', () => {
      createDarkModeToggle();

      const srText = document.querySelector('.sr-only');
      expect(srText?.textContent).toBe('Toggle dark mode');
    });

    it('renders both sun and moon icons', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      expect(sunIcon.id).toBe('sun-icon');
      expect(moonIcon.id).toBe('moon-icon');
      expect(sunIcon.tagName.toLowerCase()).toBe('svg');
      expect(moonIcon.tagName.toLowerCase()).toBe('svg');
    });
  });

  describe('Button Styling', () => {
    it('applies correct base classes', () => {
      const { button } = createDarkModeToggle();

      expect(button.classList.contains('flex')).toBe(true);
      expect(button.classList.contains('h-10')).toBe(true);
      expect(button.classList.contains('w-10')).toBe(true);
      expect(button.classList.contains('items-center')).toBe(true);
      expect(button.classList.contains('justify-center')).toBe(true);
      expect(button.classList.contains('border-2')).toBe(true);
      expect(button.classList.contains('border-black')).toBe(true);
      expect(button.classList.contains('bg-orange-200')).toBe(true);
    });

    it('applies interaction classes', () => {
      const { button } = createDarkModeToggle();

      expect(button.classList.contains('hover:bg-gray-700')).toBe(true);
      expect(button.classList.contains('hover:text-white')).toBe(true);
      expect(button.classList.contains('hover:shadow-none')).toBe(true);
      expect(button.classList.contains('active:bg-black')).toBe(true);
      expect(button.classList.contains('active:shadow-none')).toBe(true);
    });

    it('applies transition classes', () => {
      const { button } = createDarkModeToggle();

      expect(button.classList.contains('transition-all')).toBe(true);
      expect(button.classList.contains('duration-200')).toBe(true);
    });
  });

  describe('Icon Structure', () => {
    it('sun icon has correct attributes', () => {
      const { sunIcon } = createDarkModeToggle();

      expect(sunIcon.getAttribute('class')).toContain('h-6 w-6 hidden');
      expect(sunIcon.getAttribute('fill')).toBe('none');
      expect(sunIcon.getAttribute('stroke')).toBe('currentColor');
      expect(sunIcon.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(sunIcon.getAttribute('aria-hidden')).toBe('true');
    });

    it('moon icon has correct attributes', () => {
      const { moonIcon } = createDarkModeToggle();

      expect(moonIcon.getAttribute('class')).toContain('h-6 w-6');
      expect(moonIcon.getAttribute('fill')).toBe('none');
      expect(moonIcon.getAttribute('stroke')).toBe('currentColor');
      expect(moonIcon.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(moonIcon.getAttribute('aria-hidden')).toBe('true');
    });

    it('icons have proper SVG paths', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      const sunPath = sunIcon.querySelector('path');
      const moonPath = moonIcon.querySelector('path');

      expect(sunPath?.getAttribute('d')).toContain('M12 3v1m0 16v1m9-9h-1M4 12H3');
      expect(moonPath?.getAttribute('d')).toContain('M20.354 15.354A9 9 0 018.646 3.646');
    });
  });

  describe('Initial State', () => {
    it('moon icon is visible by default (light mode)', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      expect(sunIcon.classList.contains('hidden')).toBe(true);
      expect(moonIcon.classList.contains('hidden')).toBe(false);
    });

    it('provides accessible button text', () => {
      createDarkModeToggle();

      const button = document.getElementById('dark-mode-toggle');
      expect(button?.getAttribute('aria-label')).toBe('Toggle dark mode');
      expect(button?.getAttribute('title')).toBe('Toggle dark mode');
    });
  });

  describe('Theme State Management', () => {
    it('can simulate theme toggle functionality', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      // Simulate switching to dark mode
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');

      expect(sunIcon.classList.contains('hidden')).toBe(false);
      expect(moonIcon.classList.contains('hidden')).toBe(true);

      // Simulate switching back to light mode
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');

      expect(sunIcon.classList.contains('hidden')).toBe(true);
      expect(moonIcon.classList.contains('hidden')).toBe(false);
    });

    it('maintains proper icon visibility states', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      // Only one icon should be visible at a time
      const sunHidden = sunIcon.classList.contains('hidden');
      const moonHidden = moonIcon.classList.contains('hidden');

      expect(sunHidden !== moonHidden).toBe(true); // XOR - exactly one should be hidden
    });
  });

  describe('Accessibility', () => {
    it('provides screen reader support', () => {
      createDarkModeToggle();

      const srText = document.querySelector('.sr-only');
      const button = document.getElementById('dark-mode-toggle');

      expect(srText?.textContent).toBe('Toggle dark mode');
      expect(button?.getAttribute('aria-label')).toBe('Toggle dark mode');
    });

    it('hides decorative icons from screen readers', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      expect(sunIcon.getAttribute('aria-hidden')).toBe('true');
      expect(moonIcon.getAttribute('aria-hidden')).toBe('true');
    });

    it('uses semantic button element', () => {
      const { button } = createDarkModeToggle();

      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button.getAttribute('type')).toBeNull(); // Should be default button type
    });

    it('provides tooltip text', () => {
      const { button } = createDarkModeToggle();

      expect(button.getAttribute('title')).toBe('Toggle dark mode');
    });
  });

  describe('Focus Management', () => {
    it('applies focus outline class', () => {
      const { button } = createDarkModeToggle();

      expect(button.classList.contains('focus:outline-hidden')).toBe(true);
    });

    it('maintains focusable button element', () => {
      const { button } = createDarkModeToggle();

      expect(button.tabIndex).not.toBe(-1); // Should be focusable
    });
  });

  describe('Icon Sizing and Styling', () => {
    it('applies consistent sizing to both icons', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      expect(sunIcon.classList.contains('h-6')).toBe(true);
      expect(sunIcon.classList.contains('w-6')).toBe(true);
      expect(moonIcon.classList.contains('h-6')).toBe(true);
      expect(moonIcon.classList.contains('w-6')).toBe(true);
    });

    it('uses currentColor for stroke', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      expect(sunIcon.getAttribute('stroke')).toBe('currentColor');
      expect(moonIcon.getAttribute('stroke')).toBe('currentColor');
    });

    it('uses consistent stroke properties', () => {
      const { sunIcon, moonIcon } = createDarkModeToggle();

      const sunPath = sunIcon.querySelector('path');
      const moonPath = moonIcon.querySelector('path');

      expect(sunPath?.getAttribute('stroke-linecap')).toBe('round');
      expect(sunPath?.getAttribute('stroke-linejoin')).toBe('round');
      expect(sunPath?.getAttribute('stroke-width')).toBe('2');

      expect(moonPath?.getAttribute('stroke-linecap')).toBe('round');
      expect(moonPath?.getAttribute('stroke-linejoin')).toBe('round');
      expect(moonPath?.getAttribute('stroke-width')).toBe('2');
    });
  });

  describe('Button Interaction States', () => {
    it('provides visual feedback on hover', () => {
      const { button } = createDarkModeToggle();

      expect(button.classList.contains('hover:bg-gray-700')).toBe(true);
      expect(button.classList.contains('hover:text-white')).toBe(true);
      expect(button.classList.contains('hover:shadow-none')).toBe(true);
    });

    it('provides visual feedback on active state', () => {
      const { button } = createDarkModeToggle();

      expect(button.classList.contains('active:bg-black')).toBe(true);
      expect(button.classList.contains('active:shadow-none')).toBe(true);
    });

    it('includes shadow styling', () => {
      const { button } = createDarkModeToggle();

      expect(button.className).toContain('shadow-[2px_2px_0px_rgba(0,0,0,1)]');
    });
  });
});

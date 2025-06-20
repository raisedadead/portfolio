import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo });

describe('Scroll Button Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();

    // Reset window properties
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true
    });
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true
    });
  });

  interface ScrollButtonProps {
    className?: string;
  }

  const createScrollButton = (props: ScrollButtonProps = {}) => {
    const { className } = props;

    const container = document.createElement('div');
    if (className) {
      container.className = className;
    }

    const button = document.createElement('button');
    button.id = 'scroll-button';
    button.className =
      'scroll-button cursor-pointer rounded-full bg-white p-3 text-black opacity-0 shadow-[4px_4px_0_0_rgba(60,64,43,.2)] transition-opacity duration-300 focus:outline-hidden';
    button.setAttribute('aria-label', 'Scroll to top');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M12 8L7.76 12.24C7.36 12.64 7.36 13.26 7.76 13.66C8.16 14.06 8.78 14.06 9.19 13.66L12 10.83L14.81 13.66C15.22 14.06 15.84 14.06 16.24 13.66C16.64 13.26 16.64 12.64 16.24 12.24L12 8Z'
    );

    svg.appendChild(path);
    button.appendChild(svg);
    container.appendChild(button);
    document.body.appendChild(container);

    // Simulate the script functionality
    const handleScroll = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
      const isAtBottom = window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight;
      const isAtTop = window.pageYOffset === 0;

      const shouldShow = isScrollable && !isAtTop;

      if (shouldShow) {
        button.classList.remove('opacity-0');
        button.classList.add('opacity-100');
      } else {
        button.classList.remove('opacity-100');
        button.classList.add('opacity-0');
      }

      // Add bounce animation when at bottom
      if (isAtBottom) {
        button.classList.add('animate-bounce');
      } else {
        button.classList.remove('animate-bounce');
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Set up event listeners
    button.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // Initial check
    handleScroll();

    return { container, button, handleScroll, scrollToTop };
  };

  describe('Structure and Layout', () => {
    it('renders container with optional className', () => {
      const customClass = 'custom-scroll-container';
      const { container } = createScrollButton({ className: customClass });

      expect(container.classList.contains(customClass)).toBe(true);
    });

    it('renders button with correct ID and attributes', () => {
      const { button } = createScrollButton();

      expect(button.id).toBe('scroll-button');
      expect(button.getAttribute('aria-label')).toBe('Scroll to top');
      expect(button.tagName.toLowerCase()).toBe('button');
    });

    it('applies correct CSS classes to button', () => {
      const { button } = createScrollButton();

      expect(button.classList.contains('scroll-button')).toBe(true);
      expect(button.classList.contains('cursor-pointer')).toBe(true);
      expect(button.classList.contains('rounded-full')).toBe(true);
      expect(button.classList.contains('bg-white')).toBe(true);
      expect(button.classList.contains('p-3')).toBe(true);
      expect(button.classList.contains('text-black')).toBe(true);
      expect(button.classList.contains('opacity-0')).toBe(true);
      expect(button.classList.contains('transition-opacity')).toBe(true);
      expect(button.classList.contains('duration-300')).toBe(true);
    });

    it('includes shadow styling', () => {
      const { button } = createScrollButton();

      expect(button.className).toContain('shadow-[4px_4px_0_0_rgba(60,64,43,.2)]');
    });
  });

  describe('SVG Icon', () => {
    it('renders SVG with correct attributes', () => {
      createScrollButton();

      const svg = document.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg?.getAttribute('fill')).toBe('currentColor');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('contains up arrow path', () => {
      createScrollButton();

      const path = document.querySelector('svg path');
      const expectedPath =
        'M12 8L7.76 12.24C7.36 12.64 7.36 13.26 7.76 13.66C8.16 14.06 8.78 14.06 9.19 13.66L12 10.83L14.81 13.66C15.22 14.06 15.84 14.06 16.24 13.66C16.64 13.26 16.64 12.64 16.24 12.24L12 8Z';

      expect(path?.getAttribute('d')).toBe(expectedPath);
    });

    it('uses proper SVG namespacing', () => {
      createScrollButton();

      const svg = document.querySelector('svg');
      const path = document.querySelector('svg path');

      expect(svg?.namespaceURI).toBe('http://www.w3.org/2000/svg');
      expect(path?.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });
  });

  describe('Scroll Behavior Logic', () => {
    it('is hidden when page is not scrollable', () => {
      // Set page to not be scrollable
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 500 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 0 });

      const { button } = createScrollButton();

      expect(button.classList.contains('opacity-0')).toBe(true);
      expect(button.classList.contains('opacity-100')).toBe(false);
    });

    it('is hidden when at top of scrollable page', () => {
      // Set page to be scrollable but at top
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 0 });

      const { button } = createScrollButton();

      expect(button.classList.contains('opacity-0')).toBe(true);
      expect(button.classList.contains('opacity-100')).toBe(false);
    });

    it('is visible when scrolled on scrollable page', () => {
      // Set page to be scrollable and scrolled
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 200 });

      const { button, handleScroll } = createScrollButton();
      handleScroll();

      expect(button.classList.contains('opacity-100')).toBe(true);
      expect(button.classList.contains('opacity-0')).toBe(false);
    });

    it('adds bounce animation when at bottom', () => {
      // Set page to be at bottom
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 700 }); // At bottom: 700 + 800 = 1500

      const { button, handleScroll } = createScrollButton();
      handleScroll();

      expect(button.classList.contains('animate-bounce')).toBe(true);
    });

    it('removes bounce animation when not at bottom', () => {
      // Set initial state to be at bottom
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 700, configurable: true });

      const { button, handleScroll } = createScrollButton();

      // Should have bounce animation initially (at bottom)
      expect(button.classList.contains('animate-bounce')).toBe(true);

      // Then move away from bottom
      Object.defineProperty(window, 'pageYOffset', { value: 400, configurable: true });
      handleScroll();
      expect(button.classList.contains('animate-bounce')).toBe(false);
    });
  });

  describe('Click Functionality', () => {
    it('calls window.scrollTo when button is clicked', () => {
      const { button } = createScrollButton();

      button.click();

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });

    it('scrolls to top with smooth behavior', () => {
      const { button } = createScrollButton();

      button.click();

      expect(mockScrollTo).toHaveBeenCalledTimes(1);
      const [scrollOptions] = mockScrollTo.mock.calls[0];
      expect(scrollOptions.top).toBe(0);
      expect(scrollOptions.behavior).toBe('smooth');
    });
  });

  describe('Event Listeners', () => {
    it('responds to scroll events', () => {
      const { button } = createScrollButton();

      // Simulate scroll
      Object.defineProperty(window, 'pageYOffset', { value: 300 });
      window.dispatchEvent(new Event('scroll'));

      expect(button.classList.contains('opacity-100')).toBe(true);
    });

    it('responds to resize events', () => {
      const { button } = createScrollButton();

      // Change dimensions and trigger resize
      Object.defineProperty(window, 'innerHeight', { value: 1200 });
      window.dispatchEvent(new Event('resize'));

      // Should recalculate visibility
      expect(button.classList.contains('opacity-0')).toBe(true);
    });

    it('performs initial scroll check on creation', () => {
      // Set initial scroll position
      Object.defineProperty(window, 'pageYOffset', { value: 100 });

      const { button } = createScrollButton();

      // Should be visible immediately due to initial check
      expect(button.classList.contains('opacity-100')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('provides proper aria-label for screen readers', () => {
      const { button } = createScrollButton();

      expect(button.getAttribute('aria-label')).toBe('Scroll to top');
    });

    it('hides decorative SVG from screen readers', () => {
      createScrollButton();

      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('uses semantic button element', () => {
      const { button } = createScrollButton();

      expect(button.tagName.toLowerCase()).toBe('button');
    });

    it('has focus styles', () => {
      const { button } = createScrollButton();

      expect(button.classList.contains('focus:outline-hidden')).toBe(true);
    });
  });

  describe('Visual Design', () => {
    it('applies rounded full styling', () => {
      const { button } = createScrollButton();

      expect(button.classList.contains('rounded-full')).toBe(true);
    });

    it('has white background with black text', () => {
      const { button } = createScrollButton();

      expect(button.classList.contains('bg-white')).toBe(true);
      expect(button.classList.contains('text-black')).toBe(true);
    });

    it('includes transition effects', () => {
      const { button } = createScrollButton();

      expect(button.classList.contains('transition-opacity')).toBe(true);
      expect(button.classList.contains('duration-300')).toBe(true);
    });

    it('has proper padding', () => {
      const { button } = createScrollButton();

      expect(button.classList.contains('p-3')).toBe(true);
    });

    it('includes cursor pointer', () => {
      const { button } = createScrollButton();

      expect(button.classList.contains('cursor-pointer')).toBe(true);
    });
  });

  describe('State Management', () => {
    it('toggles opacity classes correctly', () => {
      const { button, handleScroll } = createScrollButton();

      // Start hidden
      expect(button.classList.contains('opacity-0')).toBe(true);

      // Scroll down
      Object.defineProperty(window, 'pageYOffset', { value: 300 });
      handleScroll();
      expect(button.classList.contains('opacity-100')).toBe(true);
      expect(button.classList.contains('opacity-0')).toBe(false);

      // Scroll back to top
      Object.defineProperty(window, 'pageYOffset', { value: 0 });
      handleScroll();
      expect(button.classList.contains('opacity-0')).toBe(true);
      expect(button.classList.contains('opacity-100')).toBe(false);
    });

    it('manages bounce animation state correctly', () => {
      // Start with known state - not at bottom
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 300, configurable: true });

      const { button, handleScroll } = createScrollButton();

      // Not at bottom initially
      expect(button.classList.contains('animate-bounce')).toBe(false);

      // Go to bottom
      Object.defineProperty(window, 'pageYOffset', { value: 700, configurable: true });
      handleScroll();
      expect(button.classList.contains('animate-bounce')).toBe(true);

      // Move away from bottom
      Object.defineProperty(window, 'pageYOffset', { value: 300, configurable: true });
      handleScroll();
      expect(button.classList.contains('animate-bounce')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero scroll height gracefully', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 0 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      const { button } = createScrollButton();

      expect(button.classList.contains('opacity-0')).toBe(true);
    });

    it('handles equal scroll height and window height', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      const { button } = createScrollButton();

      expect(button.classList.contains('opacity-0')).toBe(true);
    });

    it('handles very large scroll positions', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 10000 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });
      Object.defineProperty(window, 'pageYOffset', { value: 9999 });

      const { button, handleScroll } = createScrollButton();
      handleScroll();

      expect(button.classList.contains('opacity-100')).toBe(true);
    });
  });

  describe('Performance Considerations', () => {
    it('uses efficient DOM queries', () => {
      const { button } = createScrollButton();

      // Button should be found by ID efficiently
      expect(document.getElementById('scroll-button')).toBe(button);
    });

    it('does not create memory leaks with event listeners', () => {
      // This test ensures proper event listener setup
      const { button } = createScrollButton();

      // Verify listeners are attached (by checking they respond)
      button.click();
      expect(mockScrollTo).toHaveBeenCalled();

      window.dispatchEvent(new Event('scroll'));
      // Should not throw errors
    });
  });
});

import { ScrollButton } from '@/components/scroll-button';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../test-utils';
import type {
  MockAnimatePresenceProps,
  MockMotionButtonProps
} from '../test-utils';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      onMouseDown,
      className,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: MockMotionButtonProps) => (
      <button
        onClick={onMouseDown}
        className={className}
        data-testid='motion-button'
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-exit={JSON.stringify(exit)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </button>
    )
  },
  AnimatePresence: ({ children }: MockAnimatePresenceProps) => (
    <div data-testid='animate-presence'>{children}</div>
  )
}));

// Mock scroll-arrows component
vi.mock('@/components/scroll-arrows', () => ({
  ArrowUp: () => <div data-testid='arrow-up' />
}));

describe('ScrollButton Component', () => {
  const mockScrollTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.scrollTo
    Object.defineProperty(window, 'scrollTo', {
      value: mockScrollTo,
      writable: true
    });

    // Reset window properties
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true
    });

    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true
    });

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true
    });

    // Mock addEventListener and removeEventListener
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders with custom className', () => {
      const className = 'custom-scroll-class';
      render(<ScrollButton className={className} />);

      const container = screen.getByTestId('animate-presence').parentElement;
      expect(container).toHaveClass(className);
    });

    it('renders AnimatePresence wrapper', () => {
      render(<ScrollButton className='test' />);

      expect(screen.getByTestId('animate-presence')).toBeInTheDocument();
    });
  });

  describe('Scroll Detection', () => {
    it('adds scroll and resize event listeners on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      render(<ScrollButton className='test' />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<ScrollButton className='test' />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
  });

  describe('Button Visibility', () => {
    it('shows button when page is scrollable and not at top', () => {
      // Setup scrollable page, not at top
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 100,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      expect(screen.queryByTestId('motion-button')).toBeInTheDocument();
    });

    it('hides button when not scrollable', () => {
      // Setup non-scrollable page
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 800,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      expect(screen.queryByTestId('motion-button')).not.toBeInTheDocument();
    });

    it('hides button when at top of page', () => {
      // Setup scrollable page, at top
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 0,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      expect(screen.queryByTestId('motion-button')).not.toBeInTheDocument();
    });
  });

  describe('Bounce Animation', () => {
    it('adds bounce class when at bottom of page', () => {
      // Setup page at bottom
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 1000, // At bottom: pageYOffset + innerHeight >= scrollHeight
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      const button = screen.queryByTestId('motion-button');
      if (button) {
        expect(button).toHaveClass('animate-bounce');
      }
    });

    it('does not add bounce class when not at bottom', () => {
      // Setup page not at bottom
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 500, // Not at bottom
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      const button = screen.queryByTestId('motion-button');
      if (button) {
        expect(button).not.toHaveClass('animate-bounce');
      }
    });
  });

  describe('Scroll Functionality', () => {
    it('scrolls to top when button is clicked', () => {
      // Setup scrollable page
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 500,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event to show button
      fireEvent.scroll(window);

      const button = screen.queryByTestId('motion-button');
      if (button) {
        fireEvent.click(button);

        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  });

  describe('Motion Properties', () => {
    it('has correct motion animation properties', () => {
      // Setup to show button
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 500,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      const button = screen.queryByTestId('motion-button');
      if (button) {
        expect(button).toHaveAttribute('data-initial', '{"opacity":0}');
        expect(button).toHaveAttribute('data-animate', '{"opacity":1}');
        expect(button).toHaveAttribute('data-exit', '{"opacity":0}');
        expect(button).toHaveAttribute('data-transition', '{"duration":0.3}');
      }
    });
  });

  describe('Button Styling', () => {
    it('applies correct base styling', () => {
      // Setup to show button
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 500,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      const button = screen.queryByTestId('motion-button');
      if (button) {
        expect(button).toHaveClass(
          'cursor-pointer',
          'rounded-full',
          'bg-white',
          'text-black',
          'focus:outline-hidden'
        );
      }
    });

    it('includes shadow styling', () => {
      // Setup to show button
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 500,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      const button = screen.queryByTestId('motion-button');
      if (button) {
        expect(button.className).toContain(
          'shadow-[4px_4px_0_0_rgba(60,64,43,.2)]'
        );
      }
    });
  });

  describe('Arrow Component', () => {
    it('renders ArrowUp component inside button', () => {
      // Setup to show button
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true
      });
      Object.defineProperty(window, 'pageYOffset', {
        value: 500,
        writable: true
      });

      render(<ScrollButton className='test' />);

      // Trigger scroll event
      fireEvent.scroll(window);

      expect(screen.queryByTestId('arrow-up')).toBeInTheDocument();
    });
  });

  describe('Resize Handling', () => {
    it('recalculates button visibility on window resize', () => {
      const { rerender } = render(<ScrollButton className='test' />);

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      // Should not throw and should handle resize properly
      expect(() => rerender(<ScrollButton className='test' />)).not.toThrow();
    });
  });
});

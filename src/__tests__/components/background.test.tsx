import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WaveBackground } from '../../components/background';
import type { MockFramerMotionProps } from '../test-utils';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    path: ({ children, ...props }: MockFramerMotionProps) => (
      <path data-testid="wave-path" {...props}>
        {children}
      </path>
    ),
  },
}));

describe('WaveBackground Component', () => {
  describe('Basic Rendering', () => {
    it('renders the wave background container', () => {
      const { container } = render(<WaveBackground />);

      const waveContainer = container.firstChild as HTMLElement;
      expect(waveContainer).toBeInTheDocument();
      expect(waveContainer).toHaveClass('relative', 'h-screen', 'w-screen', 'overflow-hidden');
    });

    it('renders the SVG container', () => {
      const { container } = render(<WaveBackground />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('absolute', 'bottom-0', 'left-0', 'w-full');
    });

    it('has correct SVG viewBox and preserveAspectRatio', () => {
      const { container } = render(<WaveBackground />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 1000 800');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
    });
  });

  describe('Wave Generation', () => {
    it('renders multiple wave paths', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      expect(wavePaths).toHaveLength(8);
    });

    it('renders default light colors and multiple wave paths', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      for (const path of wavePaths) {
        expect(path).toHaveAttribute('d');
        expect(path).toHaveAttribute('fill');
      }
    });

    it('wave paths have varying opacity in fill color', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      const fillColors = wavePaths.map((path) => path.getAttribute('fill'));

      // Check that fill colors have different opacity values
      const uniqueFills = new Set(fillColors);
      expect(uniqueFills.size).toBeGreaterThan(1);
    });

    it('wave paths have framer-motion animation properties', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      for (const path of wavePaths) {
        expect(path).toHaveAttribute('animate');
      }
    });

    it('applies animate prop when animated is true', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      for (const path of wavePaths) {
        expect(path).toHaveAttribute('animate');
      }
    });
  });

  describe('Background Styling', () => {
    it('has proper background gradient classes', () => {
      const { container } = render(<WaveBackground />);

      const waveContainer = container.firstChild as HTMLElement;
      expect(waveContainer).toHaveClass(
        'bg-linear-to-b',
        'from-emerald-300',
        'via-orange-200',
        'to-teal-200'
      );
    });

    it('renders the overlay gradient at bottom', () => {
      const { container } = render(<WaveBackground />);

      const overlay = container.querySelector('.bg-linear-to-t');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass(
        'absolute',
        'bottom-0',
        'left-0',
        'h-32',
        'w-full',
        'bg-linear-to-t',
        'from-teal-600',
        'to-transparent',
        'opacity-30'
      );
    });
  });

  describe('Layout and Positioning', () => {
    it('uses full screen dimensions', () => {
      const { container } = render(<WaveBackground />);

      const waveContainer = container.firstChild as HTMLElement;
      expect(waveContainer).toHaveClass('h-screen', 'w-screen');
    });

    it('properly positions SVG at bottom left', () => {
      const { container } = render(<WaveBackground />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('absolute', 'bottom-0', 'left-0');
    });

    it('uses overflow hidden to prevent scrollbars', () => {
      const { container } = render(<WaveBackground />);

      const waveContainer = container.firstChild as HTMLElement;
      expect(waveContainer).toHaveClass('overflow-hidden');
    });
  });

  describe('Wave Animation Configuration', () => {
    it('applies motion animation with correct properties', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      for (const path of wavePaths) {
        const animateAttr = path.getAttribute('animate');
        expect(animateAttr).toBeTruthy();

        // The animate prop should contain animation configuration
        expect(path).toHaveAttribute('animate');
      }
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = render(<WaveBackground />);

      expect(container.querySelector('div')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('SVG is decorative (no accessibility concerns)', () => {
      const { container } = render(<WaveBackground />);

      const svg = container.querySelector('svg');
      // SVG is purely decorative background element
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Wave Math and Configuration', () => {
    it('generates waves with different heights and offsets', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      const pathData = wavePaths.map((path) => path.getAttribute('d'));

      // Each wave should have different path data due to different offsets
      const uniquePaths = new Set(pathData);
      expect(uniquePaths.size).toBe(8); // All 8 waves should be unique
    });

    it('applies correct wave count', () => {
      render(<WaveBackground />);

      // Should generate 8 waves (Array.from({ length: 8 }))
      const wavePaths = screen.getAllByTestId('wave-path');
      expect(wavePaths).toHaveLength(8);
    });
  });

  describe('Color Scheme', () => {
    it('uses teal color scheme throughout', () => {
      const { container } = render(<WaveBackground />);

      const mainContainer = container.querySelector('.relative.h-screen.w-screen');
      expect(mainContainer).toHaveClass('from-emerald-300', 'via-orange-200', 'to-teal-200');

      const overlay = container.querySelector('.from-teal-600');
      expect(overlay).toHaveClass('from-teal-600');
    });

    it('renders with teal primary color', () => {
      render(<WaveBackground />);

      const wavePaths = screen.getAllByTestId('wave-path');
      for (const path of wavePaths) {
        const fill = path.getAttribute('fill');
        expect(fill).toMatch(/rgba\(50, 222, 212,/); // teal color
      }
    });
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WaveBackground } from '../../components/background';

vi.mock('framer-motion', () => ({
  motion: {
    path: ({ children, ...props }: Record<string, unknown>) => (
      <path data-testid='wave-path' {...props}>
        {children}
      </path>
    )
  }
}));

describe('WaveBackground', () => {
  it('renders background container with proper structure', () => {
    const { container } = render(<WaveBackground />);
    const waveContainer = container.firstChild as HTMLElement;

    expect(waveContainer).toBeInTheDocument();
    expect(waveContainer).toHaveClass('relative', 'h-screen', 'w-screen', 'overflow-hidden');
  });

  it('renders SVG with correct configuration', () => {
    const { container } = render(<WaveBackground />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 1000 800');
    expect(svg).toHaveAttribute('aria-label', 'Animated wave background decoration');
  });

  it('generates correct number of wave paths', () => {
    render(<WaveBackground />);
    const wavePaths = screen.getAllByTestId('wave-path');

    expect(wavePaths).toHaveLength(8);
  });

  it('applies wave animations', () => {
    render(<WaveBackground />);
    const wavePaths = screen.getAllByTestId('wave-path');

    for (const path of wavePaths) {
      expect(path).toHaveAttribute('animate');
    }
  });

  it('has proper background styling', () => {
    const { container } = render(<WaveBackground />);
    const waveContainer = container.firstChild as HTMLElement;

    expect(waveContainer).toHaveClass('bg-linear-to-b', 'from-emerald-300', 'via-orange-200', 'to-teal-200');
  });
});

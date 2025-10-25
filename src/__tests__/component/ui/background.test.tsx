import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { WaveBackground } from '@/components/background';

describe('WaveBackground', () => {
  let mockGetContext: ReturnType<typeof vi.fn>;
  let mockContext: Partial<CanvasRenderingContext2D>;

  beforeEach(() => {
    // Mock canvas context
    mockContext = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })) as unknown as typeof CanvasRenderingContext2D.prototype.createLinearGradient
    };

    mockGetContext = vi.fn(() => mockContext);

    // Mock HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = mockGetContext as typeof HTMLCanvasElement.prototype.getContext;

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(performance.now()), 0);
      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders background container with proper structure', () => {
    const { container } = render(<WaveBackground />);
    const waveContainer = container.firstChild as HTMLElement;

    expect(waveContainer).toBeInTheDocument();
    expect(waveContainer).toHaveClass('relative', 'h-screen', 'w-screen', 'overflow-hidden');
  });

  it('renders canvas with correct attributes', () => {
    const { container } = render(<WaveBackground />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-label', 'Animated wave and birds background decoration');
    expect(canvas).toHaveClass('pointer-events-none', 'absolute', 'inset-0', 'h-full', 'w-full');
  });

  it('initializes canvas context on mount', () => {
    render(<WaveBackground />);

    expect(mockGetContext).toHaveBeenCalledWith('2d');
  });

  it('has proper background styling', () => {
    const { container } = render(<WaveBackground />);
    const waveContainer = container.firstChild as HTMLElement;

    expect(waveContainer).toHaveClass('bg-linear-to-b', 'from-emerald-300', 'via-orange-200', 'to-teal-200');
  });

  it('starts animation frame on mount', () => {
    render(<WaveBackground />);

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });
});

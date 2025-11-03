import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import Background from '@/components/background/index';

describe('Background', () => {
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
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(100),
        width: 10,
        height: 10,
        colorSpace: 'srgb'
      })) as unknown as typeof CanvasRenderingContext2D.prototype.getImageData,
      putImageData: vi.fn(),
      drawImage: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })) as unknown as typeof CanvasRenderingContext2D.prototype.createLinearGradient,
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })) as unknown as typeof CanvasRenderingContext2D.prototype.createRadialGradient
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

    // Mock event listeners
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders background container with proper structure', () => {
    const { container } = render(<Background />);
    const mainElement = container.firstChild as HTMLElement;

    expect(mainElement).toBeInTheDocument();
    expect(mainElement.tagName).toBe('DIV');
    expect(mainElement.className).toContain('relative');
    expect(mainElement.className).toContain('overflow-hidden');
  });

  it('renders canvas with correct attributes', () => {
    const { container } = render(<Background />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toBeInTheDocument();
    expect(canvas?.className).toContain('absolute');
    expect(canvas?.className).toContain('pointer-events-none');
  });

  it('initializes canvas context on mount', () => {
    render(<Background />);

    expect(mockGetContext).toHaveBeenCalledWith('2d');
  });

  it('renders gradient layer', () => {
    const { container } = render(<Background />);
    // Find the gradient layer div (should have Tailwind gradient classes)
    const gradientLayer = Array.from(container.querySelectorAll('div')).find((div) =>
      div.className?.includes('bg-linear-to-b')
    );

    expect(gradientLayer).toBeInTheDocument();
    expect(gradientLayer?.className).toContain('absolute');
    expect(gradientLayer?.className).toContain('z-1');
    expect(gradientLayer?.className).toContain('bg-linear-to-b');
    expect(gradientLayer?.className).toContain('from-emerald-300');
  });

  it('renders canvas with motion wrapper', () => {
    const { container } = render(<Background />);
    const canvas = container.querySelector('canvas');
    const motionWrapper = canvas?.parentElement;

    expect(canvas).toBeInTheDocument();
    expect(motionWrapper).toBeInTheDocument();
    expect(motionWrapper?.className).toContain('absolute');
    expect(motionWrapper?.className).toContain('z-2');
  });

  it('starts animation frame on mount', () => {
    render(<Background />);

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });
});

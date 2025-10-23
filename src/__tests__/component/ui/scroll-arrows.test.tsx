import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArrowDown, ArrowUp } from '@/components/scroll-arrows';

describe('Scroll Arrows Components', () => {
  describe('ArrowDown Component', () => {
    it('renders SVG element', () => {
      const { container } = render(<ArrowDown />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct SVG attributes', () => {
      const { container } = render(<ArrowDown />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('contains path element with arrow path data', () => {
      const { container } = render(<ArrowDown />);

      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');

      const pathData = path?.getAttribute('d');
      expect(pathData).toContain('M12 16L16.24 11.76');
    });

    it('uses currentColor for fill', () => {
      const { container } = render(<ArrowDown />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('has 24x24 viewBox dimensions', () => {
      const { container } = render(<ArrowDown />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('ArrowUp Component', () => {
    it('renders SVG element', () => {
      const { container } = render(<ArrowUp />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct SVG attributes', () => {
      const { container } = render(<ArrowUp />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('contains path element with arrow path data', () => {
      const { container } = render(<ArrowUp />);

      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');

      const pathData = path?.getAttribute('d');
      expect(pathData).toContain('M12 8L7.76 12.24');
    });

    it('uses currentColor for fill', () => {
      const { container } = render(<ArrowUp />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('has 24x24 viewBox dimensions', () => {
      const { container } = render(<ArrowUp />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('Component Comparison', () => {
    it('both components have same SVG structure', () => {
      const { container: downContainer } = render(<ArrowDown />);
      const { container: upContainer } = render(<ArrowUp />);

      const downSvg = downContainer.querySelector('svg');
      const upSvg = upContainer.querySelector('svg');

      expect(downSvg?.getAttribute('width')).toBe(upSvg?.getAttribute('width'));
      expect(downSvg?.getAttribute('height')).toBe(upSvg?.getAttribute('height'));
      expect(downSvg?.getAttribute('viewBox')).toBe(upSvg?.getAttribute('viewBox'));
      expect(downSvg?.getAttribute('fill')).toBe(upSvg?.getAttribute('fill'));
    });

    it('have different path data for different directions', () => {
      const { container: downContainer } = render(<ArrowDown />);
      const { container: upContainer } = render(<ArrowUp />);

      const downPath = downContainer.querySelector('path')?.getAttribute('d');
      const upPath = upContainer.querySelector('path')?.getAttribute('d');

      expect(downPath).not.toBe(upPath);
      expect(downPath).toBeTruthy();
      expect(upPath).toBeTruthy();
    });

    it('both components use currentColor fill', () => {
      const { container: downContainer } = render(<ArrowDown />);
      const { container: upContainer } = render(<ArrowUp />);

      const downSvg = downContainer.querySelector('svg');
      const upSvg = upContainer.querySelector('svg');

      expect(downSvg).toHaveAttribute('fill', 'currentColor');
      expect(upSvg).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('Accessibility', () => {
    it('ArrowDown SVG is properly structured for accessibility', () => {
      const { container } = render(<ArrowDown />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // SVG should be focusable if needed
      expect(svg?.tagName).toBe('svg');
    });

    it('ArrowUp SVG is properly structured for accessibility', () => {
      const { container } = render(<ArrowUp />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // SVG should be focusable if needed
      expect(svg?.tagName).toBe('svg');
    });

    it('components can inherit color from parent', () => {
      const { container: downContainer } = render(
        <div style={{ color: 'red' }}>
          <ArrowDown />
        </div>
      );
      const { container: upContainer } = render(
        <div style={{ color: 'blue' }}>
          <ArrowUp />
        </div>
      );

      const downSvg = downContainer.querySelector('svg');
      const upSvg = upContainer.querySelector('svg');

      expect(downSvg).toHaveAttribute('fill', 'currentColor');
      expect(upSvg).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('SVG Path Validation', () => {
    it('ArrowDown path starts with M12 16 (pointing down)', () => {
      const { container } = render(<ArrowDown />);

      const path = container.querySelector('path');
      const pathData = path?.getAttribute('d');

      expect(pathData).toMatch(/^M12 16/);
    });

    it('ArrowUp path starts with M12 8 (pointing up)', () => {
      const { container } = render(<ArrowUp />);

      const path = container.querySelector('path');
      const pathData = path?.getAttribute('d');

      expect(pathData).toMatch(/^M12 8/);
    });

    it('paths contain proper curve commands', () => {
      const { container: downContainer } = render(<ArrowDown />);
      const { container: upContainer } = render(<ArrowUp />);

      const downPath = downContainer.querySelector('path')?.getAttribute('d');
      const upPath = upContainer.querySelector('path')?.getAttribute('d');

      // Both should contain line (L) and curve (C) commands
      expect(downPath).toMatch(/L/);
      expect(downPath).toMatch(/C/);
      expect(upPath).toMatch(/L/);
      expect(upPath).toMatch(/C/);
    });
  });

  describe('Component Exports', () => {
    it('exports ArrowDown as named export', () => {
      expect(ArrowDown).toBeDefined();
      expect(typeof ArrowDown).toBe('function');
    });

    it('exports ArrowUp as named export', () => {
      expect(ArrowUp).toBeDefined();
      expect(typeof ArrowUp).toBe('function');
    });

    it('components render without props', () => {
      expect(() => render(<ArrowDown />)).not.toThrow();
      expect(() => render(<ArrowUp />)).not.toThrow();
    });
  });
});

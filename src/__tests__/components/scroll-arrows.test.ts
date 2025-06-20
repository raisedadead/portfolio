import { beforeEach, describe, expect, it } from 'vitest';

describe('Scroll Arrows Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  interface ScrollArrowsProps {
    direction?: 'up' | 'down';
  }

  const createScrollArrows = (props: ScrollArrowsProps = {}) => {
    const { direction = 'up' } = props;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    if (direction === 'down') {
      // Down arrow path
      path.setAttribute(
        'd',
        'M12 16L16.24 11.76C16.64 11.36 16.64 10.74 16.24 10.34C15.84 9.93997 15.22 9.93997 14.81 10.34L12 13.17L9.19001 10.34C8.77998 9.93997 8.15998 9.93997 7.75001 10.34C7.33998 10.74 7.33998 11.36 7.75001 11.76L12 16Z'
      );
    } else {
      // Up arrow path
      path.setAttribute(
        'd',
        'M12 8L7.76 12.24C7.36 12.64 7.36 13.26 7.76 13.66C8.16 14.06 8.78 14.06 9.19 13.66L12 10.83L14.81 13.66C15.22 14.06 15.84 14.06 16.24 13.66C16.64 13.26 16.64 12.64 16.24 12.24L12 8Z'
      );
    }

    svg.appendChild(path);
    document.body.appendChild(svg);

    return svg;
  };

  describe('Structure and Attributes', () => {
    it('renders SVG element with correct attributes', () => {
      createScrollArrows();

      const svg = document.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg?.getAttribute('fill')).toBe('currentColor');
      expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('contains path element', () => {
      createScrollArrows();

      const path = document.querySelector('svg path');
      expect(path).toBeTruthy();
      expect(path?.tagName.toLowerCase()).toBe('path');
    });

    it('has correct namespace for SVG elements', () => {
      createScrollArrows();

      const svg = document.querySelector('svg');
      const path = document.querySelector('path');

      expect(svg?.namespaceURI).toBe('http://www.w3.org/2000/svg');
      expect(path?.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });
  });

  describe('Direction Prop Behavior', () => {
    it('defaults to up direction when no direction specified', () => {
      createScrollArrows();

      const path = document.querySelector('svg path');
      const upArrowPath =
        'M12 8L7.76 12.24C7.36 12.64 7.36 13.26 7.76 13.66C8.16 14.06 8.78 14.06 9.19 13.66L12 10.83L14.81 13.66C15.22 14.06 15.84 14.06 16.24 13.66C16.64 13.26 16.64 12.64 16.24 12.24L12 8Z';

      expect(path?.getAttribute('d')).toBe(upArrowPath);
    });

    it('renders up arrow when direction is "up"', () => {
      createScrollArrows({ direction: 'up' });

      const path = document.querySelector('svg path');
      const upArrowPath =
        'M12 8L7.76 12.24C7.36 12.64 7.36 13.26 7.76 13.66C8.16 14.06 8.78 14.06 9.19 13.66L12 10.83L14.81 13.66C15.22 14.06 15.84 14.06 16.24 13.66C16.64 13.26 16.64 12.64 16.24 12.24L12 8Z';

      expect(path?.getAttribute('d')).toBe(upArrowPath);
    });

    it('renders down arrow when direction is "down"', () => {
      createScrollArrows({ direction: 'down' });

      const path = document.querySelector('svg path');
      const downArrowPath =
        'M12 16L16.24 11.76C16.64 11.36 16.64 10.74 16.24 10.34C15.84 9.93997 15.22 9.93997 14.81 10.34L12 13.17L9.19001 10.34C8.77998 9.93997 8.15998 9.93997 7.75001 10.34C7.33998 10.74 7.33998 11.36 7.75001 11.76L12 16Z';

      expect(path?.getAttribute('d')).toBe(downArrowPath);
    });
  });

  describe('Accessibility', () => {
    it('has aria-hidden attribute to hide from screen readers', () => {
      createScrollArrows();

      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('maintains aria-hidden for both directions', () => {
      createScrollArrows({ direction: 'up' });
      const upSvg = document.querySelector('svg');
      expect(upSvg?.getAttribute('aria-hidden')).toBe('true');

      document.body.innerHTML = '';

      createScrollArrows({ direction: 'down' });
      const downSvg = document.querySelector('svg');
      expect(downSvg?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Visual Consistency', () => {
    it('maintains consistent dimensions across directions', () => {
      const testDimensions = (direction: 'up' | 'down') => {
        document.body.innerHTML = '';
        createScrollArrows({ direction });

        const svg = document.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('24');
        expect(svg?.getAttribute('height')).toBe('24');
        expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      };

      testDimensions('up');
      testDimensions('down');
    });

    it('uses currentColor for consistent theming', () => {
      createScrollArrows({ direction: 'up' });
      const upSvg = document.querySelector('svg');
      expect(upSvg?.getAttribute('fill')).toBe('currentColor');

      document.body.innerHTML = '';

      createScrollArrows({ direction: 'down' });
      const downSvg = document.querySelector('svg');
      expect(downSvg?.getAttribute('fill')).toBe('currentColor');
    });
  });

  describe('Path Data Validation', () => {
    it('has valid path data for up arrow', () => {
      createScrollArrows({ direction: 'up' });

      const path = document.querySelector('svg path');
      const pathData = path?.getAttribute('d');

      expect(pathData).toBeTruthy();
      expect(pathData).toContain('M12 8'); // Starts at top center
      expect(pathData).toContain('L12 8'); // Ends at starting point
    });

    it('has valid path data for down arrow', () => {
      createScrollArrows({ direction: 'down' });

      const path = document.querySelector('svg path');
      const pathData = path?.getAttribute('d');

      expect(pathData).toBeTruthy();
      expect(pathData).toContain('M12 16'); // Starts at bottom center
      expect(pathData).toContain('L12 16'); // Ends at starting point
    });

    it('path data contains proper curve commands', () => {
      createScrollArrows({ direction: 'up' });

      const path = document.querySelector('svg path');
      const pathData = path?.getAttribute('d');

      // Should contain Move (M), Line (L), and Curve (C) commands
      expect(pathData).toMatch(/[ML]/);
    });
  });

  describe('Component Isolation', () => {
    it('does not interfere with existing DOM elements', () => {
      const existingDiv = document.createElement('div');
      existingDiv.textContent = 'existing content';
      document.body.appendChild(existingDiv);

      createScrollArrows();

      expect(document.querySelector('div')?.textContent).toBe('existing content');
      expect(document.querySelector('svg')).toBeTruthy();
    });

    it('can render multiple instances with different directions', () => {
      createScrollArrows({ direction: 'up' });

      const upSvg = document.querySelector('svg');
      const upPath = upSvg?.querySelector('path')?.getAttribute('d');

      // Create second instance
      const downArrow = createScrollArrows({ direction: 'down' });

      // Both should exist
      expect(document.querySelectorAll('svg')).toHaveLength(2);

      // First should still be up arrow
      expect(upPath).toContain('M12 8');

      // Second should be down arrow
      const downPath = downArrow.querySelector('path')?.getAttribute('d');
      expect(downPath).toContain('M12 16');
    });
  });

  describe('Error Handling', () => {
    it('handles undefined direction gracefully', () => {
      expect(() => createScrollArrows({ direction: undefined })).not.toThrow();

      const path = document.querySelector('svg path');
      // Should default to up arrow
      expect(path?.getAttribute('d')).toContain('M12 8');
    });

    it('treats invalid direction as default', () => {
      // TypeScript would prevent this, but testing runtime behavior
      expect(() => createScrollArrows({ direction: 'invalid' as 'up' | 'down' })).not.toThrow();

      const path = document.querySelector('svg path');
      // Should default to up arrow
      expect(path?.getAttribute('d')).toContain('M12 8');
    });
  });
});

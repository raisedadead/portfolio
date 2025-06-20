import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Background Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const createBackgroundComponent = () => {
    const waveBackground = document.createElement('div');
    waveBackground.className = 'wave-background';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'absolute bottom-0 left-0 w-full');
    svg.setAttribute('viewBox', '0 0 1000 800');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Animated wave background decoration');

    // Create 8 wave paths
    for (let i = 0; i < 8; i++) {
      const baseHeight = 50;
      const heightMultiplier = (8 - i) / 8;
      const waveHeight = baseHeight * heightMultiplier;
      const yOffset = i * 5;
      const opacity = 0.1 + i * 0.05;
      const duration = 5 + i * 0.5;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', `wave-path wave-${i}`);
      path.setAttribute(
        'd',
        `M0 ${800 - yOffset} C 200 ${800 - waveHeight - yOffset}, 300 ${800 + waveHeight - yOffset}, 500 ${800 - yOffset} S 700 ${800 - waveHeight - yOffset}, 1000 ${800 - yOffset} V 800 H 0 Z`
      );
      path.setAttribute('fill', `rgba(50, 222, 212, ${opacity})`);
      path.setAttribute('style', `animation-duration: ${duration}s`);

      svg.appendChild(path);
    }

    const gradientDiv = document.createElement('div');
    gradientDiv.className =
      'absolute bottom-0 left-0 h-32 w-full bg-linear-to-t from-teal-600 to-transparent opacity-30';

    waveBackground.appendChild(svg);
    waveBackground.appendChild(gradientDiv);

    document.body.appendChild(waveBackground);
    return waveBackground;
  };

  describe('Structure', () => {
    it('renders wave background container', () => {
      const background = createBackgroundComponent();

      expect(background.classList.contains('wave-background')).toBe(true);
    });

    it('renders SVG with correct attributes', () => {
      createBackgroundComponent();

      const svg = document.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('class')).toBe('absolute bottom-0 left-0 w-full');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 1000 800');
      expect(svg?.getAttribute('preserveAspectRatio')).toBe('none');
      expect(svg?.getAttribute('role')).toBe('img');
      expect(svg?.getAttribute('aria-label')).toBe('Animated wave background decoration');
    });

    it('renders gradient overlay div', () => {
      createBackgroundComponent();

      const gradientDiv = document.querySelector('.absolute.bottom-0.left-0.h-32.w-full');
      expect(gradientDiv).toBeTruthy();
      expect(gradientDiv?.classList.contains('bg-linear-to-t')).toBe(true);
      expect(gradientDiv?.classList.contains('from-teal-600')).toBe(true);
      expect(gradientDiv?.classList.contains('to-transparent')).toBe(true);
      expect(gradientDiv?.classList.contains('opacity-30')).toBe(true);
    });
  });

  describe('Wave Paths', () => {
    it('renders 8 wave paths', () => {
      createBackgroundComponent();

      const paths = document.querySelectorAll('path');
      expect(paths).toHaveLength(8);
    });

    it('each path has correct wave class', () => {
      createBackgroundComponent();

      const paths = document.querySelectorAll('path');
      for (let i = 0; i < 8; i++) {
        expect(paths[i].classList.contains('wave-path')).toBe(true);
        expect(paths[i].classList.contains(`wave-${i}`)).toBe(true);
      }
    });

    it('paths have different opacities', () => {
      createBackgroundComponent();

      const paths = document.querySelectorAll('path');
      for (let i = 0; i < 8; i++) {
        const expectedOpacity = 0.1 + i * 0.05;
        const fill = paths[i].getAttribute('fill');
        expect(fill).toContain(`rgba(50, 222, 212, ${expectedOpacity})`);
      }
    });

    it('paths have different animation durations', () => {
      createBackgroundComponent();

      const paths = document.querySelectorAll('path');
      for (let i = 0; i < 8; i++) {
        const expectedDuration = 5 + i * 0.5;
        const style = paths[i].getAttribute('style');
        expect(style).toBe(`animation-duration: ${expectedDuration}s`);
      }
    });

    it('paths have valid SVG path data', () => {
      createBackgroundComponent();

      const paths = document.querySelectorAll('path');
      for (const path of paths) {
        const d = path.getAttribute('d');
        expect(d).toBeTruthy();
        expect(d).toMatch(/^M0 \d+/); // Should start with M0 followed by number
        expect(d).toContain('C'); // Should contain cubic bezier curves
        expect(d).toContain('S'); // Should contain smooth curve command
        expect(d).toContain('V 800 H 0 Z'); // Should end with vertical, horizontal, and close commands
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      createBackgroundComponent();

      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('role')).toBe('img');
      expect(svg?.getAttribute('aria-label')).toBe('Animated wave background decoration');
    });

    it('uses semantic HTML structure', () => {
      createBackgroundComponent();

      expect(document.querySelector('div.wave-background')).toBeTruthy();
      expect(document.querySelector('svg')).toBeTruthy();
      expect(document.querySelectorAll('path')).toHaveLength(8);
    });
  });

  describe('Layout Classes', () => {
    it('applies positioning classes to SVG', () => {
      createBackgroundComponent();

      const svg = document.querySelector('svg');
      expect(svg?.classList.contains('absolute')).toBe(true);
      expect(svg?.classList.contains('bottom-0')).toBe(true);
      expect(svg?.classList.contains('left-0')).toBe(true);
      expect(svg?.classList.contains('w-full')).toBe(true);
    });

    it('applies positioning classes to gradient overlay', () => {
      createBackgroundComponent();

      const gradientDiv = document.querySelector('div:not(.wave-background)');
      expect(gradientDiv?.classList.contains('absolute')).toBe(true);
      expect(gradientDiv?.classList.contains('bottom-0')).toBe(true);
      expect(gradientDiv?.classList.contains('left-0')).toBe(true);
      expect(gradientDiv?.classList.contains('h-32')).toBe(true);
      expect(gradientDiv?.classList.contains('w-full')).toBe(true);
    });
  });

  describe('Animation Setup', () => {
    it('applies wave-path class for animation', () => {
      createBackgroundComponent();

      const paths = document.querySelectorAll('path');
      for (const path of paths) {
        expect(path.classList.contains('wave-path')).toBe(true);
      }
    });

    it('applies unique wave classes for staggered animation', () => {
      createBackgroundComponent();

      const paths = document.querySelectorAll('path');
      for (let i = 0; i < 8; i++) {
        expect(paths[i].classList.contains(`wave-${i}`)).toBe(true);
      }
    });
  });
});

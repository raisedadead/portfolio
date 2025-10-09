import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens', () => {
  const globalCssPath = path.resolve(__dirname, '../../styles/global.css');
  const globalCssContent = fs.readFileSync(globalCssPath, 'utf-8');

  describe('Container Width Tokens', () => {
    it('defines --width-container-sm token with correct value', () => {
      expect(globalCssContent).toContain('--width-container-sm: 48rem');
    });

    it('defines --width-container-md token with correct value', () => {
      expect(globalCssContent).toContain('--width-container-md: 56rem');
    });

    it('defines --width-container-lg token with correct value', () => {
      expect(globalCssContent).toContain('--width-container-lg: 80rem');
    });

    it('includes documentation comments for container tokens', () => {
      expect(globalCssContent).toContain('Container width tokens');
    });
  });

  describe('Brutalist Shadow Tokens', () => {
    it('defines --shadow-brutal-sm token with correct pattern', () => {
      expect(globalCssContent).toContain('--shadow-brutal-sm: 2px 2px 0px rgba(0, 0, 0, 1)');
    });

    it('defines --shadow-brutal-md token with correct pattern', () => {
      expect(globalCssContent).toContain('--shadow-brutal-md: 4px 4px 0px rgba(0, 0, 0, 1)');
    });

    it('defines --shadow-brutal-lg token with correct pattern', () => {
      expect(globalCssContent).toContain('--shadow-brutal-lg: 6px 6px 0px rgba(0, 0, 0, 1)');
    });

    it('defines --shadow-brutal-xl token with correct pattern', () => {
      expect(globalCssContent).toContain('--shadow-brutal-xl: 8px 8px 0px rgba(0, 0, 0, 1)');
    });

    it('all shadow tokens use hard edges (0px blur)', () => {
      const shadowTokens = ['--shadow-brutal-sm', '--shadow-brutal-md', '--shadow-brutal-lg', '--shadow-brutal-xl'];

      shadowTokens.forEach((token) => {
        const tokenLine = globalCssContent.split('\n').find((line) => line.includes(token) && line.includes(':'));
        expect(tokenLine).toBeTruthy();
        expect(tokenLine).toContain('0px rgba(0, 0, 0, 1)');
      });
    });

    it('all shadow tokens use black color rgba(0, 0, 0, 1)', () => {
      const shadowTokens = ['--shadow-brutal-sm', '--shadow-brutal-md', '--shadow-brutal-lg', '--shadow-brutal-xl'];

      shadowTokens.forEach((token) => {
        const tokenLine = globalCssContent.split('\n').find((line) => line.includes(token) && line.includes(':'));
        expect(tokenLine).toContain('rgba(0, 0, 0, 1)');
      });
    });

    it('shadow offsets are symmetrical', () => {
      const shadowPatterns = [
        { token: '--shadow-brutal-sm', offset: '2px 2px' },
        { token: '--shadow-brutal-md', offset: '4px 4px' },
        { token: '--shadow-brutal-lg', offset: '6px 6px' },
        { token: '--shadow-brutal-xl', offset: '8px 8px' }
      ];

      shadowPatterns.forEach(({ token, offset }) => {
        const tokenLine = globalCssContent.split('\n').find((line) => line.includes(token) && line.includes(':'));
        expect(tokenLine).toContain(offset);
      });
    });

    it('includes documentation comments for shadow tokens', () => {
      expect(globalCssContent).toContain('Brutalist shadow tokens');
    });
  });

  describe('Color Tokens', () => {
    it('defines --color-brand-primary token referencing Tailwind colors', () => {
      expect(globalCssContent).toContain('--color-brand-primary');
      expect(globalCssContent).toContain('var(--color-orange-200)');
    });

    it('defines --color-brand-hover token referencing Tailwind colors', () => {
      expect(globalCssContent).toContain('--color-brand-hover');
      expect(globalCssContent).toContain('var(--color-orange-100)');
    });

    it('defines --color-brand-light token referencing Tailwind colors', () => {
      expect(globalCssContent).toContain('--color-brand-light');
      expect(globalCssContent).toContain('var(--color-orange-50)');
    });

    it('defines --color-brand-dark token referencing Tailwind colors', () => {
      expect(globalCssContent).toContain('--color-brand-dark');
      expect(globalCssContent).toContain('var(--color-orange-900)');
    });

    it('color tokens use var() references, not hardcoded values', () => {
      const colorTokens = ['--color-brand-primary', '--color-brand-hover', '--color-brand-light', '--color-brand-dark'];

      colorTokens.forEach((token) => {
        const tokenLine = globalCssContent.split('\n').find((line) => line.includes(token) && line.includes(':'));
        expect(tokenLine).toMatch(/var\(--color-/);
      });
    });

    it('includes documentation comments for color tokens', () => {
      expect(globalCssContent).toContain('Brand color semantic aliases');
    });
  });

  describe('Token Organization', () => {
    it('tokens are defined within @theme directive', () => {
      const themeBlockStart = globalCssContent.indexOf('@theme {');
      const containerTokenIndex = globalCssContent.indexOf('--width-container-sm');
      const shadowTokenIndex = globalCssContent.indexOf('--shadow-brutal-sm');
      const colorTokenIndex = globalCssContent.indexOf('--color-brand-primary');

      expect(themeBlockStart).toBeGreaterThan(-1);
      expect(containerTokenIndex).toBeGreaterThan(themeBlockStart);
      expect(shadowTokenIndex).toBeGreaterThan(themeBlockStart);
      expect(colorTokenIndex).toBeGreaterThan(themeBlockStart);
    });

    it('tokens are properly commented for maintainability', () => {
      const comments = ['/* Container width tokens', '/* Brutalist shadow tokens', '/* Brand color semantic aliases'];

      comments.forEach((comment) => {
        expect(globalCssContent).toContain(comment);
      });
    });
  });

  describe('Token Consistency', () => {
    it('container width tokens match Tailwind max-w utilities', () => {
      // max-w-3xl = 48rem (768px)
      expect(globalCssContent).toContain('--width-container-sm: 48rem; /* 768px');

      // max-w-4xl = 56rem (896px)
      expect(globalCssContent).toContain('--width-container-md: 56rem; /* 896px');

      // max-w-7xl = 80rem (1280px)
      expect(globalCssContent).toContain('--width-container-lg: 80rem; /* 1280px');
    });

    it('shadow token progression increases by 2px increments', () => {
      const offsets = [
        { token: '--shadow-brutal-sm', size: 2 },
        { token: '--shadow-brutal-md', size: 4 },
        { token: '--shadow-brutal-lg', size: 6 },
        { token: '--shadow-brutal-xl', size: 8 }
      ];

      offsets.forEach(({ token, size }) => {
        const tokenLine = globalCssContent.split('\n').find((line) => line.includes(token) && line.includes(':'));
        expect(tokenLine).toContain(`${size}px ${size}px`);
      });
    });
  });
});

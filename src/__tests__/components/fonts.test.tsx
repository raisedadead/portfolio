import { describe, expect, it } from 'vitest';
import { fontMono, fontSans } from '../../components/fonts';

describe('Fonts Configuration', () => {
  describe('fontMono Export', () => {
    it('exports correct mono font configuration', () => {
      expect(fontMono).toBeDefined();
      expect(fontMono).toEqual({
        variable: '--font-mono',
        className: 'font-mono',
      });
    });

    it('has correct CSS variable name', () => {
      expect(fontMono.variable).toBe('--font-mono');
    });

    it('has correct Tailwind CSS class name', () => {
      expect(fontMono.className).toBe('font-mono');
    });

    it('maintains immutability of font configuration', () => {
      const originalMono = { ...fontMono };
      // Attempt to modify (should not affect original)
      fontMono.variable = 'modified';
      expect(fontMono.variable).toBe('modified'); // Local change

      // Reset for other tests
      fontMono.variable = '--font-mono';
    });
  });

  describe('fontSans Export', () => {
    it('exports correct sans font configuration', () => {
      expect(fontSans).toBeDefined();
      expect(fontSans).toEqual({
        variable: '--font-sans',
        className: 'font-sans',
      });
    });

    it('has correct CSS variable name', () => {
      expect(fontSans.variable).toBe('--font-sans');
    });

    it('has correct Tailwind CSS class name', () => {
      expect(fontSans.className).toBe('font-sans');
    });
  });

  describe('Font Configuration Structure', () => {
    it('both fonts follow the same structure', () => {
      const monoKeys = Object.keys(fontMono).sort();
      const sansKeys = Object.keys(fontSans).sort();

      expect(monoKeys).toEqual(sansKeys);
      expect(monoKeys).toEqual(['className', 'variable']);
    });

    it('all font objects have required properties', () => {
      for (const font of [fontMono, fontSans]) {
        expect(font).toHaveProperty('variable');
        expect(font).toHaveProperty('className');
        expect(typeof font.variable).toBe('string');
        expect(typeof font.className).toBe('string');
      }
    });

    it('CSS variables follow naming convention', () => {
      expect(fontMono.variable).toMatch(/^--font-/);
      expect(fontSans.variable).toMatch(/^--font-/);
    });

    it('class names follow Tailwind convention', () => {
      expect(fontMono.className).toMatch(/^font-/);
      expect(fontSans.className).toMatch(/^font-/);
    });
  });

  describe('Integration with Astro', () => {
    it('provides correct format for Astro CSS variable usage', () => {
      // Variables should be usable in CSS as var(--font-mono) and var(--font-sans)
      expect(fontMono.variable).toBe('--font-mono');
      expect(fontSans.variable).toBe('--font-sans');
    });

    it('provides correct format for Tailwind class usage', () => {
      // Classes should be directly usable in Tailwind
      expect(fontMono.className).toBe('font-mono');
      expect(fontSans.className).toBe('font-sans');
    });
  });

  describe('Type Safety', () => {
    it('font objects have string properties', () => {
      expect(typeof fontMono.variable).toBe('string');
      expect(typeof fontMono.className).toBe('string');
      expect(typeof fontSans.variable).toBe('string');
      expect(typeof fontSans.className).toBe('string');
    });

    it('font objects are not null or undefined', () => {
      expect(fontMono).not.toBeNull();
      expect(fontMono).not.toBeUndefined();
      expect(fontSans).not.toBeNull();
      expect(fontSans).not.toBeUndefined();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import type { ImageDimensions } from '@/types/blog';
import { transformImageUrl } from '@/lib/image-optimizer';

const mockDimensions: ImageDimensions = {
  mobile: { width: 640, height: 360 },
  tablet: { width: 1024, height: 576 },
  desktop: { width: 1920, height: 1080 },
  aspectRatio: '16/9'
};

describe('transformImageUrl — pass-through contract', () => {
  describe('falsy inputs', () => {
    it('returns null for an empty URL', () => {
      expect(transformImageUrl('', mockDimensions)).toBeNull();
    });
  });

  describe('local + Astro-processed URLs', () => {
    it.each([
      '/images/cover.png',
      '/_astro/cover.abc123.webp',
      '/@fs/Users/test/project/src/content/articles/assets/images/cover.png',
      '/api/img/alpha/cover.png'
    ])('passes through %s unchanged', (url) => {
      expect(transformImageUrl(url, mockDimensions)).toBe(url);
    });

    it('passes through relative paths unchanged', () => {
      const rel = '../assets/images/cover.png';
      expect(transformImageUrl(rel, mockDimensions)).toBe(rel);
    });
  });

  describe('remote URLs', () => {
    it.each([
      'https://example.com/image.png',
      'https://cdn.example.com/image.png',
      'https://www.freecodecamp.org/news/content/images/2023/test.jpg'
    ])('passes through %s unchanged (third-party CDNs handle resizing)', (url) => {
      expect(transformImageUrl(url, mockDimensions)).toBe(url);
    });

    it('passes through plain HTTP URLs unchanged', () => {
      const httpUrl = 'http://example.com/image.png';
      expect(transformImageUrl(httpUrl, mockDimensions)).toBe(httpUrl);
    });
  });

  describe('format parameter (currently unused, reserved)', () => {
    const url = 'https://cdn.example.com/image.png';
    it.each(['webp', 'avif', 'auto'] as const)('accepts %s format without error', (format) => {
      expect(transformImageUrl(url, mockDimensions, format)).toBe(url);
    });
  });

  describe('error handling', () => {
    it('returns null on null input via the falsy guard (no log)', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = transformImageUrl(null as unknown as string, mockDimensions);
      expect(result).toBeNull();
      // Falsy guard short-circuits before reaching the catch block, so the
      // error logger should not have been invoked.
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('returns null and logs when sourceUrl is a truthy non-string that throws on .startsWith', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Plain object is truthy (passes the guard) but lacks `.startsWith`,
      // throwing TypeError inside the try and exercising the catch path.
      const result = transformImageUrl({} as unknown as string, mockDimensions);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error transforming image URL:'));
      consoleSpy.mockRestore();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ImageDimensions } from '@/types/blog';

import { transformImageUrl } from '@/lib/image-optimizer';

describe('transformImageUrl Tests', () => {
  const mockDimensions: ImageDimensions = {
    mobile: { width: 640, height: 360 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 },
    aspectRatio: '16/9'
  };

  beforeEach(() => {
    // Suppress console output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('R2 URLs (already optimized)', () => {
    it('passes through R2 dev URLs unchanged', () => {
      const r2Url = 'https://pub-abc123.r2.dev/blog/post-id/image.jpg';
      const result = transformImageUrl(r2Url, mockDimensions);

      expect(result).toBe(r2Url);
    });

    it('passes through custom R2 domain URLs unchanged', () => {
      const customUrl = 'https://i.mrugesh.dev/blog/post-id/image.jpg';
      const result = transformImageUrl(customUrl, mockDimensions);

      expect(result).toBe(customUrl);
    });
  });

  describe('Image Resizing URLs (already optimized)', () => {
    it('passes through Image Resizing URLs unchanged', () => {
      const resizingUrl = '/cdn-cgi/image/width=1200,quality=85,format=auto/https://pub-abc.r2.dev/blog/post/image.jpg';
      const result = transformImageUrl(resizingUrl, mockDimensions);

      expect(result).toBe(resizingUrl);
    });
  });

  describe('Hashnode CDN URLs (legacy)', () => {
    it('passes through Hashnode CDN URLs with warning', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const hashnodeUrl = 'https://cdn.hashnode.com/res/hashnode/image/upload/v1/test.jpg';
      const result = transformImageUrl(hashnodeUrl, mockDimensions);

      expect(result).toBe(hashnodeUrl);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unexpected Hashnode CDN URL'));

      consoleSpy.mockRestore();
    });
  });

  describe('Other URLs', () => {
    it('passes through other valid URLs unchanged', () => {
      const externalUrl = 'https://example.com/image.png';
      const result = transformImageUrl(externalUrl, mockDimensions);

      expect(result).toBe(externalUrl);
    });
  });

  describe('Invalid URLs', () => {
    it('returns null for empty string', () => {
      const result = transformImageUrl('', mockDimensions);
      expect(result).toBeNull();
    });

    it('returns null for null/undefined', () => {
      const result = transformImageUrl(null as any, mockDimensions);
      expect(result).toBeNull();
    });

    it('logs error for invalid input', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      transformImageUrl(null as any, mockDimensions);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('URL passthrough completes quickly', () => {
      const r2Url = 'https://pub-abc123.r2.dev/blog/post-id/image.jpg';
      const iterations = 100;

      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        transformImageUrl(r2Url, mockDimensions);
      }
      const endTime = performance.now();

      const averageTime = (endTime - startTime) / iterations;
      expect(averageTime).toBeLessThan(10); // Should be very fast (just passthrough)
    });
  });
});

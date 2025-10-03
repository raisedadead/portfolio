import { describe, it, expect, vi } from 'vitest';
import type { ImageDimensions } from '@/types/blog';

// Import will fail until implementation exists - this is expected for TDD
import { transformImageUrl } from '@/lib/image-optimizer';

describe('transformImageUrl Contract Tests', () => {
  const mockDimensions: ImageDimensions = {
    mobile: { width: 640, height: 360 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 },
    aspectRatio: '16/9'
  };

  describe('Valid Hashnode URLs', () => {
    it('returns Cloudflare Images URL for valid Hashnode CDN URL', () => {
      const sourceUrl = 'https://cdn.hashnode.com/res/hashnode/image/upload/v1234567890/abc123.png';
      const result = transformImageUrl(sourceUrl, mockDimensions);

      expect(result).not.toBeNull();
      expect(result).toMatch(/^https:\/\/mrugesh\.dev\/cdn-cgi\/image\//);
    });

    it('handles different Hashnode URL patterns', () => {
      const urls = [
        'https://cdn.hashnode.com/res/hashnode/image/upload/v1/test.jpg',
        'https://cdn.hashnode.com/res/hashnode/image/upload/test123.webp'
      ];

      urls.forEach((url) => {
        const result = transformImageUrl(url, mockDimensions);
        expect(result).not.toBeNull();
      });
    });
  });

  describe('Invalid URLs', () => {
    it('returns null for invalid URL format', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://cdn.hashnode.com/image.png',
        'http://cdn.hashnode.com/image.png', // HTTP not HTTPS
        ''
      ];

      invalidUrls.forEach((url) => {
        const result = transformImageUrl(url, mockDimensions);
        expect(result).toBeNull();
      });
    });

    it('returns null for non-Hashnode domain', () => {
      const nonHashnodeUrls = [
        'https://example.com/image.png',
        'https://cdn.example.com/image.png',
        'https://hashnode.com/image.png' // Missing cdn. subdomain
      ];

      nonHashnodeUrls.forEach((url) => {
        const result = transformImageUrl(url, mockDimensions);
        expect(result).toBeNull();
      });
    });
  });

  describe('Optional format parameter', () => {
    const validUrl = 'https://cdn.hashnode.com/res/hashnode/image/upload/v1/test.png';

    it('handles webp format', () => {
      const result = transformImageUrl(validUrl, mockDimensions, 'webp');
      expect(result).not.toBeNull();
    });

    it('handles avif format', () => {
      const result = transformImageUrl(validUrl, mockDimensions, 'avif');
      expect(result).not.toBeNull();
    });

    it('handles auto format (default)', () => {
      const result = transformImageUrl(validUrl, mockDimensions, 'auto');
      expect(result).not.toBeNull();
    });

    it('defaults to auto when format not specified', () => {
      const result = transformImageUrl(validUrl, mockDimensions);
      expect(result).not.toBeNull();
    });
  });

  describe('Performance requirements', () => {
    it('URL generation completes in under 50ms', () => {
      const sourceUrl = 'https://cdn.hashnode.com/res/hashnode/image/upload/v1/test.png';
      const iterations = 100;

      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        transformImageUrl(sourceUrl, mockDimensions);
      }
      const endTime = performance.now();

      const averageTime = (endTime - startTime) / iterations;
      expect(averageTime).toBeLessThan(50);
    });
  });

  describe('Error handling and observability', () => {
    it('logs error when transformation fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const invalidUrl = 'https://example.com/image.png';
      transformImageUrl(invalidUrl, mockDimensions);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

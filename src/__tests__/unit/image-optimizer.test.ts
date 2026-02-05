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
    it('returns null for empty URL', () => {
      const result = transformImageUrl('', mockDimensions);
      expect(result).toBeNull();
    });
  });

  describe('Non-Hashnode remote URLs', () => {
    it('returns non-Hashnode HTTPS URLs as-is (external CDNs handle optimization)', () => {
      const nonHashnodeUrls = [
        'https://example.com/image.png',
        'https://cdn.example.com/image.png',
        'https://hashnode.com/image.png', // Missing cdn. subdomain
        'https://www.freecodecamp.org/news/content/images/2023/test.jpg'
      ];

      nonHashnodeUrls.forEach((url) => {
        const result = transformImageUrl(url, mockDimensions);
        expect(result).toBe(url); // Returns as-is, not null
      });
    });

    it('returns HTTP URLs as-is', () => {
      const httpUrl = 'http://example.com/image.png';
      const result = transformImageUrl(httpUrl, mockDimensions);
      expect(result).toBe(httpUrl);
    });
  });

  describe('Local/Astro-processed URLs', () => {
    it('returns local URLs starting with / as-is', () => {
      const localUrls = [
        '/images/cover.png',
        '/_astro/cover.abc123.webp',
        '/@fs/Users/test/project/src/content/articles/assets/images/cover.png'
      ];

      localUrls.forEach((url) => {
        const result = transformImageUrl(url, mockDimensions);
        expect(result).toBe(url);
      });
    });

    it('returns relative paths as-is', () => {
      const relativePath = '../assets/images/cover.png';
      const result = transformImageUrl(relativePath, mockDimensions);
      expect(result).toBe(relativePath);
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
    it('handles exceptions gracefully and returns null', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Pass null as dimensions to trigger an exception during property access
      const validUrl = 'https://cdn.hashnode.com/res/hashnode/image/upload/v1/test.png';
      const result = transformImageUrl(validUrl, null as unknown as ImageDimensions);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error transforming image URL:'));
      consoleSpy.mockRestore();
    });

    it('does not log errors for valid non-Hashnode URLs', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const nonHashnodeUrl = 'https://example.com/image.png';
      transformImageUrl(nonHashnodeUrl, mockDimensions);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

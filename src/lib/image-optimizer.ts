import type { ImageDimensions } from '@/types/blog';

/**
 * Transforms an image URL for optimization
 *
 * - Hashnode CDN URLs: Uses Cloudflare Images transformation
 * - freeCodeCamp/other remote URLs: Returns as-is (external CDNs handle optimization)
 * - Local/Astro-processed URLs: Returns as-is (Astro optimizes at build time)
 *
 * @param sourceUrl - Original image URL or path
 * @param dimensions - Responsive image dimensions
 * @param format - Desired image format (webp, avif, or auto)
 * @returns Optimized URL or original URL, null only on error
 */
export function transformImageUrl(
  sourceUrl: string,
  dimensions: ImageDimensions,
  format: 'webp' | 'avif' | 'auto' = 'auto'
): string | null {
  try {
    if (!sourceUrl) {
      return null;
    }

    // Local/Astro-processed images (start with / or /_astro/ or /@fs/)
    // These are already optimized by Astro at build time
    if (sourceUrl.startsWith('/') || sourceUrl.startsWith('/_astro/') || sourceUrl.startsWith('/@fs/')) {
      return sourceUrl;
    }

    // Non-HTTPS URLs - return as-is
    if (!sourceUrl.startsWith('https://')) {
      return sourceUrl;
    }

    // Hashnode CDN - use Cloudflare Images transformation
    const hashnodePattern = /^https:\/\/cdn\.hashnode\.com\//;
    if (hashnodePattern.test(sourceUrl)) {
      const options = [
        `width=${dimensions.desktop.width}`,
        'quality=85',
        format !== 'auto' ? `format=${format}` : 'format=auto'
      ].join(',');

      return `https://mrugesh.dev/cdn-cgi/image/${options}/${sourceUrl}`;
    }

    // Other remote URLs (freeCodeCamp, etc.) - return as-is
    // These CDNs typically handle their own optimization
    return sourceUrl;
  } catch (error) {
    console.error(`Error transforming image URL: ${error}`);
    return null;
  }
}

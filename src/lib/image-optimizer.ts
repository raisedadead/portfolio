import type { ImageDimensions } from '@/types/blog';

/**
 * Transforms an image URL for optimization.
 *
 * The only first-party image source is the portfolio's own
 * `/api/img/...` route, which is already an absolute path. Astro
 * handles its own optimization at build time. Remote URLs (freeCodeCamp
 * RSS covers, etc.) pass through unchanged — those CDNs handle resizing
 * on their side.
 *
 * @param sourceUrl  Original image URL or path
 * @param dimensions Responsive image dimensions (currently unused; reserved
 *                   for a future Cloudflare Image Resizing integration)
 * @param format     Desired image format (currently unused; reserved)
 * @returns Optimized URL or original URL, null only on error
 */
export function transformImageUrl(
  sourceUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for future CF resize integration
  _dimensions: ImageDimensions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for future CF resize integration
  _format: 'webp' | 'avif' | 'auto' = 'auto'
): string | null {
  try {
    if (!sourceUrl) {
      return null;
    }

    // Local/Astro-processed images (start with / or /_astro/ or /@fs/)
    // These are already optimized by Astro at build time, or served by
    // the portfolio's own R2 image streamer at /api/img/...
    if (sourceUrl.startsWith('/') || sourceUrl.startsWith('/_astro/') || sourceUrl.startsWith('/@fs/')) {
      return sourceUrl;
    }

    // Non-HTTPS URLs - return as-is
    if (!sourceUrl.startsWith('https://')) {
      return sourceUrl;
    }

    // Remote URLs (freeCodeCamp news, etc.) — return as-is. The third-party
    // CDNs handle their own resizing.
    return sourceUrl;
  } catch (error) {
    console.error(`Error transforming image URL: ${error}`);
    return null;
  }
}

import type { ImageDimensions } from '@/types/blog';

/**
 * Transforms image URLs for optimization
 *
 * Note: Images are now transformed by astro-loader-hashnode during content loading.
 * This function primarily passes through already-optimized URLs (R2, Image Resizing).
 *
 * @param sourceUrl - Image URL (R2, Hashnode CDN, or other)
 * @param dimensions - Responsive image dimensions (unused, kept for compatibility)
 * @param format - Desired image format (unused, kept for compatibility)
 * @returns Image URL (passed through as-is)
 */
export function transformImageUrl(
  sourceUrl: string,
  _dimensions: ImageDimensions,
  _format: 'webp' | 'avif' | 'auto' = 'auto'
): string | null {
  try {
    // Validate sourceUrl exists and is a string
    if (!sourceUrl || typeof sourceUrl !== 'string') {
      console.error(`Invalid URL: ${sourceUrl}`);
      return null;
    }

    // R2 URLs (already optimized by loader): pass through
    if (sourceUrl.includes('.r2.dev') || sourceUrl.includes('i.mrugesh.dev')) {
      return sourceUrl;
    }

    // Image Resizing URLs (already optimized by loader): pass through
    if (sourceUrl.startsWith('/cdn-cgi/image/')) {
      return sourceUrl;
    }

    // Legacy Hashnode CDN URLs (shouldn't occur with loader, but handle gracefully)
    // Just return as-is since loader should have handled transformation
    if (sourceUrl.includes('cdn.hashnode.com')) {
      console.warn(`Unexpected Hashnode CDN URL (should be transformed by loader): ${sourceUrl}`);
      return sourceUrl;
    }

    // Other URLs: pass through as-is
    return sourceUrl;
  } catch (error) {
    console.error(`Error processing image URL: ${error}`);
    return null;
  }
}

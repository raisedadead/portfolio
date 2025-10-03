import type { ImageDimensions } from '@/types/blog';

/**
 * Transforms a Hashnode CDN URL to a Cloudflare Images URL for optimization
 *
 * @param sourceUrl - Original Hashnode CDN URL
 * @param dimensions - Responsive image dimensions
 * @param format - Desired image format (webp, avif, or auto)
 * @returns Cloudflare Images URL or null on error
 *
 * Contract: specs/001-current-state-blog/contracts/image-transformation.contract.md
 */
export function transformImageUrl(
  sourceUrl: string,
  dimensions: ImageDimensions,
  format: 'webp' | 'avif' | 'auto' = 'auto'
): string | null {
  try {
    // Validate sourceUrl is HTTPS
    if (!sourceUrl || !sourceUrl.startsWith('https://')) {
      console.error(`Invalid URL format: ${sourceUrl}`);
      return null;
    }

    // Validate sourceUrl is from Hashnode CDN
    const hashnodePattern = /^https:\/\/cdn\.hashnode\.com\//;
    if (!hashnodePattern.test(sourceUrl)) {
      console.error(`URL is not from Hashnode CDN: ${sourceUrl}`);
      return null;
    }

    // Use Cloudflare Images transformation via /cdn-cgi/image/
    // Format: https://mrugesh.dev/cdn-cgi/image/<OPTIONS>/<SOURCE-URL>
    const options = [
      `width=${dimensions.desktop.width}`,
      'quality=85',
      format !== 'auto' ? `format=${format}` : 'format=auto'
    ].join(',');

    const transformedUrl = `https://mrugesh.dev/cdn-cgi/image/${options}/${sourceUrl}`;
    return transformedUrl;
  } catch (error) {
    console.error(`Error transforming image URL: ${error}`);
    return null;
  }
}

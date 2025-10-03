import type { ImageDimensions } from '@/types/blog';

/**
 * Calculates responsive image dimensions based on aspect ratio
 *
 * @param aspectRatio - Numeric aspect ratio string (e.g., "16/9", "4/3")
 * @param gridPosition - Zero-indexed position in bento grid (unused, kept for API compatibility)
 * @returns ImageDimensions with mobile, tablet, desktop breakpoints
 *
 * Contract: specs/001-current-state-blog/contracts/dimension-calculation.contract.md
 */
export function calculateImageDimensions(aspectRatio: string, gridPosition: number): ImageDimensions {
  // Validate gridPosition
  if (gridPosition < 0) {
    throw new Error(`Grid position must be >= 0, got: ${gridPosition}`);
  }

  const normalizedRatio = aspectRatio;

  // Parse aspect ratio to numeric components
  const parts = normalizedRatio.split('/');
  if (parts.length !== 2) {
    throw new Error(`Invalid aspect ratio: ${aspectRatio}`);
  }

  const widthRatio = parseFloat(parts[0]);
  const heightRatio = parseFloat(parts[1]);

  // Validate parsed values
  if (isNaN(widthRatio) || isNaN(heightRatio) || widthRatio <= 0 || heightRatio <= 0) {
    throw new Error(`Invalid aspect ratio: ${aspectRatio}`);
  }

  // Calculate dimensions for each breakpoint
  const breakpoints = {
    mobile: 640,
    tablet: 1024,
    desktop: 1920
  };

  const calculateHeight = (width: number): number => {
    return Math.round(width / (widthRatio / heightRatio));
  };

  return {
    mobile: {
      width: breakpoints.mobile,
      height: calculateHeight(breakpoints.mobile)
    },
    tablet: {
      width: breakpoints.tablet,
      height: calculateHeight(breakpoints.tablet)
    },
    desktop: {
      width: breakpoints.desktop,
      height: calculateHeight(breakpoints.desktop)
    },
    aspectRatio: `${widthRatio}/${heightRatio}`
  };
}

/**
 * Calculates grid span properties for bento-grid blog layout
 * Pattern repeats every 6 cards with alternating large/small spans
 */

interface GridSpanResult {
  desktop: string;
  aspectClass: string; // CSS class for styling the container
  aspectRatio: string; // Numeric ratio for calculating image dimensions
  height: string;
}

/**
 * Get grid span configuration for a card at given index
 * @param index - Zero-based card position
 * @returns Grid span classes for desktop, aspect ratio (both CSS and numeric), and height
 */
export function getBentoGridSpan(index: number): GridSpanResult {
  const patterns: GridSpanResult[] = [
    { desktop: 'lg:col-span-3', aspectClass: 'aspect-16/9', aspectRatio: '16/9', height: 'h-64' },
    { desktop: 'lg:col-span-2', aspectClass: 'aspect-4/3', aspectRatio: '4/3', height: 'h-48' },
    { desktop: 'lg:col-span-5', aspectClass: 'aspect-21/9', aspectRatio: '21/9', height: 'h-56' },
    { desktop: 'lg:col-span-2', aspectClass: 'aspect-3/2', aspectRatio: '3/2', height: 'h-48' },
    { desktop: 'lg:col-span-3', aspectClass: 'aspect-3/4', aspectRatio: '3/4', height: 'h-64' },
    { desktop: 'lg:col-span-5', aspectClass: 'aspect-2/1', aspectRatio: '2/1', height: 'h-40' }
  ];

  return patterns[index % 6];
}

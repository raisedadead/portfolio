import type { ReactNode } from 'react';

/**
 * Semantic container component for consistent content width constraints.
 * Maps size props to Tailwind max-width utilities based on design tokens.
 * Centers content horizontally with mx-auto.
 *
 * @example
 * ```tsx
 * // Narrow content (blog posts, prose)
 * <Container size="sm">
 *   <article>Blog content...</article>
 * </Container>
 *
 * // Standard content (default, most pages)
 * <Container size="md">
 *   <div>Page content...</div>
 * </Container>
 *
 * // Wide layouts (blog index, grids)
 * <Container size="lg">
 *   <div className="grid grid-cols-3">Cards...</div>
 * </Container>
 *
 * // Responsive full-width
 * <Container size="full" className="py-8">
 *   <nav>Navigation...</nav>
 * </Container>
 * ```
 */

export type ContainerSize = 'sm' | 'md' | 'lg' | 'full';

export interface ContainerProps {
  /**
   * Semantic size determining max-width
   * @default 'md'
   */
  size?: ContainerSize;

  /**
   * Content to wrap
   */
  children: ReactNode;

  /**
   * Additional Tailwind classes to merge with base styles
   * @optional
   */
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-3xl', // 768px - narrow content (uses page)
  md: 'max-w-4xl', // 896px - standard content (index, about, blog posts)
  lg: 'max-w-7xl', // 1280px - wide layouts (blog index)
  full: 'w-[90%] lg:w-[75%] xl:w-[80%]' // Responsive percentage-based
};

export default function Container({ size = 'md', children, className = '' }: ContainerProps) {
  const sizeClass = sizeClasses[size];
  const classes = `${sizeClass} mx-auto ${className}`.trim();

  return <div className={classes}>{children}</div>;
}

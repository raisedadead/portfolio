import type { ReactNode } from 'react';

/**
 * Content container with brutalist styling and variant-based shadow/border sizes.
 * Use for grouping related content with consistent visual hierarchy.
 *
 * @example
 * ```tsx
 * // Default card
 * <Card>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * // Featured card with larger border and shadow
 * <Card variant="featured">
 *   <h2>Important Content</h2>
 * </Card>
 *
 * // Minimal card with reduced padding
 * <Card variant="minimal" className="hover:scale-105">
 *   <p>Compact content</p>
 * </Card>
 * ```
 */

export type CardVariant = 'default' | 'featured' | 'minimal';

export interface CardProps {
  /**
   * Visual variant of the card
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Card content (any React elements)
   */
  children: ReactNode;

  /**
   * Additional Tailwind classes to merge with base styles
   * @optional
   */
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6',
  featured: 'border-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] p-8',
  minimal: 'border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] p-4'
};

export function Card({ variant = 'default', children, className = '' }: CardProps) {
  const variantClass = variantClasses[variant];
  const baseClasses = 'border-black bg-white';
  const classes = `${baseClasses} ${variantClass} ${className}`.trim();

  return <div className={classes}>{children}</div>;
}

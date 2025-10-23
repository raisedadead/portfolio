import type { ReactNode } from 'react';

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
  default: 'brutalist-card p-6',
  featured: 'brutalist-card shadow-brutal-lg p-8',
  minimal: 'brutalist-card p-4'
};

export function Card({ variant = 'default', children, className = '' }: CardProps) {
  const variantClass = variantClasses[variant];
  const classes = `${variantClass} ${className}`.trim();

  return (
    <div className={classes} data-variant={variant}>
      {children}
    </div>
  );
}

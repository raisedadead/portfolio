import type { ReactNode } from 'react';

export type CardLinkVariant = 'default' | 'featured' | 'minimal';

export interface CardLinkProps {
  /**
   * Link destination
   */
  href: string;

  /**
   * Visual variant of the card link
   * @default 'default'
   */
  variant?: CardLinkVariant;

  /**
   * Link content (any React elements)
   */
  children: ReactNode;

  /**
   * Additional Tailwind classes to merge with base styles
   * @optional
   */
  className?: string;

  /**
   * ARIA label for accessibility
   * @optional
   */
  ariaLabel?: string;
}

const variantClasses: Record<CardLinkVariant, string> = {
  default: 'brutalist-card-hover p-6',
  featured: 'brutalist-card shadow-brutal-lg p-8 hover:shadow-brutal-xl',
  minimal: 'brutalist-card-hover p-4'
};

export function CardLink({ href, variant = 'default', children, className = '', ariaLabel }: CardLinkProps) {
  const variantClass = variantClasses[variant];
  const classes = `${variantClass} ${className}`.trim();

  return (
    <a href={href} className={`block no-underline ${classes}`} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

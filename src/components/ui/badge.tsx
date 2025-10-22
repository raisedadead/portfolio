import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brutalist';

export interface BadgeProps {
  /**
   * Visual variant of the badge
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Badge content (text, icons, or other elements)
   */
  children: ReactNode;

  /**
   * Additional Tailwind classes to merge with base styles
   */
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  brutalist: 'brutalist-card-hover text-slate-700'
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantClass = variantClasses[variant];

  let baseClasses: string;

  if (variant === 'brutalist') {
    baseClasses = `${variantClass} inline-flex items-center px-2 py-1 text-xs font-medium`;
  } else {
    baseClasses = `inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full transition-colors duration-100 ${variantClass}`;
  }

  const classes = `${baseClasses} ${className}`.trim();

  return <span className={classes}>{children}</span>;
}

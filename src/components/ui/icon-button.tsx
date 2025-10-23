import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'default' | 'brutalist';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size variant affecting padding and visual weight
   * @default 'md'
   */
  size?: IconButtonSize;

  /**
   * Visual variant of the icon button
   * @default 'default'
   */
  variant?: IconButtonVariant;

  /**
   * Icon content (typically an SVG icon component)
   */
  children: ReactNode;

  /**
   * Additional Tailwind classes to merge with base styles
   */
  className?: string;
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3'
};

export function IconButton({ size = 'md', variant = 'default', children, className = '', ...props }: IconButtonProps) {
  const sizeClass = sizeClasses[size];

  let baseClasses: string;

  if (variant === 'brutalist') {
    baseClasses = `brutalist-button inline-flex items-center justify-center ${sizeClass}`;
  } else {
    baseClasses = `inline-flex items-center justify-center ${sizeClass} text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600 disabled:hover:bg-transparent rounded`;
  }

  const classes = `${baseClasses} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

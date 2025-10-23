import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type LinkButtonAs = 'button' | 'a';

export interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The element to render as (button or anchor)
   * @default 'button'
   */
  as?: LinkButtonAs;

  /**
   * Link destination (only used when as="a")
   */
  href?: string;

  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Additional Tailwind classes to merge with base styles
   */
  className?: string;
}

export function LinkButton({ as = 'button', href, children, className = '', ...props }: LinkButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center text-orange-600 hover:text-orange-800 hover:underline focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-orange-600 disabled:hover:no-underline';

  const classes = `${baseClasses} ${className}`.trim();

  if (as === 'a' && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

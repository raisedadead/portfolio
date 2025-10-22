import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonAs = 'button' | 'a';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * The element to render as (button or anchor)
   * @default 'button'
   */
  as?: ButtonAs;

  /**
   * Link destination (only used when as="a")
   */
  href?: string;

  /**
   * Button content (text, icons, or other elements)
   */
  children: ReactNode;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'brutalist-button-primary',
  secondary: 'brutalist-button-secondary',
  ghost: 'brutalist-button-ghost'
};

export function Button({
  variant = 'primary',
  as = 'button',
  href,
  children,
  className = '',
  'data-testid': testId,
  ...props
}: ButtonProps) {
  const variantClass = variantClasses[variant];
  const baseClasses = 'inline-flex items-center justify-center';
  const classes = `${baseClasses} ${variantClass} ${className}`.trim();

  if (as === 'a' && href) {
    return (
      <a href={href} className={classes} data-variant={variant} data-testid={testId}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} data-variant={variant} data-testid={testId} {...props}>
      {children}
    </button>
  );
}

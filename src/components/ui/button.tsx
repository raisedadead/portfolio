import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Reusable button component with brutalist design aesthetic.
 * Supports three variants: primary (orange background), secondary (light orange),
 * and ghost (transparent background).
 *
 * @example
 * ```tsx
 * // Primary button (default)
 * <Button onClick={handleClick}>Submit</Button>
 *
 * // Secondary variant
 * <Button variant="secondary">Cancel</Button>
 *
 * // Ghost variant with custom styling
 * <Button variant="ghost" className="w-full">
 *   Expand
 * </Button>
 *
 * // Disabled state
 * <Button disabled>Loading...</Button>
 * ```
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button content (text, icons, or other elements)
   */
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-orange-200',
  secondary: 'bg-orange-50',
  ghost: 'bg-transparent'
};

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const variantClass = variantClasses[variant];
  const baseClasses =
    'rounded-lg border-2 border-black text-black shadow-[4px_4px_0px_var(--color-black)] hover:bg-orange-100 hover:shadow-[6px_6px_0px_var(--color-black)] active:bg-black active:text-white active:shadow-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${baseClasses} ${variantClass} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

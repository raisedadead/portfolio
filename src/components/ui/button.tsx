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
  primary: 'bg-orange-200 hover:bg-gray-700 hover:text-white hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:bg-black',
  secondary: 'bg-orange-50 hover:bg-gray-700 hover:text-white hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:bg-black',
  ghost: 'bg-transparent hover:bg-orange-100 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-black active:text-white'
};

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const variantClass = variantClasses[variant];
  const baseClasses =
    'border-2 border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${baseClasses} ${variantClass} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

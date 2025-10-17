import { forwardRef, type InputHTMLAttributes } from 'react';

/**
 * Form input component with brutalist styling and consistent focus states.
 * Extends native HTML input element with all standard attributes supported.
 * Supports ref forwarding for focus management and form control.
 *
 * @example
 * ```tsx
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 *
 * // Email input with value binding
 * <Input
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   required
 * />
 *
 * // Search input with custom styling and ref
 * const inputRef = useRef<HTMLInputElement>(null);
 * <Input
 *   ref={inputRef}
 *   type="search"
 *   placeholder="Search..."
 *   className="w-full"
 * />
 *
 * // Disabled input
 * <Input type="text" disabled value="Read only" />
 * ```
 */

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  const baseClasses =
    'border-2 border-black bg-white shadow-[4px_4px_0px_var(--color-black)] hover:bg-orange-100 focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${baseClasses} ${className}`.trim();

  return <input ref={ref} className={classes} {...props} />;
});

Input.displayName = 'Input';

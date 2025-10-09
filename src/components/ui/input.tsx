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
    'border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${baseClasses} ${className}`.trim();

  return <input ref={ref} className={classes} {...props} />;
});

Input.displayName = 'Input';

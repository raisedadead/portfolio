import { forwardRef, type InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  const baseClasses = 'brutalist-input';
  const classes = `${baseClasses} ${className}`.trim();

  return <input ref={ref} className={classes} {...props} />;
});

Input.displayName = 'Input';

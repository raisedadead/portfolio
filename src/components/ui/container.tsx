import type { ReactNode } from 'react';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'full';

export interface ContainerProps {
  /**
   * Semantic size determining max-width
   * @default 'md'
   */
  size?: ContainerSize;

  /**
   * Content to wrap
   */
  children: ReactNode;

  /**
   * Additional Tailwind classes to merge with base styles
   * @optional
   */
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-3xl', // 768px - narrow content (uses page)
  md: 'max-w-4xl', // 896px - standard content (index, about, blog posts)
  lg: 'max-w-7xl', // 1280px - wide layouts (blog index)
  full: 'w-full lg:w-[75%] xl:w-[80%]' // Responsive percentage-based
};

export default function Container({ size = 'md', children, className = '' }: ContainerProps) {
  const sizeClass = sizeClasses[size];
  const classes = `${sizeClass} mx-auto ${className}`.trim();

  return <div className={classes}>{children}</div>;
}

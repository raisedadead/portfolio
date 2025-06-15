import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { expect } from 'vitest';

// Common mock component prop types
export interface MockLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  ariaLabel?: string;
}

export interface MockCustomLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  ariaLabel?: string;
  rel?: string;
  type?: string;
  target?: string;
}

export interface MockIconProps {
  className?: string;
}

export interface MockMenuProps {
  children: (props: { open: boolean }) => ReactNode;
}

export interface MockMenuButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface MockMenuItemsProps {
  children: ReactNode;
  className?: string;
}

export interface MockConsentBannerProps {
  setHasConsent: (value: boolean) => void;
}

export interface MockFramerMotionProps {
  children?: ReactNode;
  [key: string]: unknown;
}

export interface MockMotionButtonProps {
  children?: ReactNode;
  onMouseDown?: () => void;
  className?: string;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MockAnimatePresenceProps {
  children: ReactNode;
}

export interface MockExpandableSectionLabel {
  name: string;
  color: string;
}

export interface MockExpandableSectionProps {
  title: string;
  labels?: MockExpandableSectionLabel[];
  defaultOpen?: boolean;
  children: ReactNode;
  [key: string]: unknown;
}

export interface MockMainLayoutProps {
  children: ReactNode;
  variant?: string;
  showHomeButton?: boolean;
}

export interface MockImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  format?: string;
  [key: string]: unknown;
}

// Custom render function with providers if needed
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };

// Helper to test external links
export const testExternalLink = (link: HTMLAnchorElement) => {
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
};

// Helper to test internal links
export const testInternalLink = (link: HTMLAnchorElement) => {
  expect(link).not.toHaveAttribute('target', '_blank');
  expect(link).not.toHaveAttribute('rel', expect.stringContaining('noopener'));
};

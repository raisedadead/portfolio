import type React from 'react';
import { forwardRef } from 'react';

interface CustomLinkProps {
  children: React.ReactNode;
  href: string;
  ariaLabel?: string;
  className?: string;
  rel?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  type?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    {
      children,
      href,
      ariaLabel,
      className = 'text-blue-500 hover:text-blue-700 inline-flex items-center',
      rel,
      target,
      type,
      onClick
    },
    ref
  ) => {
    const isExternal = (!href.startsWith('/') && !href.startsWith('#')) || href.startsWith('//');

    const linkProps = {
      ref,
      href,
      className,
      'aria-label': ariaLabel,
      onClick,
      ...(type && { type }),
      ...(target && { target }),
      ...(isExternal &&
        target === '_blank' && {
          rel: `${rel ? `${rel} ` : ''}noopener noreferrer`
        })
    };

    return <a {...linkProps}>{children}</a>;
  }
);

CustomLink.displayName = 'CustomLink';

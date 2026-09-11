import { forwardRef, type ComponentPropsWithoutRef } from 'react';

type CustomLinkProps = ComponentPropsWithoutRef<'a'> & { href: string };

export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    { children, href, target, rel, className = 'text-blue-500 hover:text-blue-700 inline-flex items-center', ...props },
    ref
  ) => {
    const isExternal = (!href.startsWith('/') && !href.startsWith('#')) || href.startsWith('//');
    return (
      <a
        {...props}
        ref={ref}
        href={href}
        target={target}
        className={className}
        rel={isExternal && target === '_blank' ? `${rel ? `${rel} ` : ''}noopener noreferrer` : rel}
      >
        {children}
      </a>
    );
  }
);

CustomLink.displayName = 'CustomLink';

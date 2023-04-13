import React from 'react';
import Link from 'next/link';

interface CustomLinkProps {
  children: React.ReactNode | string;
  href: string;
  type?: string;
  className?: string;
  target?: string;
  ariaLabel?: string;
}

export const CustomLink: React.FC<CustomLinkProps> = ({
  children,
  href,
  type = '',
  className = 'text-blue-500 hover:text-blue-700 inline-flex items-center',
  target = '_blank',
  ariaLabel = ''
}) => {
  const isInternal = href.startsWith('/');

  return isInternal ? (
    <Link href={href} className={className} aria-label={ariaLabel} role='link'>
      {children}
    </Link>
  ) : (
    <a
      href={href}
      type={type}
      className={className}
      aria-label={ariaLabel}
      target={target}
      role='link'
    >
      {children}
    </a>
  );
};

export default CustomLink;

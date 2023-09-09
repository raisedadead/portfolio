import React from 'react';
import Link from 'next/link';

interface CustomLinkProps {
  children: React.ReactNode | string;
  href: string;
  ariaLabel?: string;
  className?: string;
  rel?: string;
  target?: string;
  type?: string;
}

export const CustomLink: React.FC<CustomLinkProps> = ({
  children,
  href,
  ariaLabel = '',
  className = 'text-blue-500 hover:text-blue-700 inline-flex items-center',
  rel = '',
  target = '_blank',
  type = ''
}) => {
  const isInternal = href.startsWith('/');

  return isInternal ? (
    <Link href={href} className={className} aria-label={ariaLabel} role='link'>
      {children}
    </Link>
  ) : (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
      role='link'
      rel={target == '_blank' ? `${rel} noopener noreferrer` : `${rel}`}
      target={target}
      type={type}
    >
      {children}
    </a>
  );
};

export default CustomLink;

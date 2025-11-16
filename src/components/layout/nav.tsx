import { BookOpenIcon, CpuChipIcon, HomeIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { CustomLink as Link } from '@/components/custom-link';

const links = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/blog', label: 'Blog', icon: BookOpenIcon },
  { href: '/uses', label: 'Uses', icon: CpuChipIcon }
];

type NavProps = {
  className?: string;
};

export const Nav: React.FC<NavProps> = ({ className }) => {
  return (
    <nav className={`absolute top-4 right-0 left-0 flex justify-center ${className}`}>
      <div className='flex gap-2'>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='brutalist-button-primary brutalist-transition brutalist-focus inline-flex h-10 items-center gap-2 px-4 hover:bg-orange-50 active:bg-black active:text-white'
            ariaLabel={link.label}
          >
            <link.icon className='h-5 w-5' aria-hidden='true' />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Bars4Icon, BookOpenIcon, CpuChipIcon, HomeIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { CustomLink as Link } from '@/components/custom-link';

const links = [
  { href: '/blog', label: 'Blog', icon: BookOpenIcon },
  { href: '/uses', label: 'Uses', icon: CpuChipIcon }
];

const currentState = (href: string, path?: string): 'page' | 'true' | undefined => {
  if (!path) return undefined;
  if (path === href || path === `${href}/`) return 'page';
  return path.startsWith(`${href}/`) ? 'true' : undefined;
};

type NavProps = {
  className?: string;
  showHomeButton?: boolean;
  currentPath?: string;
};

export const Nav: React.FC<NavProps> = ({ className, showHomeButton = true, currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.paddingRight = '0';
    }
  }, [isMenuOpen]);

  return (
    <nav aria-label='Site' className={`relative ${className}`}>
      <ul
        aria-label='Sections'
        className='absolute top-4 right-4 m-0 hidden list-none border-2 border-black bg-orange-200 p-0 shadow-brutal-md md:flex'
      >
        {links.map((link) => (
          <li key={link.href} className='border-l-2 border-black first:border-l-0'>
            <Link
              href={link.href}
              aria-current={currentState(link.href, currentPath)}
              className='brutalist-focus flex h-10 items-center px-4 font-bold text-slate-800 no-underline transition-colors duration-100 hover:bg-orange-100 [&[aria-current]]:bg-black [&[aria-current]]:text-white'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Menu as='div' className='absolute top-4 right-4 text-left md:hidden'>
        {({ open }) => (
          <>
            <div>
              <MenuButton
                className='brutalist-button-primary flex h-10 items-center p-1.5'
                onClick={() => setIsMenuOpen(open)}
              >
                <span className='sr-only'>Open navigation menu</span>
                <Bars4Icon className='h-6 w-6' aria-hidden='true' />
              </MenuButton>
            </div>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <MenuItems className='shadow-brutal-md absolute right-0 z-10 mt-2 w-48 border-2 border-black bg-orange-200 focus-visible:outline-none'>
                {links.map((link) => (
                  <MenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className='brutalist-transition brutalist-focus inline-flex h-full w-full justify-start border-b-2 border-black py-2 pl-4 text-black last:border-b-0 hover:bg-orange-50 active:bg-black active:text-white active:shadow-none'
                      aria-label={link.label}
                    >
                      <link.icon className='mr-2 flex h-6 w-6' aria-hidden='true' />
                      {link.label}
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>
      {showHomeButton && (
        <div className='absolute top-4 left-4 text-left'>
          <Link href='/' className='brutalist-button-primary flex h-10 items-center p-1.5' aria-label='Go Home'>
            <span className='sr-only'>Go Home</span>
            <HomeIcon className='h-6 w-6' aria-hidden='true' />
          </Link>
        </div>
      )}
    </nav>
  );
};

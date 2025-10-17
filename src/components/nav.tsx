import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Bars4Icon, BookOpenIcon, CpuChipIcon, HomeIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { CustomLink as Link } from './custom-link';

const links = [
  { href: '/blog', label: 'Recent Posts', icon: BookOpenIcon },
  { href: '/uses', label: 'Uses', icon: CpuChipIcon }
];

type NavProps = {
  className?: string;
  showHomeButton?: boolean;
};

export const Nav: React.FC<NavProps> = ({ className, showHomeButton = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.paddingRight = '0';
    }
  }, [isMenuOpen]);

  return (
    <nav className={`relative ${className}`}>
      <Menu as='div' className='absolute top-4 right-4 text-left'>
        {({ open }) => (
          <>
            <div>
              <MenuButton
                className='flex h-10 items-center border-2 border-black bg-orange-200 p-1.5 text-black shadow-[4px_4px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-50 hover:shadow-[6px_6px_0px_var(--color-black)] focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none active:bg-black active:text-white active:shadow-none'
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
              <MenuItems className='absolute right-0 z-10 mt-2 w-48 border-2 border-black bg-orange-200 shadow-[4px_4px_0px_var(--color-black)] focus-visible:outline-none'>
                {links.map((link) => (
                  <MenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className='inline-flex h-full w-full justify-start border-b-2 border-black py-2 pl-4 text-black transition-all duration-100 last:border-b-0 hover:bg-orange-50 focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none active:bg-black active:text-white active:shadow-none'
                      ariaLabel={link.label}
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
          <Link
            href='/'
            className='flex h-10 items-center border-2 border-black bg-orange-200 p-1.5 text-black shadow-[4px_4px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-50 hover:shadow-[6px_6px_0px_var(--color-black)] focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none active:bg-black active:text-white active:shadow-none'
            ariaLabel='Go Home'
          >
            <span className='sr-only'>Go Home</span>
            <HomeIcon className='h-6 w-6' aria-hidden='true' />
          </Link>
        </div>
      )}
    </nav>
  );
};

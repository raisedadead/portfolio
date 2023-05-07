import React, { Fragment } from 'react';
import { CustomLink as Link } from './custom-link';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars4Icon,
  HomeIcon,
  BookOpenIcon,
  CpuChipIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const links = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/blog', label: 'Posts', icon: BookOpenIcon },
  { href: '/uses', label: 'Uses', icon: CpuChipIcon },
  { href: '/contact', label: 'Hire Me!', icon: BriefcaseIcon }
];

type NavProps = {
  className?: string;
};
export const Nav: React.FC<NavProps> = ({ className }) => {
  return (
    <nav className={`${className}`}>
      <Menu
        as='div'
        className='absolute right-8 top-5 text-left md:right-20 lg:right-48'
      >
        <div>
          <Menu.Button className='flex items-center rounded border border-white bg-orange-200 text-black shadow-[4px_4px_0_0_rgba(60,64,43,.2)] focus:outline-none'>
            <span className='sr-only'>Open navigation menu</span>
            <Bars4Icon className='h-6 w-6' aria-hidden='true' />
          </Menu.Button>
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
          <Menu.Items className='absolute right-0 z-10 mt-2 w-48 rounded bg-white/60 shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-lg focus:outline-none'>
            <div className='py-1'>
              {links.map((link) => (
                <Menu.Item key={link.href}>
                  <Link
                    href={link.href}
                    className='background-blur-sm inline-flex h-full w-full justify-start py-1 pl-4 text-slate-600 no-underline hover:bg-orange-200 hover:text-slate-800'
                    ariaLabel={link.label}
                  >
                    <link.icon
                      className='mr-2 flex h-6 w-6'
                      aria-hidden='true'
                    />
                    {link.label}
                  </Link>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </nav>
  );
};

export default Nav;

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
  { href: '/blog', label: 'Recent Posts', icon: BookOpenIcon },
  { href: '/uses', label: 'Uses', icon: CpuChipIcon },
  { href: '/hire-me', label: 'Hire Me!', icon: BriefcaseIcon }
];

type NavProps = {
  className?: string;
};
export const Nav: React.FC<NavProps> = ({ className }) => {
  return (
    <nav className={`${className}`}>
      <Menu as='div' className='absolute right-4 top-4 text-left'>
        <div>
          <Menu.Button className='flex h-10 items-center border-2 border-black bg-orange-200 p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none focus:outline-none active:bg-black active:shadow-none'>
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
          <Menu.Items className='absolute right-0 z-10 mt-2 w-48 border-2 border-black bg-orange-200 shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:outline-none'>
            <div className='py-1'>
              {links.map((link) => (
                <Menu.Item key={link.href}>
                  <Link
                    href={link.href}
                    className='inline-flex h-full w-full justify-start border-b-2 border-black py-2 pl-4 text-black first:-mt-1 last:-mb-1 last:border-b-0 hover:bg-gray-700 hover:text-white hover:shadow-none focus:outline-none active:bg-black active:shadow-none'
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

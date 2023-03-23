import React, { useState, useEffect } from 'react';
import { CustomLink as Link } from './custom-link';

const anchorClass =
  'hover:text-gray-800 rounded-sm hover:bg-orange-300 py-2 px-20 no-underline';

type NavProps = {
  className?: string;
};
export const Nav: React.FC<NavProps> = ({ className }) => {
  const [showNavShadow, setShowNavShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrollable =
        document.documentElement.scrollHeight > window.innerHeight;

      const isAtTop = window.pageYOffset <= 10;

      setShowNavShadow(isScrollable && !isAtTop);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${className} border-b-white-50 border-b ${
        showNavShadow ? ' backdrop-blur-lg' : ''
      }`}
    >
      <ul className='min-h-10 mx-auto flex max-w-[75%] justify-around p-4'>
        <li>
          <Link
            href='/'
            aria-label='Home'
            className='inline-flex items-center text-sm'
          >
            {/* Home Emoji */}
            <span className='sr-only'>Home</span>
            <svg
              className='h-6 w-6'
              fill='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z'
                clipRule='evenodd'
              ></path>
            </svg>
          </Link>
        </li>
        <li>
          <Link href='/contact' aria-label='Contact' className={anchorClass}>
            Let&apos;s Work Together!
          </Link>
        </li>
        <li>
          <Link
            href='/blog'
            aria-label='Recent Articles'
            className={anchorClass}
          >
            Recent Articles
          </Link>
        </li>
        {/* <li>
          <Link href='/uses' aria-label='Uses' className={anchorClass}>
            Uses
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Nav;

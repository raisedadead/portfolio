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
          <Link href='/' aria-label='Home' className={anchorClass}>
            Home
          </Link>
        </li>
        <li>
          <Link href='/contact' aria-label='Test Page' className={anchorClass}>
            Contact
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

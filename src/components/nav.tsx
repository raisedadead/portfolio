import React, { useState, useEffect } from 'react';
import { CustomLink as Link } from './custom-link';

const anchorClass =
  'inline-flex py-1 px-1 justify-center h-full w-full hover:bg-black/80 hover:text-slate-200 background-blur-sm items-center no-underline rounded-sm font-mono text-sm font-bold text-slate-600';

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
        showNavShadow ? ' bg-white/30 backdrop-blur-lg' : ' bg-white/30'
      }`}
    >
      <ul className='min-h-10 mx-auto flex'>
        <li className='h-full w-full'>
          <Link href='/' aria-label='Home' className={anchorClass}>
            Home
          </Link>
        </li>
        <li className='h-full w-full'>
          <Link
            href='/blog'
            aria-label='Recent Articles'
            className={anchorClass}
          >
            Posts
          </Link>
        </li>
        <li className='h-full w-full'>
          <Link href='/uses' aria-label='Uses' className={anchorClass}>
            Uses
          </Link>
        </li>
        <li className='h-full w-full'>
          <Link href='/contact' aria-label='Contact' className={anchorClass}>
            Hire Me!
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;

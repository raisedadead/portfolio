import { Social } from './social';
import { CustomLink as Link } from './custom-link';
import Image from 'next/image';

export const Profile: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='mb-8 md:mb-10'>
        <Image
          id='profile-image'
          alt="Mrugesh Mohapatra's profile picture."
          src='/images/profile.small.webp'
          className='h-28 w-28 border-4 border-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:h-36 md:w-36'
          width={144}
          height={144}
          priority
        />
      </div>
      <div className='relative mb-8 flex -rotate-12 transform flex-col items-center md:mb-10'>
        <h1 className='group rotate-12 transform cursor-pointer text-3xl font-extrabold text-slate-800 md:text-5xl'>
          {'Mrugesh Mohapatra'.toLowerCase()}
          <span
            className='absolute left-1/4 hidden w-auto rounded-md bg-black p-3 text-sm font-normal text-white group-hover:block'
            style={{
              top: '100%',
              marginTop: '0.75rem',
              transform: 'translateX(-50%)'
            }}
          >
            <Link
              href='https://itinerarium.github.io/phoneme-synthesis/?w= /ˈm.ruː.geɪ.ʃ/'
              className='no-underline'
              aria-label='Pronunciation of my name'
            >
              🗣 /ˈm.ruː.geɪ.ʃ/
            </Link>
            <svg
              className='absolute left-1/4 h-4 w-full text-black'
              style={{ top: '-0.5rem', transform: 'translateX(-50%)' }}
              viewBox='0 0 255 255'
              xmlSpace='preserve'
            >
              <polygon className='fill-current' points='128,0 128,128 0,128' />
            </svg>
          </span>
        </h1>
        <div className='m-1 mx-auto -mt-8 w-2/5 border-8 border-orange-50 bg-orange-50' />
      </div>
      <h2 className='mb-4 max-w-md p-1 text-xl leading-relaxed font-bold text-slate-700 md:text-2xl'>
        nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob 📷
      </h2>
      <h3 className='mb-8 p-1 text-lg leading-relaxed font-medium text-slate-700 md:text-xl'>
        Principal Maintainer — Cloud Infrastructure & Open-source,{' '}
        <Link
          href='https://www.freecodecamp.org/news/team#:~:text=around%20the%20world.-,Mrugesh%20Mohapatra,-from%20Bengaluru%2C%20India'
          className='-ml-1 p-1 text-slate-700 underline decoration-orange-200 decoration-wavy decoration-2 underline-offset-2 hover:text-white hover:decoration-white'
          aria-label='freecodecamp.org'
        >
          freeCodeCamp.org
        </Link>
      </h3>

      <div className='mb-10 flex flex-col items-center justify-center space-y-4'>
        <Link
          aria-label='Book a 1-on-1 Call'
          className='h-14 w-80 border-2 border-black bg-orange-50 p-3 text-lg font-semibold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
          href='https://topmate.io/mrugesh'
          type='button'
        >
          <span className='inline-flex items-center'>Get in touch!</span>
        </Link>
        <div className='flex flex-row justify-between space-x-8'>
          <Link
            aria-label='Browse my blog'
            className='flex h-12 w-36 items-center justify-center border-2 border-black bg-orange-200 text-base font-medium text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
            href='/blog'
            type='button'
          >
            <span>Blog</span>
          </Link>
          <Link
            aria-label='Browse my links'
            className='flex h-12 w-36 items-center justify-center border-2 border-black bg-orange-200 text-base font-medium text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
            href='/uses'
            type='button'
          >
            <span>Uses</span>
          </Link>
        </div>
      </div>
      <div className='prose prose-lg prose-slate mx-auto mt-8 max-w-3xl'>
        <h3 className='mb-4 text-center font-bold text-slate-700'>
          Elsewhere on the internet
        </h3>
        <Social />
      </div>
    </div>
  );
};

export default Profile;

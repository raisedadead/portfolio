import { Social } from './social';
import { CustomLink as Link } from './custom-link';
import Image from 'next/image';

export const Profile: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center'>
      <div>
        <Image
          id='profile-image'
          alt="Mrugesh Mohapatra's profile picture."
          src='/images/profile.small.webp'
          className='h-24 w-24 border-4 border-orange-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:h-32 md:w-32'
          width={128}
          height={128}
          priority
        />
      </div>
      <div className='relative mt-6 flex -rotate-12 transform flex-col items-center md:mt-20'>
        <h1 className='group -mt-2 rotate-12 transform cursor-pointer text-2xl font-bold text-slate-700 md:-mt-16 md:text-4xl'>
          {'Mrugesh Mohapatra'.toLowerCase()}
          <span
            className='absolute left-1/4 hidden w-auto rounded-md bg-black p-3 text-sm text-white group-hover:block'
            style={{
              top: '100%',
              marginTop: '0.5rem',
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
        <div className='m-1 mx-auto -mt-7 w-2/5 border-8 border-orange-200 bg-orange-200' />
      </div>
      <h2 className='mt-2 max-w-md p-1 text-lg font-bold text-slate-700'>
        nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob 📷
      </h2>
      <h3 className='text-md mb-4 p-1 font-medium text-slate-700'>
        Principal Maintainer — Cloud Infrastructure & Open-source,{' '}
        <Link
          href='https://www.freecodecamp.org/news/team#:~:text=around%20the%20world.-,Mrugesh%20Mohapatra,-from%20Bengaluru%2C%20India'
          className='-ml-1 p-1 text-slate-700 underline decoration-orange-200 decoration-wavy decoration-2 underline-offset-2 hover:text-white hover:decoration-white'
          aria-label='freecodecamp.org'
        >
          freeCodeCamp.org
        </Link>
      </h3>

      <div className='mb-4 mt-2 flex flex-col items-center justify-center space-y-2'>
        <Link
          aria-label='Book a 1-on-1 Call'
          className='h-12 w-80 border-2 border-black bg-white p-2.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
          href='https://topmate.io/mrugesh'
          type='button'
        >
          <span className='inline-flex items-center'>Get in touch!</span>
        </Link>
        <div className='flex flex-row justify-between space-x-8'>
          <Link
            aria-label='Browse my blog'
            className='h-10 w-36 border-2 border-black bg-orange-200 p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
            href='/blog'
            type='button'
          >
            <span className='inline-flex items-center'>Blog</span>
          </Link>
          <Link
            aria-label='Browse my links'
            className='h-10 w-36 border-2 border-black bg-orange-200 p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
            href='https://bio.link/mrugesh'
            type='button'
          >
            <span className='inline-flex items-center'>Links</span>
          </Link>
        </div>
      </div>
      <p className='text-slate-700-0 mx-auto p-0 text-sm font-medium text-slate-700 lg:mt-4'>
        Elsewhere on the internet
      </p>
      <Social />
    </div>
  );
};

export default Profile;

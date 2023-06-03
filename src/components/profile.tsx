import { Social } from './social';
import { CustomLink as Link } from './custom-link';
import { BookmarkIcon, LinkIcon } from '@heroicons/react/24/solid';

export const Profile: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center'>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id='profile-image'
          alt="Mrugesh Mohapatra's profile picture."
          src='/images/profile.jpg'
          className='h-24 w-24 rounded-full border-4 border-orange-200 shadow-[5px_2px_0_0_rgba(60,64,43,.2)] backdrop-blur-lg md:h-32 md:w-32'
        />
      </div>
      <div className='mt-6 -rotate-12 transform md:mt-20'>
        <h1 className='-mt-2 rotate-12 transform text-2xl font-bold text-slate-600 md:-mt-16 md:text-4xl'>
          {'Mrugesh Mohapatra'.toLowerCase()}
        </h1>
        <div className='m-1 mx-auto -mt-7 w-2/5 rounded-full border-8 border-orange-200 bg-orange-200' />
      </div>
      <h2 className='mt-2 max-w-md p-1 text-lg font-bold text-slate-600'>
        nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob 📷
      </h2>
      <h3 className='text-md mb-4 p-1 font-medium text-slate-600 '>
        Principal Maintainer — Cloud Infrastructure & Open-source,{' '}
        <Link
          href='https://www.freecodecamp.org/news/team#:~:text=around%20the%20world.-,Mrugesh%20Mohapatra,-from%20Bengaluru%2C%20India'
          className='-ml-1 p-1 text-slate-600 underline decoration-orange-200 decoration-wavy decoration-2 underline-offset-2 hover:text-white hover:decoration-white'
          aria-label='freecodecamp.org'
        >
          freeCodeCamp.org
        </Link>
      </h3>

      <div className='mb-4 mt-2 flex flex-col items-center justify-center space-y-2'>
        <Link
          aria-label='Schedule a call'
          className='w-80 items-center rounded-md bg-white px-1 py-1 text-sm font-medium text-black shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:px-4 md:py-2'
          href='https://topmate.io/mrugesh'
          type='button'
        >
          <span className='inline-flex items-center'>Book a 1:1 Call</span>
        </Link>
        <div className='flex flex-row justify-between space-x-8'>
          <Link
            aria-label='Browse my blog'
            className='w-36 items-center rounded-md bg-orange-200 px-2 py-1 text-sm font-medium text-slate-600 shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:px-4 md:py-2'
            href='https://hn.mrugesh.dev'
            type='button'
          >
            <span className='inline-flex items-center'>
              <BookmarkIcon className='mr-2 h-3 w-3' aria-hidden='true' />
              Blog
            </span>
          </Link>
          <Link
            aria-label='Ask me anything'
            className='w-36 items-center rounded-md bg-orange-200 px-2 py-1 text-sm font-medium text-slate-600 shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:px-4 md:py-2'
            href='https://bio.link/mrugesh'
            type='button'
          >
            <span className='inline-flex items-center'>
              <LinkIcon className='mr-2 h-3 w-3' aria-hidden='true' />
              Links
            </span>
          </Link>
        </div>
      </div>
      <p className='text-slate-600-0 mx-auto p-0 text-sm font-medium text-slate-600 lg:mt-4'>
        Elsewhere on the internet
      </p>
      <Social />
    </div>
  );
};

export default Profile;

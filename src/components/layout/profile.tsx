import { useRef } from 'react';

import CalButton from '@/components/cal-embed';
import { CustomLink as Link } from '@/components/custom-link';
import { Social } from '@/components/social';

const secondaryButtonClasses =
  'inline-flex items-center justify-center h-14 px-6 py-3 text-sm font-bold sm:text-base md:text-lg brutalist-button-secondary';

const primaryButtonClasses =
  'inline-flex items-center justify-center h-14 px-6 py-3 text-sm font-bold sm:text-base md:text-lg brutalist-button-primary';

export const Profile: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playPronunciation = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='mb-8 md:mb-10'>
        <img
          id='profile-image'
          alt="Mrugesh Mohapatra's profile picture."
          src='/images/logo.png'
          className='shadow-brutal-md h-28 w-28 rounded-full border-2 border-orange-50 md:h-48 md:w-48'
          width={256}
          height={256}
        />
      </div>
      <div className='relative mb-6 flex -rotate-12 transform flex-col items-center'>
        <audio ref={audioRef} src='/audio/mrugesh-pronunciation.mp3' preload='auto'>
          <track kind='captions' src='/audio/mrugesh-pronunciation.vtt' srcLang='en' label='English' default />
        </audio>
        <h1 className='group text-display-lg rotate-12 transform text-slate-800'>
          <button
            type='button'
            onClick={playPronunciation}
            className='font-inherit m-0 cursor-pointer border-none bg-transparent p-0 text-inherit'
            aria-label="Listen to the pronunciation of Mrugesh's name"
          >
            {'Mrugesh Mohapatra'.toLowerCase()}
          </button>
          <span
            className='pointer-events-none absolute bottom-full left-1/4 mb-3 hidden w-auto -translate-x-1/2 rounded-md bg-black p-3 text-sm font-normal text-white group-hover:block'
            aria-hidden='true'
          >
            🗣 /ˈm.ruː.geɪ.ʃ/
            <svg
              className='absolute top-full left-1/2 h-2 w-4 -translate-x-1/2 text-black'
              viewBox='0 0 16 8'
              aria-hidden='true'
            >
              <polygon className='fill-current' points='0,0 8,8 16,0' />
            </svg>
          </span>
        </h1>
        <div className='m-1 mx-auto -mt-8 w-2/5 border-12 border-orange-50 bg-orange-50' />
      </div>
      <h2 className='text-display-sm mb-4 p-1 leading-relaxed text-slate-700'>
        dad{' '}
        <span className='relative inline-block'>
          nocturnal
          <span
            className='pointer-events-none absolute inset-x-0 overflow-hidden text-transparent underline decoration-white decoration-wavy decoration-2'
            style={{ top: '-25%' }}
            aria-hidden='true'
          >
            nocturnal
          </span>
        </span>{' '}
        developer • open-sourcerer
      </h2>
      <h3 className='mb-8 p-1 text-base leading-relaxed font-medium text-slate-700 sm:text-lg md:text-xl'>
        Principal Maintainer — Cloud Infrastructure & Open-source,{' '}
        <Link
          href='https://www.freecodecamp.org/news/team#:~:text=around%20the%20world.-,Mrugesh%20Mohapatra,-from%20Bengaluru%2C%20India'
          className='group relative inline-block px-1 text-white no-underline transition-colors hover:text-slate-700'
          aria-label='freecodecamp.org'
        >
          <span
            className='absolute inset-0 -skew-x-12 bg-slate-700 transition-colors group-hover:bg-white'
            aria-hidden='true'
          />
          <span className='relative'>freeCodeCamp.org</span>
        </Link>
      </h3>

      <div className='mb-10 flex w-full max-w-md flex-col items-center justify-center gap-4 px-4 sm:flex-row'>
        <CalButton
          aria-label='Schedule a meeting with me'
          className={`${primaryButtonClasses} w-full sm:w-auto sm:flex-1`}
        >
          Schedule a Meeting
        </CalButton>
        <Link
          aria-label='Browse my blog'
          className={`${secondaryButtonClasses} w-full sm:w-auto sm:min-w-36`}
          href='/blog'
          type='button'
        >
          Blog
        </Link>
      </div>
      <div className='prose prose-lg prose-slate mx-auto mt-8 max-w-3xl'>
        <h3 className='mb-4 text-center font-bold text-slate-700'>Elsewhere on the internet</h3>
        <Social />
      </div>
    </div>
  );
};

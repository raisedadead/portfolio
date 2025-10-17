import CalButton from './cal-embed';
import { CustomLink as Link } from './custom-link';
import { Social } from './social';

const secondaryButtonClasses =
  'inline-flex items-center justify-center h-14 border-2 border-black bg-orange-200 px-6 py-3 text-lg font-bold text-black shadow-[4px_4px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-50 hover:shadow-[6px_6px_0px_var(--color-black)] focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none active:bg-black active:text-white active:shadow-none';

const primaryButtonClasses =
  'inline-flex items-center justify-center h-14 border-2 border-black bg-orange-50 px-6 py-3 text-lg font-bold text-black shadow-[4px_4px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-200 hover:shadow-[6px_6px_0px_var(--color-black)] focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none active:bg-black active:text-white active:shadow-none';

export const Profile: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='mb-8 md:mb-10'>
        <img
          id='profile-image'
          alt="Mrugesh Mohapatra's profile picture."
          src='/images/profile.small.webp'
          className='h-28 w-28 border-2 border-orange-50 shadow-[4px_4px_0px_var(--color-black)] md:h-36 md:w-36'
          width={144}
          height={144}
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
              aria-hidden='true'
            >
              <polygon className='fill-current' points='128,0 128,128 0,128' />
            </svg>
          </span>
        </h1>
        <div className='m-1 mx-auto -mt-8 w-2/5 border-12 border-orange-50 bg-orange-50' />
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

      <div className='mb-10 flex flex-row items-center justify-center space-x-4'>
        <CalButton aria-label='Schedule a meeting with me' className={`${primaryButtonClasses} w-80`}>
          <span className='inline-flex items-center'>Schedule a Meeting</span>
        </CalButton>
        <Link aria-label='Browse my blog' className={`${secondaryButtonClasses} w-36`} href='/blog' type='button'>
          <span className='inline-flex items-center'>Blog</span>
        </Link>
      </div>
      <div className='prose prose-lg prose-slate mx-auto mt-8 max-w-3xl'>
        <h3 className='mb-4 text-center font-bold text-slate-700'>Elsewhere on the internet</h3>
        <Social />
      </div>
    </div>
  );
};

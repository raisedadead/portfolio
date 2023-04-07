import type { NextPage } from 'next';
import Board from '../components/game-of-life/board';
import { Footer } from '../components/footer';
import Link from 'next/link';

const GameOfLife: NextPage = () => {
  return (
    <main>
      <div className='mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8'>
        <div className='mx-auto flex h-4/5 w-2/3 max-w-4xl flex-col items-center'>
          <h1 className='mx-auto text-center text-xl font-bold text-slate-600 md:p-2 md:text-3xl'>
            Game of Life
          </h1>
          <div className='prose pb-6'>
            <p className='prose-h2 mx-auto my-2 p-1 text-sm text-slate-600 md:text-base'>
              This is an implementation of Conway&apos;s Game of Life created
              using ChatGPT.{' '}
            </p>
            <p className='prose-h2 mx-auto my-2 p-1 text-sm text-slate-600 md:text-base'>
              Almost all the code other than the CSS is generated using the
              GPT-4 Model. It is fun and exciting to see that the model can
              generate code that is not only syntactically correct but also
              semantically correct.
            </p>
            <p className='prose-h2 mx-auto my-2 p-1 text-sm text-slate-600 md:text-base'>
              And it works!
            </p>
            <p className='prose-h2 mx-auto my-2 p-1 text-sm text-slate-600 md:text-base'>
              {' '}
              The code is available{' '}
              <a
                href='https://github.com/raisedadead/portfolio/pull/1316/files'
                rel='noopener noreferrer external'
                target='_blank'
              >
                on GitHub
              </a>
              .
            </p>
          </div>
          <Board />
          <Link
            href='/'
            aria-label='Go to the home page'
            className='rounded-full px-2 py-1 text-gray-700 hover:bg-gray-500 hover:text-gray-50'
          >
            Go Back
          </Link>
        </div>
        <Footer defaultType={true} />
      </div>
    </main>
  );
};

export default GameOfLife;

import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MetaHead } from '../components/head';
import Layout from '../components/layouts';
import { cn } from '../lib/utils';

const NotFound: NextPage = () => (
  <>
    <MetaHead pageTitle='Page Not Found' />
    <Layout variant='main'>
      <section className={cn('mb-8 flex flex-col items-center justify-center')}>
        <div
          className={cn('prose prose-lg prose-slate max-w-none text-center')}
        >
          <h1
            className={cn(
              'py-4 font-extrabold text-4xl text-slate-900 tracking-tight'
            )}
          >
            Page Not Found
          </h1>
          <p className={cn('font-medium text-slate-700 text-xl')}>
            Oops! It seems you&apos;ve wandered into uncharted territory.
          </p>
        </div>
        <div
          className={cn(
            'my-8 flex w-full flex-col items-center justify-center'
          )}
        >
          <Image src='/images/404.svg' alt='404' width={640} height={640} />
          <p className={cn('mt-2 text-slate-500 text-xs')}>
            Image by storyset on Freepik
          </p>
        </div>
        <p className={cn('mb-6 font-medium text-lg text-slate-700')}>
          Don&apos;t worry, even the best explorers get lost sometimes!
        </p>
        <Link
          href='/'
          className={cn(
            'inline-flex items-center border-2 border-black bg-orange-200 px-4 py-2',
            'text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]',
            'hover:bg-gray-700 hover:text-white hover:shadow-none',
            'focus:outline-hidden active:bg-black active:shadow-none'
          )}
        >
          Return to Home
        </Link>
      </section>
    </Layout>
  </>
);

export default NotFound;

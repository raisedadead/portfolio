import { MetaHead } from '@/components/head';
import { Layout } from '@/components/layouts';
import { Profile } from '@/components/profile';
import { cn } from '@/lib/utils';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <MetaHead />
      <Layout variant='main' showHomeButton={false}>
        <section className={cn('mb-12')}>
          <div className={cn('mx-auto max-w-4xl')}>
            <Profile />
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Home;

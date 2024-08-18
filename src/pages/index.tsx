import type { NextPage } from 'next';
import { MetaHead } from '@/components/head';
import { Profile } from '@/components/profile';
import { Layout } from '@/components/layouts';
import { cn } from '@/lib/utils';

const Home: NextPage = () => {
  return (
    <>
      <MetaHead />
      <Layout variant='main'>
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

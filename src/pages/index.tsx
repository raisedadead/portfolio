import type { NextPage } from 'next';
import { MetaHead } from '@/components/head';
import { Profile } from '@/components/profile';
import { Layout } from '@/components/layouts';
import { cn } from '@/lib/utils';

const Home: NextPage = () => {
  return (
    <>
      <MetaHead />
      <Layout variant='main' className={cn('')}>
        <Profile />
      </Layout>
    </>
  );
};

export default Home;

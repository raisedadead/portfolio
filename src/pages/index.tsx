import type { NextPage } from 'next';
import { MetaHead } from '@/components/head';
import { Profile } from '@/components/profile';
import { Layout } from '@/components/layouts';

const Home: NextPage = () => {
  return (
    <>
      <MetaHead />
      <Layout variant='main'>
        <Profile />
      </Layout>
    </>
  );
};

export default Home;

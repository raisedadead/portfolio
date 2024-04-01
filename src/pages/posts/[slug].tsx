import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { fetchPostBySlug, Post } from '../../lib/posts-fetcher';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkImages from 'remark-images';

import MetaHead from '@/components/head';
import Layout from '@/components/layouts';

type PostProps = {
  post: Post;
};

const SinglePostPage: NextPage<PostProps> = ({ post }) => {
  return (
    <>
      <MetaHead pageTitle={post.title} />
      <Layout>
        <section className='mt-10 border-2 border-black bg-blue-100 p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
          <article className='prose max-w-none'>
            <h1>{post.title}</h1>
            <p>{new Date(post.publishedAt).toDateString()}</p>
            <Markdown remarkPlugins={[remarkGfm, remarkImages]}>
              {post.content.markdown}
            </Markdown>
          </article>
        </section>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // You would fetch all possible slugs here and return them as paths
  // For now, we'll return an empty array for simplicity
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export default SinglePostPage;

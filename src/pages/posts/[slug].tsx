import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { fetchPostBySlug, Post } from '../../lib/posts-fetcher';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkImages from 'remark-images';
import Image from 'next/image';

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
        <section className='mt-10 border-2 border-black bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]'>
          <article className='prose prose-slate max-w-none'>
            <h1 className='mb-2 text-3xl font-bold text-slate-800'>
              {post.title}
            </h1>
            <div className='mb-6 flex items-center text-sm text-slate-600'>
              <span>{new Date(post.publishedAt).toDateString()}</span>
              <span className='mx-2'>•</span>
              <span>{post.readTimeInMinutes} min read</span>
              {post.reactionCount > 0 && (
                <>
                  <span className='mx-2'>•</span>
                  <span>{post.reactionCount} reactions</span>
                </>
              )}
            </div>
            {post.coverImage && (
              <Image
                src={post.coverImage.url}
                alt={post.title}
                width={1200}
                height={630}
                className='mb-6 w-full rounded-lg object-cover shadow-md'
              />
            )}
            <div className='prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-code:rounded-md prose-code:bg-slate-100 prose-code:p-1 prose-code:text-sm prose-pre:bg-slate-800 prose-pre:text-slate-100'>
              <Markdown remarkPlugins={[remarkGfm, remarkImages]}>
                {post.content.markdown}
              </Markdown>
            </div>
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

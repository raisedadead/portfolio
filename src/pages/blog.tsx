import React from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';

import type { Post } from './api/hashnode';

import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data: {
    posts?: Post[];
    message?: string;
  } = await res.json();

  if (res.status !== 200) {
    const { message = 'An error occurred' } = data;
    throw new Error(message);
  }

  return data.posts;
};

const Blog: NextPage = () => {
  const { data: posts, error } = useSWR('/api/hashnode', fetcher);

  if (error) {
    return (
      <Layout>
        <section>
          <div className='prose prose-slate pb-5 pt-5'>
            <h1 className='px-8 text-2xl font-bold text-slate-700'>
              Recent articles from my blog:
            </h1>
            <p className='px-8 text-sm text-gray-500'>{error.message}</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!posts) {
    return (
      <Layout>
        <section>
          <div className='prose prose-slate pb-5 pt-5'>
            <h1 className='px-8 text-2xl font-bold text-slate-700'>
              Recent articles from my blog:
            </h1>
            <ul role='list' className='list-none divide-y divide-gray-200'>
              <li className='py-4'>
                <div role='status' className='max-w-sm animate-pulse'>
                  <div className='mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-500'></div>
                  <div className='mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700'></div>
                  <div className='mb-2.5 h-2 max-w-[330px] rounded-full bg-gray-200 dark:bg-gray-500'></div>
                  <div className='mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-500'></div>
                  <div className='h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-500'></div>
                  <span className='sr-only'>Loading...</span>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section>
        <div className='prose prose-slate pb-5 pt-5'>
          <h1 className='px-8 text-2xl font-bold text-slate-700'>
            Recent articles from my blog:
          </h1>
          <ul role='list' className='list-none divide-y divide-gray-200'>
            {posts.map((post: Post, index: number) =>
              post.title && post.link ? (
                <li className='py-4' key={index}>
                  <Link href={post.link} className='no-underline'>
                    <div className='flex space-y-1'>
                      <div className='flex flex-col justify-between'>
                        <p className='text-sm text-gray-500'>
                          {new Date(post.dateAdded).toDateString()} •{' '}
                          {post.totalReactions} reactions
                        </p>
                        <h3 className="my-1 text-sm font-bold after:content-['_↗']">
                          {post.title}
                        </h3>
                        <p className='text-sm text-gray-500'>{post.brief}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;

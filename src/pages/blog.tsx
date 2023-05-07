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

const CommonContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Layout>
    <section>
      <div className='prose prose-sm prose-slate max-w-none'>
        <h1 className='pl-6 font-bold text-slate-700'>
          Recent articles from my blog:
        </h1>
        <div className='px-0'>{children}</div>
      </div>
    </section>
  </Layout>
);

const Blog: NextPage = () => {
  const { data: posts, error } = useSWR('/api/hashnode', fetcher);

  if (error) {
    console.error('Error: ', error);
    return (
      <CommonContainer>
        <div className='pl-6 text-gray-600'>
          <p>
            Sorry, We believe we facing issues fetching articles right now.
            Please try again in a bit. Thanks for your patience.
          </p>
          <p>Details of the error are logged in the developer console.</p>
        </div>
      </CommonContainer>
    );
  }

  if (!posts) {
    return (
      <CommonContainer>
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
      </CommonContainer>
    );
  }

  return (
    <CommonContainer>
      <ul role='list' className='divide-y divide-dashed divide-orange-600'>
        {posts.map((post: Post, index: number) =>
          post.title && post.link ? (
            <li className='py-1' key={index}>
              <div className='flex space-y-1'>
                <div className='flex flex-col justify-between'>
                  <Link href={post.link} className='no-underline'>
                    <h3 className="text-sm font-bold text-blue-600 after:content-['_↗'] hover:text-black">
                      {post.title}
                    </h3>
                  </Link>
                  <p className='text-sm text-black'>{post.brief}</p>
                  <p className='text-sm text-gray-600'>
                    {new Date(post.dateAdded).toDateString()} •{' '}
                    {post.totalReactions} reactions
                  </p>
                </div>
              </div>
            </li>
          ) : null
        )}
      </ul>
    </CommonContainer>
  );
};

export default Blog;

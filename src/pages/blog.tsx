import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';

import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';

import { postsFetcher } from '../lib/posts-fetcher';
import type { Post } from '../lib/posts-fetcher';

const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Layout>
    <section>
      <div className='container max-w-none'>
        <h1 className='text-lg font-bold text-slate-600'>
          Recent articles from my blog:
        </h1>
        <div className='px-0 py-4'>{children}</div>
      </div>
    </section>
  </Layout>
);

const ErrorBlock = () => (
  <PageWrapper>
    <div className='flex flex-col space-y-2 text-sm text-gray-600'>
      <p>
        Sorry, We believe we facing issues fetching articles right now. Please
        try again in a bit.
      </p>
      <p>Details of the error may be logged in the developer console.</p>
      <p>Thanks for your patience.</p>
    </div>
  </PageWrapper>
);

const SkeletonBlock = () => (
  <PageWrapper>
    <ul role='list' className='list-none divide-y divide-gray-200'>
      <li className='py-4'>
        <div role='status' className='max-w-sm animate-pulse'>
          <div className='mb-2.5 h-2 max-w-[360px] bg-blue-600'></div>
          <div className='mb-2.5 h-2 max-w-[330px] bg-gray-500'></div>
          <div className='mb-2.5 h-2 max-w-[300px] bg-gray-500'></div>
          <div className='mb-4 h-2 max-w-[360px] bg-gray-500'></div>
          <div className='h-2 w-48 bg-gray-200 dark:bg-gray-500'></div>
          <span className='sr-only'>Loading...</span>
        </div>
      </li>
    </ul>
  </PageWrapper>
);

const Blog: NextPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [disableLoadMore, setDisableLoadMore] = useState(false);

  const { data: currentPosts, error } = useSWR(`${pageIndex}`, (key) =>
    postsFetcher(key, pageIndex)
  );

  useEffect(() => {
    if (currentPosts) {
      setPosts((prevPosts) => {
        if (prevPosts) {
          return [...prevPosts, ...currentPosts];
        }
        return currentPosts;
      });
    }
    setDisableLoadMore(!currentPosts?.length);
  }, [currentPosts]);

  if (error) {
    console.error('Error: ', error);
    return <ErrorBlock />;
  }

  if (!posts) {
    return <SkeletonBlock />;
  }

  return (
    <PageWrapper>
      <ul role='list' className='list-none divide-y divide-slate-400'>
        {posts.map((post: Post, index: number) =>
          post.title && post.slug ? (
            <li className='pb-2 pt-4' key={index}>
              <div className='flex flex-col space-y-4'>
                <Link
                  href={`https://hn.mrugesh.dev/${post.slug}?source=website`}
                  className='no-underline'
                >
                  <h3 className="text-sm font-bold text-blue-600 after:content-['_↗'] hover:text-black">
                    {post.title}
                  </h3>
                </Link>
                <p className='text-sm text-slate-600'>{post.brief}</p>
                <p className='text-sm text-slate-500'>
                  {new Date(post.dateAdded).toDateString()}
                  {post.totalReactions
                    ? ` • ${post.totalReactions} reactions`
                    : ''}
                  {post.replyCount ? ` • ${post.replyCount} comments` : ''}
                </p>
              </div>
            </li>
          ) : null
        )}
      </ul>
      <div className='flex justify-center py-5'>
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          className='items-center rounded border border-solid border-orange-50 bg-orange-400 px-4 py-2 text-sm font-medium text-black shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-black'
          disabled={disableLoadMore}
        >
          {disableLoadMore ? (
            <span>That&apos;s the end. No more articles.</span>
          ) : (
            <span>Load more articles...</span>
          )}
        </button>
      </div>
    </PageWrapper>
  );
};

export default Blog;

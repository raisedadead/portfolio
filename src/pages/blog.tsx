import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';

import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';
import { postsFetcher, Post } from '../lib/posts-fetcher';
import { MetaHead } from '../components/head';

const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <>
    <MetaHead pageTitle='Recent posts' />
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
  </>
);

const ErrorBlock = () => (
  <PageWrapper>
    <div className='flex flex-col space-y-2 text-sm text-gray-600'>
      <p>
        Sorry, we are facing issues fetching articles right now. Please try
        again in a bit.
      </p>
      <p>Details of the error may be logged in the developer console.</p>
      <p>Thanks for your patience.</p>
    </div>
  </PageWrapper>
);

const SkeletonBlock = () => (
  <ul role='list' className='list-none'>
    <li className='border-2 border-black bg-white p-2 shadow-[4px_2px_0px_rgba(0,0,0,1)]'>
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
);

const usePosts = (pageCursor: string) => {
  const { data, error, isValidating } = useSWR(['/api/posts', pageCursor], () =>
    postsFetcher('posts', pageCursor)
  );

  const {
    posts,
    pageInfo: { endCursor, hasNextPage }
  } = data || {
    posts: [],
    pageInfo: {
      endCursor: '',
      hasNextPage: false
    }
  };

  return { posts, endCursor, hasNextPage, error, isValidating };
};

const Blog: NextPage = () => {
  const [pageCursor, setPageCursor] = useState('');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const { posts, endCursor, hasNextPage, error, isValidating } =
    usePosts(pageCursor);

  useEffect(() => {
    if (posts) {
      setAllPosts((prevPosts) => [...prevPosts, ...posts]);
    }
  }, [posts]);

  const loadMoreArticles = () => {
    if (!hasNextPage || isValidating) return;
    setPageCursor(endCursor);
  };

  if (error) {
    console.error('Error: ', error);
    return (
      <PageWrapper>
        <ErrorBlock />
      </PageWrapper>
    );
  }

  if (allPosts.length === 0) {
    return (
      <PageWrapper>
        <SkeletonBlock />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ul role='list' className='list-none'>
        {allPosts.map((post: Post) =>
          post.title && post.slug ? (
            <li
              className='my-2 border-2 border-black bg-blue-100 p-2 shadow-[4px_2px_0px_rgba(0,0,0,1)]'
              key={post.slug}
            >
              <div className='flex flex-col space-y-4'>
                <Link
                  href={`https://hn.mrugesh.dev/${post.slug}?source=website`}
                  className='no-underline'
                >
                  <h3 className="text-sm font-bold text-blue-600 after:content-['_↗'] hover:text-black">
                    {post.title}
                  </h3>
                </Link>
                <p className='text-sm text-slate-900'>{post.brief}</p>
                <p className='text-sm text-slate-600'>
                  {new Date(post.publishedAt).toDateString()}
                  {post.readTimeInMinutes
                    ? ` • ${post.readTimeInMinutes} min read`
                    : ''}
                  {post.reactionCount
                    ? ` • ${post.reactionCount} reactions`
                    : ''}
                  {post.replyCount ? ` • ${post.replyCount} comments` : ''}
                </p>
              </div>
            </li>
          ) : null
        )}
      </ul>
      {isValidating ? <SkeletonBlock /> : null}
      <div className='flex justify-center py-5'>
        <button
          onClick={loadMoreArticles}
          className='w-[50%] items-center border-2 border-black bg-orange-200 p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-orange-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-orange-100 disabled:hover:text-gray-400 disabled:hover:shadow-none disabled:active:bg-orange-100 disabled:active:shadow-none'
          disabled={!hasNextPage || isValidating}
        >
          {isValidating ? (
            <span>Loading...</span>
          ) : hasNextPage ? (
            <span>Load more articles</span>
          ) : (
            <span>That&apos;s the end. No more articles.</span>
          )}
        </button>
      </div>
    </PageWrapper>
  );
};

export default Blog;

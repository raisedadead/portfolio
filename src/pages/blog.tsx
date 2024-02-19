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

const usePosts = (pageCursor: string) => {
  const { data, error, isValidating } = useSWR(['/api/posts', pageCursor], () =>
    postsFetcher('posts', pageCursor)
  );

  const isLoadingMore = isValidating && data && data.pageInfo.hasNextPage;

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

  return { posts, endCursor, hasNextPage, error, isLoadingMore };
};

const Blog: NextPage = () => {
  const [pageCursor, setPageCursor] = useState('');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const { posts, endCursor, hasNextPage, error, isLoadingMore } =
    usePosts(pageCursor);

  useEffect(() => {
    if (posts) {
      setAllPosts((prevPosts) => [...prevPosts, ...posts]);
    }
  }, [posts]);

  const loadMoreArticles = () => {
    if (!hasNextPage || isLoadingMore) return;
    setPageCursor(endCursor);
  };

  if (error) {
    console.error('Error: ', error);
    return <ErrorBlock />;
  }

  if (allPosts.length === 0) {
    return <SkeletonBlock />;
  }

  return (
    <PageWrapper>
      <ul role='list' className='list-none divide-y divide-slate-400'>
        {allPosts.map((post: Post) =>
          post.title && post.slug ? (
            <li className='pb-2 pt-4' key={post.slug}>
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
      <div className='flex justify-center py-5'>
        <button
          onClick={loadMoreArticles}
          className='items-center rounded border-b-2 border-r-2 border-gray-600 bg-orange-100 px-4 py-2 text-sm font-medium text-black shadow-[4px_4px_0_0_rgba(60,64,43,.2)] backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-black'
          disabled={!hasNextPage || isLoadingMore}
        >
          {isLoadingMore ? (
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

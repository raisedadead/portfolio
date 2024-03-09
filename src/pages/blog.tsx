import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

import Layout from '@/components/layouts';
import { CustomLink as Link } from '@/components/custom-link';
import { postsFetcher, Post, ResponseData } from '../lib/posts-fetcher';
import { MetaHead } from '@/components/head';

const SWR_Key_Prefix = '/api/posts';
const SWR_Cursor_for_firstPage = '';

const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <>
    <MetaHead pageTitle='Recent posts' />
    <Layout>
      <section>
        <div className='prose prose-sm prose-slate max-w-none'>
          <h1 className='py-2 text-center font-bold text-slate-700'>
            My Musings
          </h1>
        </div>
      </section>
      <section>
        <div className='prose prose-sm prose-slate max-w-none'>
          <p className='text-center text-slate-500'>
            Stuff that I write about, mostly tech, sometimes life.
          </p>
          {children}
        </div>
      </section>
    </Layout>
  </>
);

const ErrorBlock = () => (
  <li className='border-2 border-black bg-red-100 p-4 shadow-[4px_2px_0px_rgba(0,0,0,1)]'>
    <h3 className='text-red-800'>Oops! Something went wrong.</h3>
    <p className='text-red-800'>
      There seems to be an issue fetching articles right now. Please try
      visiting this page after a while. Additional details about this might
      logged in the developer console.
    </p>
    <p className='text-red-800'>
      Sorry about this and thanks for your patience!
    </p>
  </li>
);

const SkeletonBlock = () => (
  <li className='border-2 border-black bg-blue-100 p-4 shadow-[4px_2px_0px_rgba(0,0,0,1)]'>
    <div role='status' className='max-w-sm animate-pulse'>
      <div className='mb-4 h-5 max-w-[360px] bg-blue-500'></div>
      <div className='mb-2 h-3 max-w-[330px] bg-slate-500'></div>
      <div className='mb-2 h-3 max-w-[300px] bg-slate-500'></div>
      <div className='mb-4 h-3 max-w-[360px] bg-slate-500'></div>
      <div className='h-3 w-48 bg-slate-400'></div>
      <span className='sr-only'>Loading...</span>
    </div>
  </li>
);

export const getStaticProps = (async () => {
  const data = await postsFetcher(
    `${SWR_Key_Prefix}//${SWR_Cursor_for_firstPage}`,
    SWR_Cursor_for_firstPage
  );
  return {
    props: {
      fallback: {
        [unstable_serialize([
          `${SWR_Key_Prefix}//${SWR_Cursor_for_firstPage}`,
          SWR_Cursor_for_firstPage
        ])]: data
      }
    }
  };
}) satisfies GetStaticProps;

const Blog: NextPage<{
  fallback: {
    '': ResponseData;
  };
}> = ({ fallback }) => {
  const [pageCursor, setPageCursor] = useState(SWR_Cursor_for_firstPage);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const { data, error, isValidating } = useSWR(
    [`${SWR_Key_Prefix}//${pageCursor}`, pageCursor],
    () => postsFetcher(`${SWR_Key_Prefix}//${pageCursor}`, pageCursor),
    {
      fallback,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false
    }
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

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prevPosts) => {
        const uniquePosts = Array.from(new Set([...prevPosts, ...posts]));
        return uniquePosts;
      });
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
        <ul role='list' className='list-none p-0'>
          <ErrorBlock />
        </ul>
      </PageWrapper>
    );
  }

  if (allPosts.length === 0) {
    return (
      <PageWrapper>
        <ul role='list' className='list-none p-0'>
          <SkeletonBlock />
        </ul>
      </PageWrapper>
    );
  }

  return (
    <SWRConfig value={{ fallback }}>
      <PageWrapper>
        <ul role='list' className='list-none p-0'>
          {allPosts.map((post: Post) =>
            post.title && post.slug ? (
              <li
                className='my-2 border-2 border-black bg-blue-100 px-4 shadow-[4px_2px_0px_rgba(0,0,0,1)]'
                key={post.slug}
              >
                <Link
                  href={`https://hn.mrugesh.dev/${post.slug}?source=website`}
                  className='no-underline'
                >
                  <p className="text-lg text-blue-600 after:content-['_↗']">
                    {post.title}
                  </p>
                  <p className='text-slate-900'>{post.brief}</p>
                  <p className='text-slate-600'>
                    {new Date(post.publishedAt).toDateString()}
                    {post.readTimeInMinutes
                      ? ` • ${post.readTimeInMinutes} min read`
                      : ''}
                    {post.reactionCount
                      ? ` • ${post.reactionCount} reactions`
                      : ''}
                    {post.replyCount ? ` • ${post.replyCount} comments` : ''}
                  </p>
                </Link>
              </li>
            ) : null
          )}
          {isValidating ? <SkeletonBlock /> : null}
        </ul>
        <div className='flex justify-center py-5'>
          <button
            onClick={loadMoreArticles}
            className='w-[50%] items-center border-2 border-black bg-orange-200 p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none disabled:border-transparent disabled:bg-orange-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-orange-100 disabled:hover:text-gray-400 disabled:hover:shadow-none disabled:active:bg-orange-100 disabled:active:shadow-none'
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
    </SWRConfig>
  );
};

export default Blog;

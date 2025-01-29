import React, { useState, useEffect, useCallback } from 'react';
import { NextPage, GetStaticProps } from 'next';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

import Layout from '@/components/layouts';
import {
  fetchPostsList,
  Post,
  ResponseData,
  APIErrorResponse,
  POSTS_PER_PAGE
} from '@/lib/posts-fetcher';
import { MetaHead } from '@/components/head';
import { cn } from '@/lib/utils';
import { Social } from '@/components/social';
import BlogPostCard from '@/components/blog-post-card';

const SWR_Key_Prefix = '/api/posts';
const SWR_Cursor_for_firstPage = '';

const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <>
    <MetaHead pageTitle='Recent posts' setCanonicalBlogBaseURL={true} />
    <Layout variant='main'>
      <section className={cn('mb-8')}>
        <div className={cn('prose prose-lg prose-slate max-w-none')}>
          <h1
            className={cn(
              'py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900'
            )}
          >
            My Musings
          </h1>
        </div>
      </section>
      <section className={cn('mb-12')}>
        <div className={cn('mx-auto max-w-4xl')}>
          <p
            className={cn(
              'pb-6 text-center text-lg font-medium text-slate-700'
            )}
          >
            Stuff that I write about, mostly tech, sometimes life.
          </p>
          {children}
        </div>
      </section>
      <section>
        <div
          className={cn('prose prose-lg prose-slate mx-auto mt-8 max-w-3xl')}
        >
          <h3 className={cn('mb-4 text-center font-bold text-slate-700')}>
            Elsewhere on the internet
          </h3>
          <Social />
        </div>
      </section>
    </Layout>
  </>
);

const ErrorBlock = ({ message }: { message: string }) => (
  <div
    className={cn(
      'border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]',
      'transition-all duration-300 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]',
      'mx-auto my-8 max-w-2xl'
    )}
  >
    <h2 className={cn('mb-4 text-center text-2xl font-bold text-red-800')}>
      Oops! Something went wrong.
    </h2>
    <p className={cn('mb-4 text-lg text-slate-700')}>{message}</p>
    <p className={cn('text-slate-500')}>
      Sorry about this and thanks for your patience!
    </p>
  </div>
);

const SkeletonBlock = () => (
  <div
    className={cn(
      'fade-in-30 border-2 border-black bg-white p-4 shadow-[4px_2px_0px_rgba(0,0,0,1)] transition-all duration-300'
    )}
  >
    <div role='status' className={cn('animate-pulse')}>
      <div className={cn('mb-4 h-32 w-full max-w-none bg-orange-200')}></div>
      <div className={cn('mb-2 h-4 max-w-[330px] bg-slate-600')}></div>
      <div className={cn('mb-2 h-4 max-w-[300px] bg-slate-500')}></div>
      <div className={cn('mb-4 h-4 max-w-[360px] bg-slate-500')}></div>
      <div className={cn('mb-2 h-4 max-w-[300px] bg-slate-500')}></div>
      <div className={cn('mb-4 h-4 max-w-[360px] bg-slate-500')}></div>
      <div className={cn('h-3 w-48 bg-slate-400')}></div>
      <span className={cn('sr-only')}>Loading...</span>
    </div>
  </div>
);

export const getStaticProps = (async () => {
  const data = await fetchPostsList(
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
    [key: string]: ResponseData | APIErrorResponse;
  };
}> = ({ fallback }) => {
  const [pageCursor, setPageCursor] = useState(SWR_Cursor_for_firstPage);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, error, isValidating } = useSWR<ResponseData | APIErrorResponse>(
    [`${SWR_Key_Prefix}//${pageCursor}`, pageCursor],
    ([, cursor]) =>
      fetchPostsList(`${SWR_Key_Prefix}//${cursor}`, cursor as string),
    {
      fallback,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false
    }
  );

  const { pageInfo = { endCursor: '', hasNextPage: false } } = (
    data && 'posts' in data
      ? data
      : { posts: [], pageInfo: { endCursor: '', hasNextPage: false } }
  ) as ResponseData;
  const { endCursor, hasNextPage } = pageInfo;

  const loadMoreArticles = useCallback(() => {
    if (!hasNextPage || isValidating || isLoadingMore) return;
    setIsLoadingMore(true);
    setPageCursor(endCursor);
  }, [hasNextPage, isValidating, isLoadingMore, endCursor]);

  useEffect(() => {
    if (data && 'posts' in data && data.posts.length > 0) {
      setAllPosts((prevPosts) => {
        const uniquePosts = Array.from(new Set([...prevPosts, ...data.posts]));
        return uniquePosts;
      });
      setIsLoadingMore(false);
    }
  }, [data]);

  if (error) {
    console.error('Error: ', error);
    return (
      <PageWrapper>
        <ErrorBlock
          message={
            error instanceof Error
              ? error.message
              : 'An unknown error occurred.'
          }
        />
      </PageWrapper>
    );
  }

  if ('error' in (data || {})) {
    return (
      <PageWrapper>
        <ErrorBlock message={(data as APIErrorResponse).error.message} />
      </PageWrapper>
    );
  }

  const visiblePosts = allPosts.slice(0, allPosts.length);
  const shouldShowSkeletons = isLoadingMore || isValidating;
  const skeletonsToShow = shouldShowSkeletons ? POSTS_PER_PAGE : 0;

  return (
    <SWRConfig value={{ fallback }}>
      <PageWrapper>
        <div
          className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5')}
        >
          {visiblePosts.map((post: Post, index: number) =>
            post.title && post.slug ? (
              <BlogPostCard key={post.slug} post={post} index={index} />
            ) : null
          )}
          {Array.from({ length: skeletonsToShow }).map((_, index) => {
            const lgColSpan = [2, 3, 5][index % 3];
            return (
              <div
                key={`skeleton-${index}`}
                className={cn(`sm:col-span-2 lg:col-span-${lgColSpan}`)}
              >
                <SkeletonBlock />
              </div>
            );
          })}
        </div>
        <div className='flex justify-center py-8'>
          {(hasNextPage || isLoadingMore) && (
            <button
              onClick={loadMoreArticles}
              className='w-1/2 border-2 border-black bg-orange-200 p-2 text-lg font-medium text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none disabled:border-transparent disabled:bg-orange-100 disabled:text-gray-400 disabled:shadow-none'
              disabled={isValidating || isLoadingMore}
            >
              {isLoadingMore ? (
                <span>Loading...</span>
              ) : (
                <span>Load more articles</span>
              )}
            </button>
          )}
          {!hasNextPage && !isLoadingMore && allPosts.length > 0 && (
            <p className='text-center text-gray-600'>
              That&apos;s the end. No more articles.
            </p>
          )}
        </div>
      </PageWrapper>
    </SWRConfig>
  );
};

export default Blog;

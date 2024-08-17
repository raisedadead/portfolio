import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';
import Image from 'next/image';

import Layout from '@/components/layouts';
import { CustomLink as Link } from '@/components/custom-link';
import { postsFetcher, Post, ResponseData } from '@/lib/posts-fetcher';
import { MetaHead } from '@/components/head';
import { cn } from '@/lib/utils';

const SWR_Key_Prefix = '/api/posts';
const SWR_Cursor_for_firstPage = '';

const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <>
    <MetaHead pageTitle='Recent posts' />
    <Layout variant='main'>
      <section>
        <div className={cn('prose prose-sm prose-slate max-w-none')}>
          <h1 className={cn('py-2 text-center font-bold text-slate-700')}>
            My Musings
          </h1>
        </div>
      </section>
      <section>
        <div className={cn('prose prose-sm prose-slate max-w-none')}>
          <p className={cn('text-center text-slate-600')}>
            Stuff that I write about, mostly tech, sometimes life.
          </p>
          {children}
        </div>
      </section>
    </Layout>
  </>
);

const ErrorBlock = () => (
  <li
    className={cn(
      'border-2 border-black bg-red-100 p-4 shadow-[4px_2px_0px_rgba(0,0,0,1)]'
    )}
  >
    <h3 className={cn('text-red-800')}>Oops! Something went wrong.</h3>
    <p className={cn('text-red-800')}>
      There seems to be an issue fetching articles right now. Please try
      visiting this page after a while. Additional details about this might
      logged in the developer console.
    </p>
    <p className={cn('text-red-800')}>
      Sorry about this and thanks for your patience!
    </p>
  </li>
);

const SkeletonBlock = () => (
  <li
    className={cn(
      'border-2 border-black bg-blue-100 p-4 shadow-[4px_2px_0px_rgba(0,0,0,1)]'
    )}
  >
    <div role='status' className={cn('max-w-sm animate-pulse')}>
      <div className={cn('mb-4 h-5 max-w-[360px] bg-blue-500')}></div>
      <div className={cn('mb-2 h-3 max-w-[330px] bg-slate-500')}></div>
      <div className={cn('mb-2 h-3 max-w-[300px] bg-slate-500')}></div>
      <div className={cn('mb-4 h-3 max-w-[360px] bg-slate-500')}></div>
      <div className={cn('h-3 w-48 bg-slate-400')}></div>
      <span className={cn('sr-only')}>Loading...</span>
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
        <ul role='list' className={cn('list-none p-0')}>
          <ErrorBlock />
        </ul>
      </PageWrapper>
    );
  }

  if (allPosts.length === 0) {
    return (
      <PageWrapper>
        <ul role='list' className={cn('list-none p-0')}>
          <SkeletonBlock />
        </ul>
      </PageWrapper>
    );
  }

  const getConsistentSpan = (index: number) => {
    switch (index % 5) {
      case 0:
        return 'sm:col-span-2 lg:col-span-3';
      case 1:
        return 'sm:col-span-1 lg:col-span-1';
      case 2:
      case 3:
        return 'sm:col-span-2 lg:col-span-2';
      case 4:
      default:
        return 'sm:col-span-1 lg:col-span-1';
    }
  };

  return (
    <SWRConfig value={{ fallback }}>
      <PageWrapper>
        <div
          className={cn(
            'grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {allPosts.map((post: Post, index: number) =>
            post.title && post.slug ? (
              <Link
                href={`https://hn.mrugesh.dev/${post.slug}?source=website`}
                key={post.slug}
                className={cn(
                  'group flex flex-col overflow-hidden border-2 border-black bg-white no-underline shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]',
                  getConsistentSpan(index)
                )}
              >
                <div
                  className={cn(
                    'relative',
                    index % 5 === 0 ? 'h-64 lg:h-96' : 'h-48 sm:h-56 lg:h-64',
                    'w-full overflow-hidden'
                  )}
                >
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage.url}
                      alt={post.title}
                      fill
                      placeholder='blur'
                      blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8d33VGQAIpwNNk7v4uAAAAABJRU5ErkJggg=='
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      className={cn(
                        'object-cover px-4 py-2 transition-transform duration-200 group-hover:scale-95'
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        'flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4 py-2'
                      )}
                    >
                      <span className={cn('text-4xl')}>📝</span>
                    </div>
                  )}
                </div>
                <div className={cn('flex flex-grow flex-col p-4')}>
                  <h2
                    className={cn(
                      'font-sans font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-600',
                      index % 5 === 0 ? 'text-2xl lg:text-3xl' : 'text-lg'
                    )}
                  >
                    {post.title}
                  </h2>
                  <p
                    className={cn('mt-2 line-clamp-2 flex-grow text-slate-600')}
                  >
                    {post.brief}
                  </p>
                  <div
                    className={cn(
                      'mt-4 flex flex-wrap items-center text-sm text-slate-500'
                    )}
                  >
                    <span>{new Date(post.publishedAt).toDateString()}</span>
                    {post.readTimeInMinutes && (
                      <>
                        <span className={cn('mx-2')}>•</span>
                        <span>{post.readTimeInMinutes} min read</span>
                      </>
                    )}
                    {post.reactionCount > 0 && (
                      <>
                        <span className={cn('mx-2')}>•</span>
                        <span>{post.reactionCount} reactions</span>
                      </>
                    )}
                    {post.replyCount > 0 && (
                      <>
                        <span className={cn('mx-2')}>•</span>
                        <span>{post.replyCount} comments</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ) : null
          )}
          {isValidating && (
            <div className={cn('sm:col-span-2 lg:col-span-3')}>
              <SkeletonBlock />
            </div>
          )}
        </div>
        <div className={cn('flex justify-center py-5')}>
          <button
            onClick={loadMoreArticles}
            className={cn(
              'w-[50%] items-center border-2 border-black bg-orange-200 p-1.5 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none disabled:border-transparent disabled:bg-orange-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-orange-100 disabled:hover:text-gray-400 disabled:hover:shadow-none disabled:active:bg-orange-100 disabled:active:shadow-none'
            )}
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

import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

import Layout from '@/components/layouts';
import { CustomLink as Link } from '@/components/custom-link';
import { postsFetcher, Post, ResponseData } from '@/lib/posts-fetcher';
import { MetaHead } from '@/components/head';
import { cn } from '@/lib/utils';
import ShimmerImage from '@/components/shimmer-image';
import { Social } from '@/components/social';

const SWR_Key_Prefix = '/api/posts';
const SWR_Cursor_for_firstPage = '';

const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <>
    <MetaHead pageTitle='Recent posts' />
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

const BlogPostCard: React.FC<{ post: Post; index: number }> = ({
  post,
  index
}) => {
  const getConsistentSpan = (index: number) => {
    switch (index % 6) {
      case 0:
        return 'sm:col-span-2 lg:col-span-3';
      case 1:
        return 'sm:col-span-2 lg:col-span-2';
      case 2:
        return 'sm:col-span-2 lg:col-span-5';
      case 3:
        return 'sm:col-span-1 lg:col-span-2';
      case 4:
        return 'sm:col-span-2 lg:col-span-3';
      case 5:
      default:
        return 'sm:col-span-1 lg:col-span-5';
    }
  };

  const getAspectRatio = (index: number) => {
    switch (index % 3) {
      case 0:
        return 'aspect-[16/9]';
      case 1:
        return 'aspect-[4/3]';
      case 2:
        return 'aspect-[21/9]';
      case 3:
        return 'aspect-square';
      case 4:
        return 'aspect-[3/4]';
      case 5:
      default:
        return 'aspect-[4/3]';
    }
  };

  const getImageHeight = (index: number) => {
    switch (index % 6) {
      case 0:
      case 2:
        return 'h-64';
      case 1:
      case 4:
        return 'h-48';
      case 3:
      case 5:
      default:
        return 'h-40';
    }
  };

  return (
    <Link
      href={`https://hn.mrugesh.dev/${post.slug}?source=website`}
      className={cn(
        'group flex flex-col overflow-hidden p-4',
        'border-2 border-black bg-white',
        'no-underline shadow-[4px_4px_0px_rgba(0,0,0,1)]',
        'hover:bg-gray-700',
        'transition-all duration-300 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]',
        getConsistentSpan(index)
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden',
          getAspectRatio(index),
          getImageHeight(index)
        )}
      >
        {post.coverImage ? (
          <ShimmerImage
            src={post.coverImage.url}
            alt={post.title}
            fill
            className={cn('object-cover')}
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100'
            )}
          >
            <span className={cn('text-6xl')}>📝</span>
          </div>
        )}
      </div>
      <div className={cn('flex flex-grow flex-col')}>
        <h2
          className={cn(
            'my-4 font-sans text-2xl font-bold text-slate-900 transition-colors group-hover:text-white'
          )}
        >
          {post.title}
        </h2>
        <p
          className={cn(
            'mb-4 flex-grow text-lg text-slate-600 transition-colors group-hover:text-gray-200'
          )}
        >
          {post.brief}
        </p>
        <div
          className={cn(
            'flex flex-wrap items-center text-base text-slate-500 transition-colors group-hover:text-gray-300'
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
  );
};

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

  return (
    <SWRConfig value={{ fallback }}>
      <PageWrapper>
        <div
          className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5')}
        >
          {allPosts.map((post: Post, index: number) =>
            post.title && post.slug ? (
              <BlogPostCard key={post.slug} post={post} index={index} />
            ) : null
          )}
          {isValidating && (
            <div className={cn('sm:col-span-2 lg:col-span-3')}>
              <SkeletonBlock />
            </div>
          )}
        </div>
        <div className={cn('flex justify-center py-8')}>
          <button
            onClick={loadMoreArticles}
            className={cn(
              'w-[50%] items-center border-2 border-black bg-orange-200 p-2 text-lg font-medium text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none disabled:border-transparent disabled:bg-orange-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-orange-100 disabled:hover:text-gray-400 disabled:hover:shadow-none disabled:active:bg-orange-100 disabled:active:shadow-none'
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

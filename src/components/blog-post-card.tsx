import React from 'react';
import { CustomLink as Link } from './custom-link';
import ShimmerImage from './shimmer-image';
import { cn } from '@/lib/utils';
import { Post } from '@/lib/posts-fetcher';

const getConsistentSpan = (index: number) => {
  const spans = [
    'sm:col-span-2 lg:col-span-3',
    'sm:col-span-2 lg:col-span-2',
    'sm:col-span-2 lg:col-span-5',
    'sm:col-span-2 lg:col-span-2',
    'sm:col-span-2 lg:col-span-3',
    'sm:col-span-2 lg:col-span-5'
  ];
  return spans[index % 6];
};

const getAspectRatio = (index: number) => {
  const ratios = [
    'aspect-[16/9]',
    'aspect-[4/3]',
    'aspect-[21/9]',
    'aspect-square',
    'aspect-[3/4]',
    'aspect-[4/3]'
  ];
  return ratios[index % 6];
};

const getImageHeight = (index: number) => {
  const heights = ['h-64', 'h-48', 'h-64', 'h-48', 'h-48', 'h-40'];
  return heights[index % 6];
};

export const BlogPostCard: React.FC<{ post: Post; index: number }> = ({
  post,
  index
}) => {
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
            'mb-4 flex-grow text-slate-600 transition-colors group-hover:text-gray-200'
          )}
        >
          {post.brief}
        </p>
        <div
          className={cn(
            'flex flex-wrap items-center text-sm text-slate-500 transition-colors group-hover:text-gray-300'
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
          {post.views > 100 && (
            <>
              <span className={cn('mx-2')}>•</span>
              <span>{post.views} views</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;

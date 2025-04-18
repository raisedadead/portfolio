import React, { useState } from 'react';
import Image from 'next/image';
import { CustomLink as Link } from './custom-link';
import { cn } from '@/lib/utils';
import { Post } from '@/lib/posts-fetcher';
import { motion } from 'framer-motion';

const getGridSpan = (index: number) => {
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

const getImageProperties = (
  index: number
): { aspect: string; height: string } => {
  const properties = [
    { aspect: 'aspect-16/9', height: 'h-64' },
    { aspect: 'aspect-4/3', height: 'h-48' },
    { aspect: 'aspect-21/9', height: 'h-56' },
    { aspect: 'aspect-3/2', height: 'h-48' },
    { aspect: 'aspect-3/4', height: 'h-64' },
    { aspect: 'aspect-2/1', height: 'h-40' }
  ];
  return properties[index % 6] || { aspect: 'aspect-16/9', height: 'h-64' };
};

const ShimmerEffect = () => (
  <motion.div
    className={cn('absolute inset-0 bg-orange-100')}
    animate={{ opacity: [0.3, 0.7, 0.3] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
  />
);

export const BlogPostCard: React.FC<{ post: Post; index: number }> = ({
  post,
  index
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { aspect, height } = getImageProperties(index);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex flex-col overflow-hidden p-4',
        'bg-white dark:bg-gray-800',
        'no-underline shadow-[6px_6px_0px_var(--color-black)]',
        'hover:bg-orange-100 dark:hover:bg-orange-900',
        'transition-all duration-100 hover:shadow-[8px_8px_0px_var(--color-black)]',
        getGridSpan(index)
      )}
    >
      <div className={cn('relative w-full overflow-hidden', aspect, height)}>
        {post.coverImage ? (
          <>
            {isLoading && <ShimmerEffect />}
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              priority={index < 3}
              className={cn(
                'object-cover',
                'transition-opacity duration-500 ease-in-out',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              onLoad={() => setIsLoading(false)}
            />
          </>
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center bg-linear-to-br from-blue-100 to-orange-100'
            )}
          >
            <span className={cn('text-6xl')}>📝</span>
          </div>
        )}
      </div>
      <div className={cn('flex grow flex-col')}>
        <h2
          className={cn(
            'my-4 font-sans text-2xl font-bold text-slate-900 dark:text-orange-100',
            'transition-colors group-hover:text-orange-800 dark:group-hover:text-orange-200'
          )}
        >
          {post.title}
        </h2>
        <p
          className={cn(
            'mb-4 grow text-slate-600 dark:text-slate-300',
            'transition-colors group-hover:text-slate-700 dark:group-hover:text-orange-100'
          )}
        >
          {post.brief}
        </p>
        <div
          className={cn(
            'flex flex-wrap items-center text-sm text-slate-500 dark:text-slate-400',
            'transition-colors group-hover:text-slate-600 dark:group-hover:text-orange-200'
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

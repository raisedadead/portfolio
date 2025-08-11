import React from 'react';
import { cn } from '@/lib/utils';
import type { TransformedBlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: TransformedBlogPost;
  index: number;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, index }) => {
  // Use explicit class mapping to ensure Tailwind can detect all classes
  const lgColSpanClass =
    {
      0: 'lg:col-span-2',
      1: 'lg:col-span-3',
      2: 'lg:col-span-5'
    }[index % 3] || 'lg:col-span-2';

  return (
    <a
      href={`/blog/${post.slug}`}
      className={cn(
        'group block',
        'border-2 border-black bg-white p-4',
        'shadow-[4px_4px_0px_rgba(0,0,0,1)]',
        'transition-all duration-100',
        'hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]',
        'hover:-translate-x-[2px] hover:-translate-y-[2px]',
        'dark:border-white dark:bg-gray-800',
        'dark:shadow-[4px_4px_0px_rgba(255,255,255,1)]',
        'dark:hover:shadow-[6px_6px_0px_rgba(255,255,255,1)]',
        'sm:col-span-2',
        lgColSpanClass
      )}
    >
      {post.coverImage?.url && (
        <div className='mb-4 aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700'>
          <img
            src={post.coverImage.url}
            alt={post.title}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            loading='lazy'
          />
        </div>
      )}

      <h2 className='mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400'>
        {post.title}
      </h2>

      <p className='mb-4 line-clamp-3 text-sm text-gray-700 dark:text-gray-300'>{post.brief}</p>

      <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        <span>{post.readTimeInMinutes} min read</span>
      </div>
    </a>
  );
};

export default BlogPostCard;

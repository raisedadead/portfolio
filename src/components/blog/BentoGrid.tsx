import { useState } from 'react';
import type { BlogPost } from '@/types/blog';
import { getBentoGridSpan } from '@/lib/blog-utils';
import LoadMoreButton from './LoadMoreButton';

interface Props {
  posts: BlogPost[];
  initialCount?: number;
  postsPerLoad?: number;
}

export default function BlogGridWithLoadMore({ posts, initialCount = 6, postsPerLoad = 3 }: Props) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const visiblePosts = posts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoading(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + postsPerLoad, posts.length));
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      {/* Bento Grid */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5'>
        {visiblePosts.map((post, index) => {
          const spanConfig = getBentoGridSpan(index);

          return (
            <article
              key={post.id}
              data-blog-post-id={post.id}
              className={`${spanConfig.desktop} group flex flex-col overflow-hidden bg-white p-4 no-underline shadow-[6px_6px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-100 hover:shadow-[8px_8px_0px_var(--color-black)] sm:col-span-2 dark:bg-gray-800 dark:hover:bg-orange-900`}
            >
              <a href={`/blog/${post.data.slug}`} className='block no-underline'>
                {/* Cover Image */}
                {post.data.coverImage?.url ? (
                  <div className={`relative w-full overflow-hidden ${spanConfig.aspect} ${spanConfig.height}`}>
                    <div className='absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700' />
                    <img
                      src={post.data.coverImage.url}
                      alt={post.data.coverImage.alt || post.data.title}
                      className='h-full w-full object-cover transition-all duration-500 group-hover:scale-105'
                      style={{ opacity: 0, animation: 'fadeIn 0.5s ease-in forwards' }}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : undefined}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ${spanConfig.aspect} ${spanConfig.height}`}
                  >
                    <span className='text-6xl'>📝</span>
                  </div>
                )}

                {/* Card Content */}
                <div className='flex grow flex-col'>
                  <h2 className='my-4 font-sans text-2xl font-bold text-slate-900 transition-colors group-hover:text-orange-800 dark:text-orange-100 dark:group-hover:text-orange-200'>
                    {post.data.title}
                  </h2>

                  <p className='mb-4 grow text-slate-600 transition-colors group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-orange-100'>
                    {post.data.brief}
                  </p>

                  <div className='flex flex-wrap items-center text-sm text-slate-500 transition-colors group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-orange-200'>
                    <span>{new Date(post.data.publishedAt).toDateString()}</span>
                    {post.data.readingTime && (
                      <>
                        <span className='mx-2'>•</span>
                        <span>{post.data.readingTime} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>

      {/* Load More Button */}
      <LoadMoreButton
        totalPosts={posts.length}
        visiblePosts={visibleCount}
        onLoadMore={handleLoadMore}
        postsPerLoad={postsPerLoad}
        isLoading={isLoading}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

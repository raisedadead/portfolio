import { useState, useEffect } from 'react';
import type { LightweightPost } from '@/types/blog';
import { getBentoGridSpan } from '@/lib/blog-utils';
import { transformImageUrl } from '@/lib/image-optimizer';
import { calculateImageDimensions } from '@/lib/image-dimensions';
import LoadMoreButton from './LoadMoreButton';

interface Props {
  posts: LightweightPost[];
  initialCount?: number;
  postsPerLoad?: number;
}

export default function BlogGridWithLoadMore({ posts, initialCount = 6, postsPerLoad = 3 }: Props) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const visiblePosts = posts.slice(0, visibleCount);

  // Pre-load images for the next batch of posts
  useEffect(() => {
    // Only pre-load if there are more posts to load
    if (visibleCount >= posts.length) return;

    const nextBatchStart = visibleCount;
    const nextBatchEnd = Math.min(visibleCount + postsPerLoad, posts.length);
    const nextPosts = posts.slice(nextBatchStart, nextBatchEnd);
    const createdLinks: HTMLLinkElement[] = [];

    nextPosts.forEach((post, index) => {
      if (post.data.coverImage?.url) {
        const spanConfig = getBentoGridSpan(nextBatchStart + index);
        const dimensions = calculateImageDimensions(spanConfig.aspectRatio, nextBatchStart + index);
        const optimizedUrl = transformImageUrl(post.data.coverImage.url, dimensions);

        // Pre-load the image (only if optimizedUrl is valid)
        if (optimizedUrl) {
          // Check if link already exists to prevent duplicates
          const existingLink = document.querySelector(`link[rel="prefetch"][href="${optimizedUrl}"]`);
          if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = optimizedUrl;
            document.head.appendChild(link);
            createdLinks.push(link);
          }
        }
      }
    });

    // Cleanup function to remove created links when component unmounts
    return () => {
      createdLinks.forEach((link) => link.remove());
    };
  }, [visibleCount, posts, postsPerLoad]);

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
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {visiblePosts.map((post, index) => {
          const spanConfig = getBentoGridSpan(index);
          const dimensions = calculateImageDimensions(spanConfig.aspectRatio, index);
          const optimizedUrl = post.data.coverImage?.url
            ? transformImageUrl(post.data.coverImage.url, dimensions)
            : null;

          const isExternal = post.data.source === 'freecodecamp' && post.data.externalUrl;
          const postUrl = isExternal ? post.data.externalUrl : `/blog/${post.data.slug}`;
          const linkProps = isExternal
            ? { target: '_blank' as const, rel: 'noopener noreferrer' }
            : { 'data-astro-prefetch': 'hover' as const };

          return (
            <article
              key={post.id}
              data-blog-post-id={post.id}
              className={`${spanConfig.desktop} group flex flex-col overflow-hidden border-2 border-black bg-white p-4 no-underline shadow-[4px_4px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-100 hover:shadow-[6px_6px_0px_var(--color-black)] focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none sm:col-span-2`}
            >
              <a href={postUrl} className='block no-underline' {...linkProps}>
                {/* Cover Image */}
                {optimizedUrl ? (
                  <div className={`relative w-full overflow-hidden ${spanConfig.aspectClass} ${spanConfig.height}`}>
                    <div className='absolute inset-0 animate-pulse bg-gray-200' />
                    <img
                      src={optimizedUrl}
                      alt={post.data.coverImage?.alt || post.data.title}
                      width={dimensions.mobile.width}
                      height={dimensions.mobile.height}
                      className='h-full w-full object-cover transition-all duration-500 group-hover:scale-105'
                      style={{ opacity: 0, animation: 'fadeIn 0.5s ease-in forwards' }}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : undefined}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ${spanConfig.aspectClass} ${spanConfig.height}`}
                  >
                    <span className='text-6xl'>📝</span>
                  </div>
                )}

                {/* Card Content */}
                <div className='flex grow flex-col'>
                  <div className='my-4 flex items-start justify-between gap-2'>
                    <h2 className='text-2xl font-bold text-slate-900 transition-colors group-hover:text-orange-800'>
                      {post.data.title}
                    </h2>
                    {isExternal && (
                      <span className='flex-shrink-0 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'>
                        freeCodeCamp
                      </span>
                    )}
                  </div>

                  <p className='mb-4 grow text-slate-600 transition-colors group-hover:text-slate-700'>
                    {post.data.brief}
                  </p>

                  <div className='flex flex-wrap items-center text-sm text-slate-500 transition-colors group-hover:text-slate-600'>
                    <span>{new Date(post.data.publishedAt).toDateString()}</span>
                    {post.data.readingTime && (
                      <>
                        <span className='mx-2'>•</span>
                        <span>{post.data.readingTime} min read</span>
                      </>
                    )}
                    {isExternal && (
                      <>
                        <span className='mx-2'>•</span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='inline h-3.5 w-3.5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
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

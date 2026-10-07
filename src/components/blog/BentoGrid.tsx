import { useState, useEffect, useMemo } from 'react';
import * as Sentry from '@sentry/astro';
import type { LightweightPost } from '@/types/blog';
import { filterPostsByTag, getBentoGridSpan, getSharedTags, getTagsWithCount } from '@/lib/blog-utils';
import { formatDate } from '@/lib/formatDate';
import LoadMoreButton from './LoadMoreButton';
import TagFilter from './TagFilter';

interface Props {
  posts: LightweightPost[];
  initialCount?: number;
  postsPerLoad?: number;
}

export default function BlogGridWithLoadMore({ posts, initialCount = 6, postsPerLoad = 6 }: Props) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const sharedTags = useMemo(() => getSharedTags(posts), [posts]);
  const tagTotal = useMemo(() => getTagsWithCount(posts).length, [posts]);
  const listedPosts = useMemo(() => (activeTag ? filterPostsByTag(posts, activeTag) : posts), [posts, activeTag]);
  const visiblePosts = listedPosts.slice(0, visibleCount);
  const scope = activeTag ? ` tagged #${activeTag}` : '';

  // Pre-load images for the next batch of posts
  useEffect(() => {
    // Only pre-load if there are more posts to load
    if (visibleCount >= listedPosts.length) return;

    const nextBatchStart = visibleCount;
    const nextBatchEnd = Math.min(visibleCount + postsPerLoad, listedPosts.length);
    const nextPosts = listedPosts.slice(nextBatchStart, nextBatchEnd);
    const createdLinks: HTMLLinkElement[] = [];

    for (const post of nextPosts) {
      const coverUrl = post.data.coverImage?.url;
      if (!coverUrl) continue;
      const existingLink = document.querySelector(`link[rel="prefetch"][href="${coverUrl}"]`);
      if (existingLink) continue;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = coverUrl;
      document.head.appendChild(link);
      createdLinks.push(link);
    }

    // Cleanup function to remove created links when component unmounts
    return () => {
      createdLinks.forEach((link) => link.remove());
    };
  }, [visibleCount, listedPosts, postsPerLoad]);

  const handleLoadMore = () => {
    Sentry.metrics.count('blog.load_more', 1, {
      attributes: { visible: String(visibleCount), total: String(listedPosts.length) }
    });

    setVisibleCount((prev) => Math.min(prev + postsPerLoad, listedPosts.length));
  };

  const handleTagToggle = (slug: string) => {
    setActiveTag((current) => (current === slug ? null : slug));
    setVisibleCount(initialCount);
  };

  return (
    <>
      <TagFilter tags={sharedTags} tagTotal={tagTotal} activeTag={activeTag} onToggle={handleTagToggle} />
      <p className='sr-only' role='status'>
        {`${listedPosts.length} ${listedPosts.length === 1 ? 'post' : 'posts'}${scope}`}
      </p>

      {/* Bento Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {visiblePosts.map((post, index) => {
          const spanConfig = getBentoGridSpan(index);
          const coverUrl = post.data.coverImage?.url;

          const isExternal = post.data.source === 'freecodecamp' && post.data.externalUrl;
          const postUrl = isExternal ? post.data.externalUrl : `/blog/${post.data.slug}`;
          const linkProps = isExternal
            ? { target: '_blank' as const, rel: 'noopener noreferrer' }
            : { 'data-astro-prefetch': 'hover' as const };
          const isInitial = index < initialCount;
          const entrance = {
            className: isInitial ? 'card-in' : 'card-in-late',
            delay: `${(isInitial ? index : (index - initialCount) % postsPerLoad) * 60}ms`
          };

          return (
            <article
              key={post.id}
              data-blog-post-id={post.id}
              data-post-slug={isExternal ? undefined : post.data.slug}
              suppressHydrationWarning
              style={{ '--card-delay': entrance.delay } as React.CSSProperties}
              className={`${entrance.className} ${spanConfig.desktop} group flex flex-col overflow-hidden border-2 border-black bg-white p-4 no-underline shadow-brutal-md transition-all duration-100 hover:bg-orange-100 hover:shadow-brutal-lg brutalist-focus sm:col-span-2`}
            >
              <a href={postUrl} className='block no-underline' {...linkProps}>
                {/* Cover Image */}
                {coverUrl ? (
                  <div className={`relative w-full overflow-hidden ${spanConfig.height}`} data-post-cover>
                    <div className='absolute inset-0 animate-pulse bg-gray-200' />
                    <img
                      src={coverUrl}
                      alt={post.data.coverImage?.alt || post.data.title}
                      width={post.data.coverImage?.width}
                      height={post.data.coverImage?.height}
                      className='relative h-full w-full animate-fade-in object-cover transition-all duration-500 group-hover:scale-105'
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : undefined}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex items-center justify-center bg-linear-to-br/oklch from-blue-500 via-purple-500 to-pink-500 ${spanConfig.height}`}
                    data-post-cover
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
                    <span>{formatDate(new Date(post.data.publishedAt))}</span>
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
        totalPosts={listedPosts.length}
        visiblePosts={visiblePosts.length}
        postsPerLoad={postsPerLoad}
        scope={scope}
        onLoadMore={handleLoadMore}
      />
    </>
  );
}

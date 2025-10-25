import { cn } from '@/lib/utils';

interface BlogLoadMoreProps {
  totalPosts: number;
  visiblePosts: number;
  onLoadMore: () => void;
  postsPerLoad?: number;
  isLoading?: boolean;
}

export default function BlogLoadMore({ totalPosts, visiblePosts, onLoadMore, isLoading = false }: BlogLoadMoreProps) {
  const hasMore = visiblePosts < totalPosts;

  if (!hasMore && !isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <p className='text-center text-gray-600'>That&apos;s the end. No more articles.</p>
      </div>
    );
  }

  return (
    <div className='flex justify-center py-8'>
      <button
        type='button'
        onClick={onLoadMore}
        disabled={isLoading}
        aria-label='Load more blog posts'
        aria-busy={isLoading}
        className={cn(
          'brutalist-button-secondary inline-flex h-14 min-w-[280px] items-center justify-center gap-2 px-6 py-3 text-lg font-bold',
          isLoading && 'cursor-wait'
        )}
      >
        {isLoading ? (
          <>
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>Load more articles</span>
            <span aria-hidden='true'>↓</span>
          </>
        )}
      </button>
    </div>
  );
}

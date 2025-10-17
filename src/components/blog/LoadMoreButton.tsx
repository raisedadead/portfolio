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
          'inline-flex items-center justify-center gap-2',
          'border-2 border-black bg-white',
          'px-8 py-3 font-bold text-black',
          'shadow-[4px_4px_0px_var(--color-black)]',
          'transition-all duration-100',
          'hover:bg-orange-100 hover:shadow-[6px_6px_0px_var(--color-black)]',
          'focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none',
          'active:bg-black active:text-white active:shadow-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'disabled:hover:bg-white disabled:hover:shadow-[4px_4px_0px_var(--color-black)]',
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

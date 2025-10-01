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
        <p className='text-center text-gray-600 dark:text-gray-400'>That&apos;s the end. No more articles.</p>
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
          'w-full sm:w-1/2',
          'border-2 p-2 text-lg font-medium',
          'shadow-[4px_4px_0px_rgba(0,0,0,1)]',
          'transition-all duration-100',
          isLoading
            ? 'cursor-not-allowed border-transparent bg-orange-100 text-gray-400 shadow-none'
            : 'border-black bg-orange-200 text-black hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none'
        )}
      >
        {isLoading ? 'Loading...' : 'Load more articles'}
      </button>
    </div>
  );
}

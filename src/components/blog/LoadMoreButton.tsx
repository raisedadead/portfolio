interface BlogLoadMoreProps {
  totalPosts: number;
  visiblePosts: number;
  onLoadMore: () => void;
}

export default function BlogLoadMore({ totalPosts, visiblePosts, onLoadMore }: BlogLoadMoreProps) {
  return (
    <div className='flex justify-center py-8'>
      {visiblePosts < totalPosts ? (
        <button
          type='button'
          onClick={onLoadMore}
          aria-label='Load more blog posts'
          className='brutalist-button-secondary inline-flex h-14 w-full items-center justify-center gap-2 px-6 py-3 text-lg font-bold sm:w-auto sm:min-w-[280px]'
        >
          <span>Load more articles</span>
          <span aria-hidden='true'>↓</span>
        </button>
      ) : (
        <p className='text-center text-gray-600'>That&apos;s the end. No more articles.</p>
      )}
    </div>
  );
}

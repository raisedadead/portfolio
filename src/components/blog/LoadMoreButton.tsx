import { useEffect, useRef } from 'react';

interface BlogLoadMoreProps {
  totalPosts: number;
  visiblePosts: number;
  postsPerLoad: number;
  scope: string;
  onLoadMore: () => void;
}

export default function BlogLoadMore({ totalPosts, visiblePosts, postsPerLoad, scope, onLoadMore }: BlogLoadMoreProps) {
  const noun = totalPosts === 1 ? 'post' : 'posts';
  const hasMore = visiblePosts < totalPosts;
  const loadedRef = useRef(false);
  const endRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!loadedRef.current) return;
    loadedRef.current = false;
    if (!hasMore) endRef.current?.focus();
  }, [visiblePosts, totalPosts, hasMore]);

  const handleLoadMore = () => {
    loadedRef.current = true;
    onLoadMore();
  };

  return (
    <div className='flex flex-col items-center gap-3 py-8'>
      {hasMore ? (
        <>
          <p className='text-center text-slate-700'>
            Showing {visiblePosts} of {totalPosts}
            {scope}
          </p>
          <button
            type='button'
            onClick={handleLoadMore}
            className='brutalist-button-secondary inline-flex h-14 w-full items-center justify-center gap-2 px-6 py-3 text-lg font-bold sm:w-auto sm:min-w-[280px]'
          >
            <span>Load {Math.min(postsPerLoad, totalPosts - visiblePosts)} more</span>
            <span aria-hidden='true'>↓</span>
          </button>
        </>
      ) : (
        <p ref={endRef} tabIndex={-1} className='text-center text-slate-700 outline-none'>
          That&apos;s all {totalPosts} {noun}
          {scope}.
        </p>
      )}
    </div>
  );
}

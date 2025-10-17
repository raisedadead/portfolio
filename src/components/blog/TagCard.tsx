import React from 'react';
import { cn } from '@/lib/utils';

interface TagCardProps {
  name: string;
  slug: string;
  count: number;
}

const TagCard: React.FC<TagCardProps> = ({ name, slug, count }) => {
  return (
    <a
      href={`/blog/tags/${slug}`}
      className={cn(
        'group block border-2 border-black bg-white p-6 no-underline shadow-[4px_4px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-100 hover:shadow-[6px_6px_0px_var(--color-black)] focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none active:bg-black active:text-white active:shadow-none'
      )}
      aria-label={`View ${count} ${count === 1 ? 'post' : 'posts'} tagged with ${name}`}
    >
      <div className={cn('flex items-center justify-between')}>
        <h2 className={cn('text-xl font-bold text-slate-800 group-hover:text-orange-800')}>{slug.toLowerCase()}</h2>
        <span
          className={cn('rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700')}
          aria-label={`${count} ${count === 1 ? 'post' : 'posts'}`}
        >
          {count}
        </span>
      </div>
      <p className={cn('mt-2 text-sm text-slate-600')}>
        {count} {count === 1 ? 'post' : 'posts'}
      </p>
    </a>
  );
};

export default TagCard;

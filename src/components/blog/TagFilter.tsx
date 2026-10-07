import { useLayoutEffect, useRef, useState } from 'react';
import type { TagWithCount } from '@/lib/blog-utils';

interface Props {
  tags: TagWithCount[];
  tagTotal: number;
  activeTag: string | null;
  onToggle: (slug: string) => void;
}

export default function TagFilter({ tags, tagTotal, activeTag, onToggle }: Props) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [firstRowCount, setFirstRowCount] = useState(tags.length);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const measure = () => {
      const chips = [...group.children] as HTMLElement[];
      const firstTop = chips[0]?.offsetTop ?? 0;
      setFirstRowCount(chips.filter((chip) => chip.offsetTop === firstTop).length);
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(group);
    return () => resizeObserver.disconnect();
  }, [tags]);

  if (tags.length === 0) return null;

  return (
    <section aria-label='Filter posts by topic' className='mb-6 flex items-center gap-3'>
      <span id='blog-topics-label' className='mb-1 hidden shrink-0 text-sm font-bold text-slate-700 sm:inline'>
        Topics
      </span>
      <div
        ref={groupRef}
        role='group'
        aria-labelledby='blog-topics-label'
        className='flex h-12 min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-12 overflow-hidden p-1.5'
      >
        {tags.map((tag, index) => (
          <button
            key={tag.slug}
            type='button'
            aria-pressed={activeTag === tag.slug}
            onClick={() => onToggle(tag.slug)}
            className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full whitespace-nowrap border-2 border-black bg-white px-3 py-1 text-xs font-semibold text-black shadow-brutal-sm transition-all duration-100 hover:bg-orange-100 hover:shadow-brutal-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 aria-pressed:translate-x-0.5 aria-pressed:translate-y-0.5 aria-pressed:bg-black aria-pressed:text-white aria-pressed:shadow-none sm:text-sm ${index < firstRowCount ? '' : 'invisible'}`}
          >
            {`#${tag.slug}`}
            <span className='font-normal opacity-70'>{tag.count}</span>
            {activeTag === tag.slug && <span aria-hidden='true'>×</span>}
          </button>
        ))}
      </div>
      <a
        href='/blog/tags'
        className='mb-1 shrink-0 border-b-2 border-slate-800 text-sm font-bold text-slate-800 no-underline hover:bg-orange-50'
      >
        All {tagTotal} tags <span aria-hidden='true'>→</span>
      </a>
    </section>
  );
}

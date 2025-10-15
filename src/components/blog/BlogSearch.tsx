import { useState, useMemo, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import type { BlogPost } from '@/types/blog';

interface Props {
  posts: BlogPost[];
}

export default function BlogSearch({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const lowerQuery = searchQuery.toLowerCase();

    return posts
      .filter((post) => {
        const titleMatch = post.data.title.toLowerCase().includes(lowerQuery);
        const briefMatch = post.data.brief.toLowerCase().includes(lowerQuery);
        const tagMatch = post.data.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery));

        return titleMatch || briefMatch || tagMatch;
      })
      .slice(0, 8); // Limit to 8 results
  }, [searchQuery, posts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredPosts.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredPosts.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          window.location.assign(`/blog/${filteredPosts[selectedIndex].data.slug}`);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleResultClick = (postSlug: string) => {
    window.location.assign(`/blog/${postSlug}`);
  };

  return (
    <div ref={searchRef} className='relative mb-12'>
      {/* Search Input */}
      <div className='relative'>
        <label htmlFor='blog-search-input' className='sr-only'>
          Search blog posts
        </label>
        <Input
          ref={inputRef}
          id='blog-search-input'
          type='search'
          placeholder='Search posts by title, content, or tags...'
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
          aria-label='Search blog posts by title, content, or tags'
          aria-autocomplete='list'
          aria-controls='search-results'
          className='w-full border-4 px-4 py-3 pl-12 text-gray-900 placeholder-gray-500 shadow-[6px_6px_0px_var(--color-black)] transition-all duration-100 hover:shadow-[8px_8px_0px_var(--color-black)] focus:shadow-[8px_8px_0px_var(--color-black)] dark:border-orange-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400'
        />
        <svg
          className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-600 dark:text-gray-300'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
      </div>

      {/* Dropdown Results */}
      {isOpen && searchQuery.trim() && (
        <div
          id='search-results'
          role='listbox'
          className='absolute z-50 mt-2 w-full border-4 border-black bg-white shadow-[6px_6px_0px_var(--color-black)] dark:border-orange-200 dark:bg-gray-800'
        >
          {filteredPosts.length > 0 ? (
            <ul className='max-h-96 overflow-y-auto'>
              {filteredPosts.map((post, index) => (
                <li
                  key={post.id}
                  role='option'
                  aria-selected={index === selectedIndex}
                  className={`cursor-pointer border-b-2 border-gray-200 p-4 transition-colors last:border-b-0 dark:border-gray-700 ${
                    index === selectedIndex
                      ? 'bg-orange-100 dark:bg-orange-900'
                      : 'hover:bg-orange-50 dark:hover:bg-orange-950'
                  }`}
                  onClick={() => handleResultClick(post.data.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleResultClick(post.data.slug);
                    }
                  }}
                >
                  <h3 className='mb-1 font-bold text-gray-900 dark:text-orange-100'>{post.data.title}</h3>
                  <p className='mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400'>{post.data.brief}</p>
                  <div className='flex flex-wrap gap-2'>
                    {post.data.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.slug}
                        className='rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='p-6 text-center text-gray-600 dark:text-gray-400'>No posts match your search</div>
          )}
        </div>
      )}
    </div>
  );
}

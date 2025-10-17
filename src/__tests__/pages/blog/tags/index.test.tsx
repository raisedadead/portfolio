import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BlogPost } from '@/types/blog';

vi.mock('@/components/blog/BlogSearch', () => ({
  default: ({ posts }: { posts: BlogPost[] }) => (
    <div data-testid='blog-search' data-posts-count={posts.length}>
      Search Component
    </div>
  )
}));

vi.mock('@/components/blog/BentoGrid', () => ({
  default: ({ posts }: { posts: BlogPost[] }) => (
    <div data-testid='bento-grid' data-posts-count={posts.length}>
      Bento Grid Component
    </div>
  )
}));

describe('Tags Index Page', () => {
  const mockPosts: BlogPost[] = [
    {
      id: 'post-1',
      data: {
        slug: 'first-blog-post',
        title: 'First Blog Post',
        brief: 'This is the first post',
        content: { html: '<p>Content 1</p>' },
        author: { name: 'Author 1' },
        tags: [
          { name: 'TypeScript', slug: 'typescript' },
          { name: 'Tutorial', slug: 'tutorial' }
        ],
        publishedAt: new Date('2025-03-01'),
        readingTime: 5
      }
    },
    {
      id: 'post-2',
      data: {
        slug: 'second-blog-post',
        title: 'Second Blog Post',
        brief: 'This is the second post',
        content: { html: '<p>Content 2</p>' },
        author: { name: 'Author 2' },
        tags: [
          { name: 'React', slug: 'react' },
          { name: 'Tutorial', slug: 'tutorial' }
        ],
        publishedAt: new Date('2025-02-15'),
        readingTime: 8
      }
    },
    {
      id: 'post-3',
      data: {
        slug: 'third-blog-post',
        title: 'Third Blog Post',
        brief: 'This is the third post',
        content: { html: '<p>Content 3</p>' },
        author: { name: 'Author 3' },
        tags: [
          { name: 'TypeScript', slug: 'typescript' },
          { name: 'Advanced', slug: 'advanced' }
        ],
        publishedAt: new Date('2025-01-20'),
        readingTime: 6
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTagsIndex = (posts: BlogPost[]) => {
    // Extract unique tags
    const tagMap = new Map();
    posts.forEach((post) => {
      post.data.tags.forEach((tag) => {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, tag);
        }
      });
    });
    const allTags = Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    return render(
      <div data-testid='tags-index-page'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <section className='mb-2'>
            <div className='prose prose-lg prose-slate max-w-none'>
              <h1 className='py-4 text-center text-3xl font-bold text-slate-800'>Blog Tags</h1>
            </div>
          </section>

          <section className='mb-12'>
            <p className='pb-6 text-center text-lg text-slate-600'>Browse posts by topic</p>

            {allTags.length === 0 ? (
              <div className='mx-auto max-w-md rounded-lg border-2 border-dashed border-slate-300 p-12 text-center'>
                <p className='text-lg text-slate-600'>No tags found yet. Check back soon!</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {allTags.map((tag) => {
                  const postCount = posts.filter((post) =>
                    post.data.tags.some((postTag) => postTag.slug === tag.slug)
                  ).length;

                  return (
                    <a
                      key={tag.slug}
                      href={`/blog/tags/${tag.slug}`}
                      className='group block border-2 border-black bg-white p-6 no-underline shadow-[4px_4px_0px_var(--color-black)] transition-all duration-100 hover:bg-orange-100 hover:shadow-[8px_8px_0px_var(--color-black)]'
                      data-testid={`tag-link-${tag.slug}`}
                    >
                      <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-bold text-slate-800 group-hover:text-orange-800'>{tag.name}</h2>
                        <span className='rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700'>
                          {postCount}
                        </span>
                      </div>
                      <p className='mt-2 text-sm text-slate-600'>
                        {postCount} {postCount === 1 ? 'post' : 'posts'}
                      </p>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  describe('Page Structure', () => {
    it('renders main heading', () => {
      renderTagsIndex(mockPosts);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Blog Tags');
      expect(heading).toHaveClass('text-3xl', 'font-bold');
    });

    it('renders page description', () => {
      renderTagsIndex(mockPosts);

      expect(screen.getByText('Browse posts by topic')).toBeInTheDocument();
    });

    it('has proper container structure', () => {
      const { container } = renderTagsIndex(mockPosts);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Tag Display', () => {
    it('displays all unique tags from posts', () => {
      renderTagsIndex(mockPosts);

      expect(screen.getByText('Advanced')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Tutorial')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('displays correct post count for each tag', () => {
      renderTagsIndex(mockPosts);

      // TypeScript appears in 2 posts
      const typescriptTag = screen.getByText('TypeScript').closest('a');
      const typescriptCount = typescriptTag?.querySelector('span');
      expect(typescriptCount).toHaveTextContent('2');

      // Tutorial appears in 2 posts
      const tutorialTag = screen.getByText('Tutorial').closest('a');
      const tutorialCount = tutorialTag?.querySelector('span');
      expect(tutorialCount).toHaveTextContent('2');

      // React appears in 1 post
      const reactTag = screen.getByText('React').closest('a');
      const reactCount = reactTag?.querySelector('span');
      expect(reactCount).toHaveTextContent('1');

      // Advanced appears in 1 post
      const advancedTag = screen.getByText('Advanced').closest('a');
      const advancedCount = advancedTag?.querySelector('span');
      expect(advancedCount).toHaveTextContent('1');
    });

    it('displays singular "post" for tags with one post', () => {
      renderTagsIndex(mockPosts);

      const reactTag = screen.getByText('React').closest('a');
      expect(reactTag).toHaveTextContent('1 post');
    });

    it('displays plural "posts" for tags with multiple posts', () => {
      renderTagsIndex(mockPosts);

      const typescriptTag = screen.getByText('TypeScript').closest('a');
      expect(typescriptTag).toHaveTextContent('2 posts');
    });

    it('sorts tags alphabetically', () => {
      renderTagsIndex(mockPosts);

      const tagLinks = screen.getAllByTestId(/^tag-link-/);
      const tagNames = tagLinks
        .map((link) => {
          const h2 = link.querySelector('h2');
          return h2?.textContent?.trim();
        })
        .filter(Boolean);

      expect(tagNames).toEqual(['Advanced', 'React', 'Tutorial', 'TypeScript']);
    });

    it('links to correct tag pages', () => {
      renderTagsIndex(mockPosts);

      const typescriptLink = screen.getByText('TypeScript').closest('a');
      expect(typescriptLink).toHaveAttribute('href', '/blog/tags/typescript');

      const reactLink = screen.getByText('React').closest('a');
      expect(reactLink).toHaveAttribute('href', '/blog/tags/react');
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no posts exist', () => {
      renderTagsIndex([]);

      expect(screen.getByText('No tags found yet. Check back soon!')).toBeInTheDocument();
    });

    it('does not show empty state when posts exist', () => {
      renderTagsIndex(mockPosts);

      expect(screen.queryByText('No tags found yet. Check back soon!')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('applies proper spacing classes', () => {
      renderTagsIndex(mockPosts);

      const headerSection = screen.getByRole('heading', { level: 1 }).parentElement?.parentElement;
      expect(headerSection).toHaveClass('mb-2');

      const description = screen.getByText('Browse posts by topic');
      const descriptionSection = description.parentElement;
      expect(descriptionSection).toHaveClass('mb-12');
    });

    it('applies responsive padding', () => {
      const { container } = renderTagsIndex(mockPosts);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toHaveClass('px-4', 'py-12', 'sm:px-6', 'lg:px-8');
    });

    it('applies grid layout for tags', () => {
      const { container } = renderTagsIndex(mockPosts);

      const grid = container.querySelector('[class*="grid-cols-1"]');
      expect(grid).toBeInTheDocument();
    });

    it('applies neobrutalism styles to tag cards', () => {
      renderTagsIndex(mockPosts);

      const tagLinks = screen.getAllByTestId(/^tag-link-/);
      tagLinks.forEach((link) => {
        expect(link).toHaveClass(
          'border-2',
          'border-black',
          'shadow-[4px_4px_0px_var(--color-black)]',
          'hover:shadow-[8px_8px_0px_var(--color-black)]'
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      renderTagsIndex(mockPosts);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('has proper heading hierarchy', () => {
      renderTagsIndex(mockPosts);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();

      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBe(4); // One for each tag
    });

    it('maintains consistent structure across states', () => {
      const { container: withPosts } = renderTagsIndex(mockPosts);
      const { container: withoutPosts } = renderTagsIndex([]);

      expect(withPosts.querySelector('.mx-auto.max-w-7xl')).toBeInTheDocument();
      expect(withoutPosts.querySelector('.mx-auto.max-w-7xl')).toBeInTheDocument();
    });

    it('provides descriptive link text', () => {
      renderTagsIndex(mockPosts);

      const typescriptLink = screen.getByText('TypeScript').closest('a');
      expect(typescriptLink).toBeInTheDocument();
    });
  });

  describe('Tag Deduplication', () => {
    it('removes duplicate tags across posts', () => {
      const postsWithDuplicateTags = [
        ...mockPosts,
        {
          ...mockPosts[0],
          id: 'post-4',
          data: {
            ...mockPosts[0].data,
            slug: 'fourth-post',
            tags: [{ name: 'TypeScript', slug: 'typescript' }] // Duplicate tag
          }
        }
      ];

      renderTagsIndex(postsWithDuplicateTags);

      const typescriptElements = screen.getAllByText('TypeScript');
      expect(typescriptElements).toHaveLength(1);
    });
  });
});

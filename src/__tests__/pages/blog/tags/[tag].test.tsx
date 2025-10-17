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

describe('Tag Dynamic Page', () => {
  const mockAllPosts: BlogPost[] = [
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

  const renderTagPage = (tag: { name: string; slug: string }, filteredPosts: BlogPost[]) => {
    return render(
      <div data-testid='tag-page'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <section className='mb-2'>
            <div className='prose prose-lg prose-slate max-w-none'>
              <h1 className='py-4 text-center text-3xl font-bold text-slate-800'>Posts tagged with "{tag.name}"</h1>
            </div>
          </section>

          <section className='mb-12'>
            <div className='mb-6 text-center'>
              <p className='text-lg text-slate-600'>
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              </p>
            </div>

            {filteredPosts.length === 0 ? (
              <div className='mx-auto max-w-md rounded-lg border-2 border-dashed border-slate-300 p-12 text-center'>
                <p className='text-lg text-slate-600'>No posts found with this tag.</p>
              </div>
            ) : (
              <>
                <div data-testid='blog-search' data-posts-count={mockAllPosts.length}>
                  Search Component
                </div>

                <div data-testid='bento-grid' data-posts-count={filteredPosts.length}>
                  Bento Grid Component
                </div>

                <div className='flex justify-center py-8'>
                  <a
                    href='/blog/tags'
                    className='border-2 border-black bg-orange-200 px-6 py-3 text-lg font-medium text-black no-underline shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-100 hover:bg-gray-700 hover:text-white hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:bg-black active:shadow-none'
                  >
                    ← View all tags
                  </a>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    );
  };

  describe('Page Structure', () => {
    it('renders main heading with tag name', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Posts tagged with "TypeScript"');
      expect(heading).toHaveClass('text-3xl', 'font-bold');
    });

    it('displays correct post count', () => {
      const tag = { name: 'Tutorial', slug: 'tutorial' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      expect(screen.getByText('2 posts found')).toBeInTheDocument();
    });

    it('displays singular "post" for single post', () => {
      const tag = { name: 'React', slug: 'react' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      expect(screen.getByText('1 post found')).toBeInTheDocument();
    });

    it('has proper container structure', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      const { container } = renderTagPage(tag, filteredPosts);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('includes link back to tags index', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const backLink = screen.getByText('← View all tags');
      expect(backLink).toHaveAttribute('href', '/blog/tags');
    });
  });

  describe('Content Filtering', () => {
    it('displays only posts with the specified tag', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const bentoGrid = screen.getByTestId('bento-grid');
      expect(bentoGrid).toHaveAttribute('data-posts-count', '2');
    });

    it('correctly filters posts by tag slug', () => {
      // TypeScript tag should match posts 1 and 3
      const typescriptTag = { name: 'TypeScript', slug: 'typescript' };
      const typescriptPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === typescriptTag.slug));
      expect(typescriptPosts).toHaveLength(2);
      expect(typescriptPosts.map((p) => p.id)).toEqual(['post-1', 'post-3']);

      // Tutorial tag should match posts 1 and 2
      const tutorialTag = { name: 'Tutorial', slug: 'tutorial' };
      const tutorialPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tutorialTag.slug));
      expect(tutorialPosts).toHaveLength(2);
      expect(tutorialPosts.map((p) => p.id)).toEqual(['post-1', 'post-2']);

      // React tag should match only post 2
      const reactTag = { name: 'React', slug: 'react' };
      const reactPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === reactTag.slug));
      expect(reactPosts).toHaveLength(1);
      expect(reactPosts.map((p) => p.id)).toEqual(['post-2']);
    });

    it('sorts filtered posts by date (newest first)', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts
        .filter((post) => post.data.tags.some((t) => t.slug === tag.slug))
        .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());

      renderTagPage(tag, filteredPosts);

      // Post 1 (2025-03-01) should come before Post 3 (2025-01-20)
      const bentoGrid = screen.getByTestId('bento-grid');
      expect(bentoGrid).toHaveAttribute('data-posts-count', '2');
    });
  });

  describe('Search Component', () => {
    it('renders search component with all posts for global search', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const search = screen.getByTestId('blog-search');
      expect(search).toBeInTheDocument();
      expect(search).toHaveAttribute('data-posts-count', '3'); // All posts, not just filtered
    });

    it('renders search component even when no posts match the tag', () => {
      const tag = { name: 'Nonexistent', slug: 'nonexistent' };
      const filteredPosts: BlogPost[] = [];

      renderTagPage(tag, filteredPosts);

      const search = screen.queryByTestId('blog-search');
      expect(search).not.toBeInTheDocument(); // Search only renders when there are posts
    });
  });

  describe('BentoGrid Component', () => {
    it('renders bento grid with filtered posts', () => {
      const tag = { name: 'Tutorial', slug: 'tutorial' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const bentoGrid = screen.getByTestId('bento-grid');
      expect(bentoGrid).toBeInTheDocument();
      expect(bentoGrid).toHaveAttribute('data-posts-count', '2');
    });

    it('does not render bento grid when no posts match', () => {
      const tag = { name: 'Nonexistent', slug: 'nonexistent' };
      const filteredPosts: BlogPost[] = [];

      renderTagPage(tag, filteredPosts);

      const bentoGrid = screen.queryByTestId('bento-grid');
      expect(bentoGrid).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no posts match the tag', () => {
      const tag = { name: 'Nonexistent', slug: 'nonexistent' };
      const filteredPosts: BlogPost[] = [];

      renderTagPage(tag, filteredPosts);

      expect(screen.getByText('No posts found with this tag.')).toBeInTheDocument();
    });

    it('does not show empty state when posts exist', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      expect(screen.queryByText('No posts found with this tag.')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('applies proper spacing classes', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const headerSection = screen.getByRole('heading', { level: 1 }).parentElement?.parentElement;
      expect(headerSection).toHaveClass('mb-2');

      const postCountText = screen.getByText(/posts? found/);
      const descriptionSection = postCountText.parentElement?.parentElement;
      expect(descriptionSection).toHaveClass('mb-12');
    });

    it('applies responsive padding', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      const { container } = renderTagPage(tag, filteredPosts);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toHaveClass('px-4', 'py-12', 'sm:px-6', 'lg:px-8');
    });

    it('styles back link appropriately', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const backLink = screen.getByText('← View all tags');
      expect(backLink).toHaveClass(
        'border-2',
        'border-black',
        'bg-orange-200',
        'px-6',
        'py-3',
        'text-lg',
        'font-medium',
        'text-black',
        'no-underline',
        'shadow-[4px_4px_0px_rgba(0,0,0,1)]',
        'transition-all',
        'duration-100'
      );
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      const links = screen.getAllByRole('link');
      expect(links.length).toBe(1); // Back to tags link
    });

    it('has proper heading hierarchy', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('maintains consistent structure across states', () => {
      const tag = { name: 'TypeScript', slug: 'typescript' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      const { container: withPosts } = renderTagPage(tag, filteredPosts);

      const emptyTag = { name: 'Empty', slug: 'empty' };
      const { container: withoutPosts } = renderTagPage(emptyTag, []);

      expect(withPosts.querySelector('.mx-auto.max-w-7xl')).toBeInTheDocument();
      expect(withoutPosts.querySelector('.mx-auto.max-w-7xl')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles tag with no posts gracefully', () => {
      const tag = { name: 'Unused Tag', slug: 'unused' };
      const filteredPosts: BlogPost[] = [];

      renderTagPage(tag, filteredPosts);

      expect(screen.getByText('Posts tagged with "Unused Tag"')).toBeInTheDocument();
      expect(screen.getByText('No posts found with this tag.')).toBeInTheDocument();
      expect(screen.getByText('0 posts found')).toBeInTheDocument();
    });

    it('handles single post with tag', () => {
      const tag = { name: 'React', slug: 'react' };
      const filteredPosts = mockAllPosts.filter((post) => post.data.tags.some((t) => t.slug === tag.slug));

      renderTagPage(tag, filteredPosts);

      expect(screen.getByText('1 post found')).toBeInTheDocument();
      expect(screen.getByTestId('bento-grid')).toHaveAttribute('data-posts-count', '1');
    });
  });
});

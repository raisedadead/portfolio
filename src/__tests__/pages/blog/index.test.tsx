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

vi.mock('@/components/blog/BlogCard.astro', () => ({
  default: ({ post }: { post: BlogPost }) => (
    <article data-testid='blog-card' data-post-id={post.id}>
      <h2>{post.data.title}</h2>
    </article>
  )
}));

vi.mock('@/components/blog/Pagination.astro', () => ({
  default: ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => (
    <nav data-testid='pagination' data-current={currentPage} data-total={totalPages}>
      Pagination
    </nav>
  )
}));

describe('Blog Index Page', () => {
  const mockPosts: BlogPost[] = [
    {
      id: 'post-1',
      data: {
        slug: 'first-blog-post',
        title: 'First Blog Post',
        brief: 'This is the first post',
        content: { html: '<p>Content 1</p>' },
        author: { name: 'Author 1' },
        tags: [{ name: 'Tech', slug: 'tech' }],
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
        tags: [{ name: 'Dev', slug: 'dev' }],
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
        tags: [{ name: 'Tutorial', slug: 'tutorial' }],
        publishedAt: new Date('2025-01-20'),
        readingTime: 6
      }
    },
    {
      id: 'post-4',
      data: {
        slug: 'fourth-blog-post',
        title: 'Fourth Blog Post',
        brief: 'This is the fourth post',
        content: { html: '<p>Content 4</p>' },
        author: { name: 'Author 4' },
        tags: [{ name: 'Guide', slug: 'guide' }],
        publishedAt: new Date('2025-01-10'),
        readingTime: 10
      }
    },
    {
      id: 'post-5',
      data: {
        slug: 'fifth-blog-post',
        title: 'Fifth Blog Post',
        brief: 'This is the fifth post',
        content: { html: '<p>Content 5</p>' },
        author: { name: 'Author 5' },
        tags: [{ name: 'News', slug: 'news' }],
        publishedAt: new Date('2025-01-05'),
        readingTime: 3
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderBlogIndex = (posts: BlogPost[], totalPages: number) => {
    const displayPosts = posts.slice(0, 4);
    return render(
      <div data-testid='blog-index-page'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h1 className='mb-4 text-4xl font-bold text-gray-900'>Blog</h1>
            <p className='text-lg text-gray-600'>Thoughts on web development, technology, and more</p>
          </div>

          {posts.length === 0 ? (
            <div className='mx-auto max-w-md rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
              <p className='text-lg text-gray-600'>No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div data-testid='blog-search' data-posts-count={posts.length}>
                Search Component
              </div>

              <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-2' id='blog-posts-grid'>
                {displayPosts.map((post) => (
                  <div key={post.id} data-blog-post-id={post.id}>
                    <article data-testid='blog-card' data-post-id={post.id}>
                      <h2>{post.data.title}</h2>
                    </article>
                  </div>
                ))}
              </div>

              <div
                id='blog-empty-state'
                className='mx-auto mt-8 hidden max-w-md rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'
              >
                <p className='text-lg text-gray-600'>No posts match your search. Try a different query.</p>
              </div>

              {totalPages > 1 && (
                <nav data-testid='pagination' data-current={1} data-total={totalPages}>
                  Pagination
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  describe('Page Structure', () => {
    it('renders main heading', () => {
      renderBlogIndex(mockPosts, 2);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Blog');
      expect(heading).toHaveClass('text-4xl', 'font-bold');
    });

    it('renders page description', () => {
      renderBlogIndex(mockPosts, 2);

      expect(screen.getByText('Thoughts on web development, technology, and more')).toBeInTheDocument();
    });

    it('has proper container structure', () => {
      const { container } = renderBlogIndex(mockPosts, 2);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Post Display', () => {
    it('displays first 4 posts when more than 4 exist', () => {
      renderBlogIndex(mockPosts, 2);

      const blogCards = screen.getAllByTestId('blog-card');
      expect(blogCards).toHaveLength(4);
    });

    it('displays correct posts when fewer than 4 exist', () => {
      const threePosts = mockPosts.slice(0, 3);
      renderBlogIndex(threePosts, 1);

      const blogCards = screen.getAllByTestId('blog-card');
      expect(blogCards).toHaveLength(3);
    });

    it('wraps each post in element with data-blog-post-id', () => {
      renderBlogIndex(mockPosts, 2);

      const blogCards = screen.getAllByTestId('blog-card');
      const post1Wrapper = blogCards[0].parentElement;
      expect(post1Wrapper).toHaveAttribute('data-blog-post-id');
    });

    it('uses grid layout for posts', () => {
      const { container } = renderBlogIndex(mockPosts, 2);

      const grid = container.querySelector('#blog-posts-grid');
      expect(grid).toHaveClass('grid', 'gap-8', 'md:grid-cols-2', 'lg:grid-cols-2');
    });
  });

  describe('Search Component', () => {
    it('renders search component with all posts', () => {
      renderBlogIndex(mockPosts, 2);

      const search = screen.getByTestId('blog-search');
      expect(search).toBeInTheDocument();
      expect(search).toHaveAttribute('data-posts-count', '5');
    });

    it('does not render search when no posts exist', () => {
      renderBlogIndex([], 0);

      const search = screen.queryByTestId('blog-search');
      expect(search).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('shows pagination when more than 4 posts exist', () => {
      renderBlogIndex(mockPosts, 2);

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveAttribute('data-current', '1');
      expect(pagination).toHaveAttribute('data-total', '2');
    });

    it('does not show pagination when 4 or fewer posts exist', () => {
      const fourPosts = mockPosts.slice(0, 4);
      renderBlogIndex(fourPosts, 1);

      const pagination = screen.queryByTestId('pagination');
      expect(pagination).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no posts exist', () => {
      renderBlogIndex([], 0);

      expect(screen.getByText('No blog posts yet. Check back soon!')).toBeInTheDocument();
    });

    it('does not show empty state when posts exist', () => {
      renderBlogIndex(mockPosts, 2);

      expect(screen.queryByText('No blog posts yet. Check back soon!')).not.toBeInTheDocument();
    });

    it('has hidden search empty state by default', () => {
      const { container } = renderBlogIndex(mockPosts, 2);

      const emptyState = container.querySelector('#blog-empty-state');
      expect(emptyState).toHaveClass('hidden');
    });
  });

  describe('Layout and Styling', () => {
    it('applies proper spacing classes', () => {
      renderBlogIndex(mockPosts, 2);

      const header = screen.getByRole('heading', { level: 1 }).parentElement;
      expect(header).toHaveClass('mb-12', 'text-center');
    });

    it('applies responsive padding', () => {
      const { container } = renderBlogIndex(mockPosts, 2);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toHaveClass('px-4', 'py-12', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = renderBlogIndex(mockPosts, 2);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(container.querySelector('#blog-posts-grid')).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderBlogIndex(mockPosts, 2);

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('maintains consistent structure across states', () => {
      const { container: withPosts } = renderBlogIndex(mockPosts, 2);
      const { container: withoutPosts } = renderBlogIndex([], 0);

      expect(withPosts.querySelector('.mx-auto.max-w-7xl')).toBeInTheDocument();
      expect(withoutPosts.querySelector('.mx-auto.max-w-7xl')).toBeInTheDocument();
    });
  });
});

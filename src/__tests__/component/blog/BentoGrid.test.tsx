import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BlogPost } from '@/types/blog';
import { getBentoGridSpan } from '@/lib/blog-utils';
import BlogGridWithLoadMore from '@/components/blog/BentoGrid';

interface MockLoadMoreProps {
  totalPosts: number;
  visiblePosts: number;
  onLoadMore: () => void;
  isLoading?: boolean;
}

// Mock image optimization utilities
vi.mock('@/lib/image-optimizer', () => ({
  transformImageUrl: vi.fn((url: string) => {
    if (url.startsWith('https://example.com/')) {
      return `https://mrugesh.dev/cdn-cgi/image/width=1920,quality=85,format=auto/${url}`;
    }
    return null;
  })
}));

vi.mock('@/lib/image-dimensions', () => ({
  calculateImageDimensions: vi.fn(() => ({
    mobile: { width: 640, height: 360 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 },
    aspectRatio: '16/9'
  }))
}));

// Mock LoadMoreButton component
vi.mock('@/components/blog/LoadMoreButton', () => ({
  default: ({ totalPosts, visiblePosts, onLoadMore, isLoading }: MockLoadMoreProps) => (
    <div data-testid='load-more-button'>
      <button onClick={onLoadMore} disabled={isLoading} data-total={totalPosts} data-visible={visiblePosts}>
        {isLoading ? 'Loading...' : 'Load more'}
      </button>
    </div>
  )
}));

describe('BlogGridWithLoadMore Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const createMockPost = (id: string, title: string, hasCoverImage = true): BlogPost => ({
    id,
    data: {
      slug: id,
      title,
      brief: `Brief for ${title}`,
      content: { html: '<p>Content</p>' },
      coverImage: hasCoverImage
        ? {
            url: `https://example.com/cover-${id}.jpg`,
            alt: `Cover for ${title}`
          }
        : undefined,
      author: { name: 'Test Author', profilePicture: 'https://example.com/author.jpg' },
      tags: [{ name: 'Test', slug: 'test' }],
      publishedAt: new Date('2025-01-01'),
      readingTime: 5,
      hashnodeUrl: `https://blog.example.com/${id}`
    }
  });

  const mockPosts: BlogPost[] = [
    createMockPost('post-1', 'First Post'),
    createMockPost('post-2', 'Second Post'),
    createMockPost('post-3', 'Third Post'),
    createMockPost('post-4', 'Fourth Post'),
    createMockPost('post-5', 'Fifth Post'),
    createMockPost('post-6', 'Sixth Post'),
    createMockPost('post-7', 'Seventh Post'),
    createMockPost('post-8', 'Eighth Post')
  ];

  describe('Initial Render', () => {
    it('renders with default initialCount of 6 posts', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} />);

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Sixth Post')).toBeInTheDocument();
      expect(screen.queryByText('Seventh Post')).not.toBeInTheDocument();
    });

    it('renders with custom initialCount', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={3} />);

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
      expect(screen.queryByText('Fourth Post')).not.toBeInTheDocument();
    });

    it('renders grid container with correct classes', () => {
      const { container } = render(<BlogGridWithLoadMore posts={mockPosts} />);

      const grid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-5');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Load More Functionality', () => {
    it('increments visibleCount by postsPerLoad on load more', async () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={3} postsPerLoad={2} />);

      expect(screen.getByText('Third Post')).toBeInTheDocument();
      expect(screen.queryByText('Fourth Post')).not.toBeInTheDocument();

      const loadMoreButton = screen.getByTestId('load-more-button').querySelector('button');
      expect(loadMoreButton).not.toBeNull();

      await act(async () => {
        fireEvent.click(loadMoreButton!);
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText('Fourth Post')).toBeInTheDocument();
      expect(screen.getByText('Fifth Post')).toBeInTheDocument();
    });

    it('sets isLoading to true immediately on handleLoadMore', async () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={3} />);

      const loadMoreButton = screen.getByTestId('load-more-button').querySelector('button');

      await act(async () => {
        fireEvent.click(loadMoreButton!);
      });

      // Before timer advances, loading state should be true
      expect(loadMoreButton).toHaveTextContent('Loading...');
    });

    it('sets isLoading to false after 300ms delay', async () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={3} />);

      const loadMoreButton = screen.getByTestId('load-more-button').querySelector('button');

      await act(async () => {
        fireEvent.click(loadMoreButton!);
        vi.advanceTimersByTime(300);
      });

      expect(loadMoreButton).toHaveTextContent('Load more');
    });

    it('never exceeds total posts length with Math.min logic', async () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={6} postsPerLoad={5} />);

      const loadMoreButton = screen.getByTestId('load-more-button').querySelector('button');

      await act(async () => {
        fireEvent.click(loadMoreButton!);
        vi.advanceTimersByTime(300);
      });

      // Should show all 8 posts, not 6 + 5 = 11
      expect(screen.getByText('Eighth Post')).toBeInTheDocument();
      expect(loadMoreButton).toHaveAttribute('data-visible', '8');
    });
  });

  describe('Post Slicing', () => {
    it('correctly slices posts array based on visibleCount', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={4} />);

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(4);
    });

    it('updates slice when visibleCount changes', async () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={2} postsPerLoad={2} />);

      expect(screen.getAllByRole('article')).toHaveLength(2);

      const loadMoreButton = screen.getByTestId('load-more-button').querySelector('button');

      await act(async () => {
        fireEvent.click(loadMoreButton!);
        vi.advanceTimersByTime(300);
      });

      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
  });

  describe('Grid Rendering', () => {
    it('renders each post with correct data-blog-post-id', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={3} />);

      expect(screen.getByText('First Post').closest('article')).toHaveAttribute('data-blog-post-id', 'post-1');
      expect(screen.getByText('Second Post').closest('article')).toHaveAttribute('data-blog-post-id', 'post-2');
      expect(screen.getByText('Third Post').closest('article')).toHaveAttribute('data-blog-post-id', 'post-3');
    });

    it('applies getBentoGridSpan classes correctly for index 0', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      const { desktop, aspectClass } = getBentoGridSpan(0);
      const article = screen.getByRole('article');

      expect(article.className).toContain(desktop);
      expect(article.querySelector(`.${aspectClass.replace('/', '\\/')}`)).toBeTruthy();
    });

    it('renders link to blog post with correct href', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={2} />);

      const link = screen.getByText('First Post').closest('a');
      expect(link).toHaveAttribute('href', '/blog/post-1');
    });
  });

  describe('Cover Image Rendering', () => {
    it('renders cover image when coverImage.url exists', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      const img = screen.getByAltText('Cover for First Post');
      expect(img).toHaveAttribute(
        'src',
        'https://mrugesh.dev/cdn-cgi/image/width=1920,quality=85,format=auto/https://example.com/cover-post-1.jpg'
      );
      expect(img).toHaveAttribute('width', '640');
      expect(img).toHaveAttribute('height', '360');
    });

    it('sets loading="eager" on first image and "lazy" on subsequent images', () => {
      render(<BlogGridWithLoadMore posts={mockPosts.slice(0, 3)} initialCount={3} />);

      const firstImg = screen.getByAltText('Cover for First Post');
      expect(firstImg).toHaveAttribute('loading', 'eager');
      expect(firstImg).toHaveAttribute('fetchpriority', 'high');

      const secondImg = screen.getByAltText('Cover for Second Post');
      expect(secondImg).toHaveAttribute('loading', 'lazy');
      expect(secondImg).not.toHaveAttribute('fetchpriority');
    });

    it('applies animation styles to cover images', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      const img = screen.getByAltText('Cover for First Post');
      expect(img).toHaveStyle({ opacity: 0, animation: 'fadeIn 0.5s ease-in forwards' });
    });

    it('renders fallback gradient when coverImage is missing', () => {
      const postWithoutCover = createMockPost('no-cover', 'No Cover Post', false);
      render(<BlogGridWithLoadMore posts={[postWithoutCover]} initialCount={1} />);

      const fallback = screen.getByText('📝');
      expect(fallback.parentElement).toHaveClass('bg-gradient-to-br', 'from-blue-500', 'via-purple-500', 'to-pink-500');
    });

    it('renders loading skeleton behind image', () => {
      const { container } = render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      const skeleton = container.querySelector('.animate-pulse.bg-gray-200');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Post Content', () => {
    it('renders post title', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    it('renders post brief', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      expect(screen.getByText('Brief for First Post')).toBeInTheDocument();
    });

    it('renders formatted publishedAt date', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      const dateText = new Date('2025-01-01').toDateString();
      expect(screen.getByText(dateText)).toBeInTheDocument();
    });

    it('renders reading time when available', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('renders bullet separator between date and reading time', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      expect(screen.getByText('•')).toBeInTheDocument();
    });
  });

  describe('LoadMoreButton Integration', () => {
    it('passes correct totalPosts prop', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} />);

      const button = screen.getByTestId('load-more-button').querySelector('button');
      expect(button).toHaveAttribute('data-total', String(mockPosts.length));
    });

    it('passes correct visiblePosts prop', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={4} />);

      const button = screen.getByTestId('load-more-button').querySelector('button');
      expect(button).toHaveAttribute('data-visible', '4');
    });

    it('passes isLoading state', async () => {
      render(<BlogGridWithLoadMore posts={mockPosts} />);

      const button = screen.getByTestId('load-more-button').querySelector('button');

      await act(async () => {
        fireEvent.click(button!);
      });

      expect(button).toBeDisabled();
    });

    it('passes postsPerLoad prop', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} postsPerLoad={5} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      expect(loadMoreButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty posts array', () => {
      render(<BlogGridWithLoadMore posts={[]} />);

      expect(screen.queryByRole('article')).not.toBeInTheDocument();
      expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
    });

    it('handles single post', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} />);

      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    it('handles initialCount greater than posts length', () => {
      render(<BlogGridWithLoadMore posts={mockPosts} initialCount={20} />);

      expect(screen.getAllByRole('article')).toHaveLength(mockPosts.length);
    });

    it('handles post without readingTime', () => {
      const postWithoutReadingTime: BlogPost = {
        ...mockPosts[0],
        data: { ...mockPosts[0].data, readingTime: 0 }
      };

      render(<BlogGridWithLoadMore posts={[postWithoutReadingTime]} initialCount={1} />);

      expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
      expect(screen.queryByText('•')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies responsive grid classes', () => {
      const { container } = render(<BlogGridWithLoadMore posts={mockPosts} />);

      const grid = container.querySelector('.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-5');
      expect(grid).toBeInTheDocument();
    });

    it('applies shadow and transition classes to articles', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      const article = screen.getByRole('article');
      expect(article).toHaveClass(
        'shadow-[4px_4px_0px_var(--color-black)]',
        'transition-all',
        'duration-100',
        'hover:shadow-[6px_6px_0px_var(--color-black)]'
      );
    });

    it('applies hover background class', () => {
      render(<BlogGridWithLoadMore posts={[mockPosts[0]]} initialCount={1} />);

      const article = screen.getByRole('article');
      expect(article).toHaveClass('hover:bg-orange-100');
    });
  });

  describe('Animation Styles', () => {
    it('injects fadeIn keyframes', () => {
      const { container } = render(<BlogGridWithLoadMore posts={mockPosts} />);

      const styleTag = container.querySelector('style');
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.textContent).toContain('@keyframes fadeIn');
      expect(styleTag?.textContent).toContain('opacity: 0');
      expect(styleTag?.textContent).toContain('opacity: 1');
    });
  });
});

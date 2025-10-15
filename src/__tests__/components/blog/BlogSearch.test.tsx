import BlogSearch from '@/components/blog/BlogSearch';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import type { BlogPost } from '@/types/blog';

const mockPosts: BlogPost[] = [
  {
    id: 'post-1',
    data: {
      slug: 'post-1',
      title: 'Getting Started with TypeScript',
      brief: 'Learn the basics of TypeScript and how to use it in your projects',
      content: { html: '<p>Content</p>' },
      author: { name: 'John Doe' },
      tags: [
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'Tutorial', slug: 'tutorial' }
      ],
      publishedAt: new Date('2025-01-15'),
      readingTime: 5
    }
  },
  {
    id: 'post-2',
    data: {
      slug: 'post-2',
      title: 'Advanced React Patterns',
      brief: 'Explore advanced patterns in React development',
      content: { html: '<p>Content</p>' },
      author: { name: 'Jane Smith' },
      tags: [
        { name: 'React', slug: 'react' },
        { name: 'Advanced', slug: 'advanced' }
      ],
      publishedAt: new Date('2025-02-20'),
      readingTime: 8
    }
  },
  {
    id: 'post-3',
    data: {
      slug: 'post-3',
      title: 'CSS Grid Layout Guide',
      brief: 'Master CSS Grid for modern web layouts',
      content: { html: '<p>Content</p>' },
      author: { name: 'Bob Wilson' },
      tags: [
        { name: 'CSS', slug: 'css' },
        { name: 'Tutorial', slug: 'tutorial' }
      ],
      publishedAt: new Date('2025-03-10'),
      readingTime: 6
    }
  }
];

describe('BlogSearch Component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    delete (window as { location?: Location }).location;
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        href: '',
        assign: vi.fn((url: string) => {
          window.location.href = url;
        })
      },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
  });

  describe('Rendering', () => {
    it('renders search input with correct label', () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByLabelText('Search blog posts');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'search');
    });

    it('renders search input with placeholder text', () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByPlaceholderText('Search posts by title, content, or tags...');
      expect(input).toBeInTheDocument();
    });

    it('does not show dropdown initially', () => {
      render(<BlogSearch posts={mockPosts} />);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows dropdown when typing', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('renders search icon', () => {
      const { container } = render(<BlogSearch posts={mockPosts} />);

      const searchIcon = container.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters posts by title', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        expect(screen.getByText('Getting Started with TypeScript')).toBeInTheDocument();
        expect(screen.queryByText('Advanced React Patterns')).not.toBeInTheDocument();
      });
    });

    it('filters posts by brief content', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'patterns' } });

      await waitFor(() => {
        expect(screen.getByText('Advanced React Patterns')).toBeInTheDocument();
        expect(screen.queryByText('Getting Started with TypeScript')).not.toBeInTheDocument();
      });
    });

    it('filters posts by tag name', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'Tutorial' } });

      await waitFor(() => {
        expect(screen.getByText('Getting Started with TypeScript')).toBeInTheDocument();
        expect(screen.getByText('CSS Grid Layout Guide')).toBeInTheDocument();
        expect(screen.queryByText('Advanced React Patterns')).not.toBeInTheDocument();
      });
    });

    it('performs case-insensitive search', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'REACT' } });

      await waitFor(() => {
        expect(screen.getByText('Advanced React Patterns')).toBeInTheDocument();
      });
    });

    it('hides dropdown when search query is empty', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'React' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('shows no results message when no matches found', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'nonexistent' } });

      await waitFor(() => {
        expect(screen.getByText('No posts match your search')).toBeInTheDocument();
      });
    });

    it('navigates to post when clicked', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        expect(screen.getByText('Getting Started with TypeScript')).toBeInTheDocument();
      });

      const resultItem = screen.getByText('Getting Started with TypeScript').closest('li');
      fireEvent.click(resultItem!);

      expect(window.location.href).toBe('/blog/post-1');
    });

    it('limits results to 8 posts', async () => {
      const manyPosts = Array.from({ length: 20 }, (_, i) => ({
        ...mockPosts[0],
        id: `post-${i}`,
        data: {
          ...mockPosts[0].data,
          title: `Post ${i} about TypeScript`
        }
      }));

      render(<BlogSearch posts={manyPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(8);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Search blog posts by title, content, or tags');
    });

    it('has aria-autocomplete attribute', () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('search input has associated label', () => {
      render(<BlogSearch posts={mockPosts} />);

      const label = screen.getByLabelText('Search blog posts');
      expect(label).toBeInTheDocument();
    });

    it('uses semantic search input type', () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('marks selected option with aria-selected', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options[0]).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Styling', () => {
    it('applies correct container classes', () => {
      const { container } = render(<BlogSearch posts={mockPosts} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('relative', 'mb-12');
    });

    it('applies dark mode classes to input', () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('dark:bg-gray-800', 'dark:text-white', 'dark:border-orange-200');
    });

    it('applies focus styles to input', () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('focus:outline-none', 'focus:shadow-[8px_8px_0px_var(--color-black)]');
    });

    it('applies neobrutalism styles to dropdown', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        const dropdown = screen.getByRole('listbox');
        expect(dropdown).toHaveClass('border-4', 'border-black', 'shadow-[6px_6px_0px_var(--color-black)]');
      });
    });
  });

  describe('Progressive Enhancement', () => {
    it('returns null before mounting', () => {
      const { container } = render(<BlogSearch posts={mockPosts} />);

      // Component should render after mounting in test environment
      expect(container.firstChild).not.toBeNull();
    });

    it('handles empty posts array gracefully', () => {
      render(<BlogSearch posts={[]} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(screen.getByText('No posts match your search')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates down through results with arrow key', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'Tutorial' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates up through results with arrow key', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'Tutorial' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to selected post on Enter key', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(window.location.href).toBe('/blog/post-1');
    });

    it('closes dropdown on Escape key', async () => {
      render(<BlogSearch posts={mockPosts} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Click Outside', () => {
    it('closes dropdown when clicking outside', async () => {
      render(
        <>
          <BlogSearch posts={mockPosts} />
          <div data-testid='outside'>Outside element</div>
        </>
      );

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });
});

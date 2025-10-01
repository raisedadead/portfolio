import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BlogLoadMore from '@/components/blog/LoadMoreButton';

describe('BlogLoadMore Component', () => {
  const mockOnLoadMore = vi.fn();

  describe('Button Rendering', () => {
    it('renders button when hasMore is true', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Load more articles');
    });

    it('shows "That\'s the end" message when hasMore is false', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={10} onLoadMore={mockOnLoadMore} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText(/that's the end. no more articles/i)).toBeInTheDocument();
    });

    it('renders button when visiblePosts equals totalPosts but isLoading is true', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={10} onLoadMore={mockOnLoadMore} isLoading={true} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('disables button when isLoading is true', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} isLoading={true} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toBeDisabled();
    });

    it('changes button text to "Loading..." when isLoading is true', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} isLoading={true} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveTextContent('Loading...');
    });

    it('applies loading styles when isLoading is true', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} isLoading={true} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveClass('cursor-not-allowed', 'bg-orange-100', 'text-gray-400');
    });

    it('applies default styles when isLoading is false', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} isLoading={false} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveClass('bg-orange-200', 'text-black', 'hover:bg-gray-700');
    });
  });

  describe('Click Handler', () => {
    it('calls onLoadMore callback when button is clicked', () => {
      const mockCallback = vi.fn();
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockCallback} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      fireEvent.click(button);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('does not call onLoadMore when button is disabled', () => {
      const mockCallback = vi.fn();
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockCallback} isLoading={true} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      fireEvent.click(button);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for screen readers', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveAttribute('aria-label', 'Load more blog posts');
    });

    it('sets aria-busy to true when loading', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} isLoading={true} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('sets aria-busy to false when not loading', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} isLoading={false} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveAttribute('aria-busy', 'false');
    });

    it('provides keyboard accessibility', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      button.focus();

      expect(button).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles visiblePosts equal to totalPosts', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={10} onLoadMore={mockOnLoadMore} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText(/that's the end/i)).toBeInTheDocument();
    });

    it('handles visiblePosts greater than totalPosts', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={15} onLoadMore={mockOnLoadMore} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText(/that's the end/i)).toBeInTheDocument();
    });

    it('handles zero posts', () => {
      render(<BlogLoadMore totalPosts={0} visiblePosts={0} onLoadMore={mockOnLoadMore} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText(/that's the end/i)).toBeInTheDocument();
    });

    it('handles visiblePosts of 1 with totalPosts of 2', () => {
      render(<BlogLoadMore totalPosts={2} visiblePosts={1} onLoadMore={mockOnLoadMore} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('applies responsive width classes', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveClass('w-full', 'sm:w-1/2');
    });

    it('applies border and shadow styles', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveClass('border-2', 'shadow-[4px_4px_0px_rgba(0,0,0,1)]');
    });

    it('applies transition classes', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} />);

      const button = screen.getByRole('button', { name: /load more blog posts/i });
      expect(button).toHaveClass('transition-all', 'duration-100');
    });
  });

  describe('Container Rendering', () => {
    it('renders container with proper centering classes for button state', () => {
      const { container } = render(<BlogLoadMore totalPosts={10} visiblePosts={5} onLoadMore={mockOnLoadMore} />);

      const wrapper = container.querySelector('.flex.justify-center.py-8');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders container with proper centering classes for end message', () => {
      const { container } = render(<BlogLoadMore totalPosts={10} visiblePosts={10} onLoadMore={mockOnLoadMore} />);

      const wrapper = container.querySelector('.flex.justify-center.py-8');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders end message with correct text color classes', () => {
      render(<BlogLoadMore totalPosts={10} visiblePosts={10} onLoadMore={mockOnLoadMore} />);

      const message = screen.getByText(/that's the end/i);
      expect(message).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });
  });
});

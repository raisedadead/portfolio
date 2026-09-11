import BlogLoadMore from '@/components/blog/LoadMoreButton';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('BlogLoadMore', () => {
  it('calls the load handler while posts remain', () => {
    const onLoadMore = vi.fn();
    render(<BlogLoadMore totalPosts={10} visiblePosts={6} onLoadMore={onLoadMore} />);
    fireEvent.click(screen.getByRole('button', { name: 'Load more blog posts' }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it.each([0, 6, 10])('shows the end state when all %i posts are visible', (totalPosts) => {
    render(<BlogLoadMore totalPosts={totalPosts} visiblePosts={totalPosts} onLoadMore={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText(/that's the end/i)).toBeInTheDocument();
  });
});

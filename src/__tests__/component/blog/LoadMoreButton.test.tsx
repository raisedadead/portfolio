import BlogLoadMore from '@/components/blog/LoadMoreButton';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('BlogLoadMore', () => {
  it('shows progress and loads at most one batch', () => {
    const onLoadMore = vi.fn();
    render(<BlogLoadMore totalPosts={10} visiblePosts={6} postsPerLoad={6} scope='' onLoadMore={onLoadMore} />);
    expect(screen.getByText('Showing 6 of 10')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Load 4 more' }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it.each([
    [1, 'post'],
    [6, 'posts']
  ])('shows the end state when all %i %s are visible', (totalPosts, noun) => {
    render(
      <BlogLoadMore
        totalPosts={totalPosts}
        visiblePosts={totalPosts}
        postsPerLoad={6}
        scope=' tagged #zsh'
        onLoadMore={vi.fn()}
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText(`That's all ${totalPosts} ${noun} tagged #zsh.`)).toBeInTheDocument();
  });

  it('moves focus to the end state after the last batch loads', () => {
    const props = { totalPosts: 8, postsPerLoad: 6, scope: '', onLoadMore: vi.fn() };
    const { rerender } = render(<BlogLoadMore {...props} visiblePosts={6} />);
    fireEvent.click(screen.getByRole('button', { name: 'Load 2 more' }));
    rerender(<BlogLoadMore {...props} visiblePosts={8} />);
    expect(screen.getByText("That's all 8 posts.")).toHaveFocus();
  });

  it('leaves focus alone when a filter ends the list after an earlier load', () => {
    const props = { postsPerLoad: 6, scope: '', onLoadMore: vi.fn() };
    const { rerender } = render(<BlogLoadMore {...props} totalPosts={20} visiblePosts={6} />);
    fireEvent.click(screen.getByRole('button', { name: 'Load 6 more' }));
    rerender(<BlogLoadMore {...props} totalPosts={20} visiblePosts={12} />);
    rerender(<BlogLoadMore {...props} totalPosts={4} visiblePosts={4} />);
    expect(screen.getByText("That's all 4 posts.")).not.toHaveFocus();
  });

  it('leaves focus alone when the end state shows without a load', () => {
    render(<BlogLoadMore totalPosts={3} visiblePosts={3} postsPerLoad={6} scope='' onLoadMore={vi.fn()} />);
    expect(screen.getByText("That's all 3 posts.")).not.toHaveFocus();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LightweightPost } from '@/types/blog';
import BlogGridWithLoadMore from '@/components/blog/BentoGrid';

vi.mock('@sentry/astro', () => ({ metrics: { count: vi.fn() } }));

const posts: LightweightPost[] = Array.from({ length: 10 }, (_, i) => ({
  id: `post-${i}`,
  data: {
    slug: `post-${i}`,
    title: `Post ${i}`,
    brief: `Brief ${i}`,
    coverImage: { url: `/_emdash/api/media/file/cover-${i}.webp`, alt: `Cover ${i}`, width: 1280, height: 720 },
    tags: [],
    publishedAt: new Date('2025-01-01'),
    readingTime: 5,
    source: 'local'
  }
}));

describe('BlogGridWithLoadMore', () => {
  it('reveals the next batch immediately and stops at the end', () => {
    render(<BlogGridWithLoadMore posts={posts} />);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', { name: 'Load more blog posts' }));
    expect(screen.getAllByRole('article')).toHaveLength(9);
    fireEvent.click(screen.getByRole('button', { name: 'Load more blog posts' }));
    expect(screen.getAllByRole('article')).toHaveLength(10);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText(/that's the end/i)).toBeInTheDocument();
  });

  it('honors custom batch sizes', () => {
    render(<BlogGridWithLoadMore posts={posts} initialCount={2} postsPerLoad={4} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Load more blog posts' }));
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });

  it('renders cover metadata and the local article destination', () => {
    render(<BlogGridWithLoadMore posts={[posts[0]]} />);
    const image = screen.getByAltText('Cover 0');
    expect(image).toHaveAttribute('src', posts[0].data.coverImage?.url);
    expect(image).toHaveAttribute('width', '1280');
    expect(image).toHaveAttribute('height', '720');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/post-0');
    expect(screen.getByText('Jan 01, 2025')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('keeps external article destinations and covers', () => {
    const external: LightweightPost = {
      ...posts[0],
      data: {
        ...posts[0].data,
        source: 'freecodecamp',
        externalUrl: 'https://www.freecodecamp.org/news/article/',
        coverImage: { url: 'https://cdn.freecodecamp.org/cover.webp' }
      }
    };
    render(<BlogGridWithLoadMore posts={[external]} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', external.data.externalUrl);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('img')).toHaveAttribute('src', external.data.coverImage?.url);
  });

  it('prefetches the next covers and cleans up links on unmount', () => {
    const { unmount } = render(<BlogGridWithLoadMore posts={posts} />);
    const prefetch = document.head.querySelector(`link[rel="prefetch"][href="${posts[6].data.coverImage?.url}"]`);
    expect(prefetch).toHaveAttribute('as', 'image');
    unmount();
    expect(prefetch).not.toBeInTheDocument();
  });

  it('renders posts without covers and handles an empty list', () => {
    const { rerender } = render(
      <BlogGridWithLoadMore posts={[{ ...posts[0], data: { ...posts[0].data, coverImage: undefined } }]} />
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/post-0');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    rerender(<BlogGridWithLoadMore posts={[]} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

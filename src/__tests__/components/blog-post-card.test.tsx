import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogPostCard from '@/components/blog-post-card';
import { Post } from '@/lib/posts-fetcher';

describe('BlogPostCard', () => {
  const mockPost: Post = {
    title: 'Test Post',
    brief: 'This is a test post',
    slug: 'test-post',
    publishedAt: '2023-01-01',
    readTimeInMinutes: 5,
    views: 100,
    reactionCount: 10,
    replyCount: 5,
    coverImage: { url: 'https://example.com/image.jpg' }
  };

  it('renders the blog post card with correct information', () => {
    render(<BlogPostCard post={mockPost} index={0} />);

    expect(screen.getByText('Test Post')).toBeDefined();
    expect(screen.getByText('This is a test post')).toBeDefined();
    expect(screen.getByText('5 min read')).toBeDefined();
    expect(screen.getByText('10 reactions')).toBeDefined();
    expect(screen.getByText('5 comments')).toBeDefined();
  });

  it('renders the correct date', () => {
    render(<BlogPostCard post={mockPost} index={0} />);
    expect(screen.getByText('Sun Jan 01 2023')).toBeDefined();
  });

  it('renders views when they are over 100', () => {
    const highViewPost: Post = { ...mockPost, views: 101 };
    render(<BlogPostCard post={highViewPost} index={0} />);
    expect(screen.getByText('101 views')).toBeDefined();
  });

  it('does not render views when they are exactly 100', () => {
    render(<BlogPostCard post={mockPost} index={0} />);
    expect(screen.queryByText('100 views')).toBeNull();
  });

  it('does not render views when they are less than 100', () => {
    const lowViewPost: Post = { ...mockPost, views: 99 };
    render(<BlogPostCard post={lowViewPost} index={0} />);
    expect(screen.queryByText('99 views')).toBeNull();
  });

  it('does not render reactions when count is 0', () => {
    const noReactionsPost: Post = { ...mockPost, reactionCount: 0 };
    render(<BlogPostCard post={noReactionsPost} index={0} />);
    expect(screen.queryByText('reactions')).toBeNull();
  });

  it('does not render comments when count is 0', () => {
    const noCommentsPost: Post = { ...mockPost, replyCount: 0 };
    render(<BlogPostCard post={noCommentsPost} index={0} />);
    expect(screen.queryByText('comments')).toBeNull();
  });

  it('applies different classes based on index', () => {
    const { container: container0 } = render(
      <BlogPostCard post={mockPost} index={0} />
    );
    const { container: container1 } = render(
      <BlogPostCard post={mockPost} index={1} />
    );

    const firstChild0 = container0.firstChild as HTMLElement;
    const firstChild1 = container1.firstChild as HTMLElement;

    expect(firstChild0.className).not.toBe(firstChild1.className);
  });

  it('renders the cover image with correct attributes', () => {
    render(<BlogPostCard post={mockPost} index={0} />);
    const image = screen.getByRole('img') as HTMLImageElement;
    expect(image.src).toContain(
      encodeURIComponent('https://example.com/image.jpg')
    );
    expect(image.alt).toBe('Test Post');
  });

  it('renders a link to the blog post', () => {
    render(<BlogPostCard post={mockPost} index={0} />);
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.href).toContain('/blog/test-post');
  });
});

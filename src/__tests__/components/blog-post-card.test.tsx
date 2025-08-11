import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import BlogPostCard from '@/components/blog-post-card';
import type { TransformedBlogPost } from '@/types/blog';

describe('BlogPostCard', () => {
  afterEach(cleanup);

  const mockPost: TransformedBlogPost = {
    id: '1',
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    brief: 'This is a test blog post brief that provides a summary of the content.',
    publishedAt: '2024-01-15T10:00:00Z',
    readTimeInMinutes: 5,
    views: 100,
    reactionCount: 10,
    replyCount: 3,
    coverImage: {
      url: 'https://example.com/image.jpg'
    }
  };

  const mockPostWithoutImage: TransformedBlogPost = {
    ...mockPost,
    coverImage: undefined
  };

  it('renders blog post card with all content', () => {
    render(<BlogPostCard post={mockPost} index={0} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test-blog-post');
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test blog post brief that provides a summary of the content.')
    ).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Blog Post');
  });

  it('renders blog post card without cover image', () => {
    render(<BlogPostCard post={mockPostWithoutImage} index={0} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test-blog-post');
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('formats the publish date correctly', () => {
    render(<BlogPostCard post={mockPost} index={0} />);

    // The exact format depends on the locale, so we just check that a date is displayed
    // Using getAllByText since there might be multiple elements with numbers
    const dateElements = screen.getAllByText(/\d+\/\d+\/\d+/);
    expect(dateElements.length).toBeGreaterThan(0);
    expect(dateElements[0]).toBeInTheDocument();
  });

  it('applies correct grid column span classes based on index', () => {
    const { rerender } = render(<BlogPostCard post={mockPost} index={0} />);
    let link = screen.getByRole('link');
    expect(link.className).toContain('lg:col-span-2');

    rerender(<BlogPostCard post={mockPost} index={1} />);
    link = screen.getByRole('link');
    expect(link.className).toContain('lg:col-span-3');

    rerender(<BlogPostCard post={mockPost} index={2} />);
    link = screen.getByRole('link');
    expect(link.className).toContain('lg:col-span-5');

    // Pattern repeats
    rerender(<BlogPostCard post={mockPost} index={3} />);
    link = screen.getByRole('link');
    expect(link.className).toContain('lg:col-span-2');
  });

  it('applies hover styles classes', () => {
    render(<BlogPostCard post={mockPost} index={0} />);

    const link = screen.getByRole('link');
    expect(link.className).toContain('hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]');
    expect(link.className).toContain('hover:-translate-x-[2px]');
    expect(link.className).toContain('hover:-translate-y-[2px]');
  });

  it('applies dark mode styles classes', () => {
    render(<BlogPostCard post={mockPost} index={0} />);

    const link = screen.getByRole('link');
    expect(link.className).toContain('dark:border-white');
    expect(link.className).toContain('dark:bg-gray-800');
    expect(link.className).toContain('dark:shadow-[4px_4px_0px_rgba(255,255,255,1)]');
  });

  it('handles missing optional fields gracefully', () => {
    const minimalPost: TransformedBlogPost = {
      id: '2',
      title: 'Minimal Post',
      slug: 'minimal-post',
      brief: 'Brief description',
      publishedAt: '2024-01-20T10:00:00Z'
    };

    render(<BlogPostCard post={minimalPost} index={0} />);

    expect(screen.getByText('Minimal Post')).toBeInTheDocument();
    expect(screen.getByText('Brief description')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('sets lazy loading on cover image', () => {
    render(<BlogPostCard post={mockPost} index={0} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('applies group hover effect on title', () => {
    render(<BlogPostCard post={mockPost} index={0} />);

    const title = screen.getByText('Test Blog Post');
    expect(title.className).toContain('group-hover:text-blue-600');
    expect(title.className).toContain('dark:group-hover:text-blue-400');
  });
});

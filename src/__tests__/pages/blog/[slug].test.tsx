import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BlogPost from '@/pages/blog/[slug]';
import { DetailedPost, APIErrorResponse } from '@/lib/posts-fetcher';

// Mock the next/router module
vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

// Mock the SWR hook
vi.mock('swr');

// Mock the next/image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill,
    ...props
  }: React.ComponentProps<'img'> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={alt as string}
      {...(fill
        ? { style: { objectFit: 'cover', width: '100%', height: '100%' } }
        : {})}
      {...props}
    />
  )
}));

// Mock the Layout component
vi.mock('@/components/layouts', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='layout'>{children}</div>
  )
}));

describe('BlogPost component', () => {
  const mockPost: DetailedPost = {
    id: '1',
    slug: 'test-slug',
    title: 'Test Post',
    coverImage: { url: '/test-image.jpg' },
    content: { html: '<p>Test content</p>' },
    author: {
      id: '1',
      username: 'test-author',
      name: 'Test Author',
      bio: { text: 'Test bio' },
      profilePicture: '/author.jpg',
      socialMediaLinks: {}
    },
    tags: [{ id: '1', name: 'test', slug: 'test' }],
    publishedAt: '2023-01-01',
    brief: 'Test brief',
    readTimeInMinutes: 5,
    updatedAt: '2023-01-02'
  };

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      query: { slug: 'test-slug' },
      route: '',
      pathname: '',
      asPath: '',
      basePath: '',
      isLocaleDomain: false,
      push: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      beforePopState: vi.fn(),
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
      },
      isFallback: false,
      isReady: true,
      isPreview: false
    } as unknown as ReturnType<typeof useRouter>);
  });

  it('renders skeleton loader when data is loading', () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);
    expect(screen.getByTestId('layout')).toBeDefined();
    expect(screen.getByRole('article')).toBeDefined();
    expect(screen.getByTestId('skeleton-block')).toBeDefined();
  });

  it('renders error state when SWR throws an error', () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: new Error('Test error')
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);
    expect(screen.getByText('Error loading post')).toBeDefined();
  });

  it('renders error state when API returns an error', () => {
    vi.mocked(useSWR).mockReturnValue({
      data: { error: { message: 'API Error' } } as APIErrorResponse,
      error: undefined
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);
    expect(screen.getByText('Error: API Error')).toBeDefined();
  });

  it('renders post content correctly', async () => {
    vi.mocked(useSWR).mockReturnValue({
      data: mockPost,
      error: undefined
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeDefined();
      expect(screen.getByAltText('Test Post')).toBeDefined();
      expect(screen.getByText('Test content')).toBeDefined();
    });
  });

  it('applies correct classes to the article element', async () => {
    vi.mocked(useSWR).mockReturnValue({
      data: mockPost,
      error: undefined
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);

    await waitFor(() => {
      const article = screen.getByRole('article');
      expect(article.classList.contains('mx-auto')).toBe(true);
      expect(article.classList.contains('max-w-4xl')).toBe(true);
      expect(article.classList.contains('overflow-hidden')).toBe(true);
      expect(article.classList.contains('bg-white')).toBe(true);
      expect(article.classList.contains('no-underline')).toBe(true);
      expect(
        article.classList.contains('shadow-[6px_8px_0px_theme(colors.black)]')
      ).toBe(true);
      expect(article.classList.contains('transition-colors')).toBe(true);
      expect(article.classList.contains('duration-300')).toBe(true);
      expect(article.classList.contains('dark:bg-gray-800')).toBe(true);
    });
  });

  it('applies correct classes to the title', async () => {
    vi.mocked(useSWR).mockReturnValue({
      data: mockPost,
      error: undefined
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);

    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 });
      expect(title.classList.contains('mb-10')).toBe(true);
      expect(title.classList.contains('text-3xl')).toBe(true);
      expect(title.classList.contains('font-bold')).toBe(true);
      expect(title.classList.contains('text-gray-900')).toBe(true);
      expect(title.classList.contains('dark:text-gray-100')).toBe(true);
      expect(title.classList.contains('sm:text-4xl')).toBe(true);
    });
  });

  it('applies correct classes to the content', async () => {
    vi.mocked(useSWR).mockReturnValue({
      data: mockPost,
      error: undefined
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);

    await waitFor(() => {
      const content = screen.getByText('Test content').closest('div');
      expect(content).toBeDefined();
      if (content) {
        expect(content.classList.contains('prose-h2:mt-8')).toBe(true);
        expect(content.classList.contains('prose-h2:mb-2')).toBe(true);
        expect(content.classList.contains('prose-h3:mt-6')).toBe(true);
        expect(content.classList.contains('prose-h3:mb-2')).toBe(true);
        expect(content.classList.contains('prose-h4:mt-4')).toBe(true);
        expect(content.classList.contains('prose-h4:mb-2')).toBe(true);
      }
    });
  });

  it('renders skeleton with correct structure', () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined
    } as ReturnType<typeof useSWR>);
    render(<BlogPost />);

    const skeletonBlock = screen.getByTestId('skeleton-block');
    expect(skeletonBlock).toBeDefined();
    expect(skeletonBlock.classList.contains('animate-pulse')).toBe(true);

    const imagePlaceholder = skeletonBlock.querySelector('.aspect-video');
    expect(imagePlaceholder).toBeDefined();
    expect(imagePlaceholder?.classList.contains('bg-gray-200')).toBe(true);

    const titlePlaceholder = skeletonBlock.querySelector('.mb-6.h-8');
    expect(titlePlaceholder).toBeDefined();
    expect(titlePlaceholder?.classList.contains('bg-gray-200')).toBe(true);

    const contentPlaceholders = skeletonBlock.querySelectorAll('.space-y-2');
    expect(contentPlaceholders.length).toBe(6);
  });
});
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Blog from '@/pages/blog';
import { SWRConfig } from 'swr';
import { fetchPostsList } from '@/lib/posts-fetcher';
import { MockedFunction } from 'vitest';
import { ResponseData } from '@/lib/posts-fetcher';

// Mock the fetchPostsList function
vi.mock('@/lib/posts-fetcher', () => ({
  fetchPostsList: vi.fn(),
  POSTS_PER_PAGE: 3
}));

// Mock the Nav component
vi.mock('@/components/nav', () => ({
  default: vi.fn(() => <div data-testid='mocked-nav'>Mocked Nav</div>)
}));

// Mock the useDarkMode hook
vi.mock('@/hooks/useDarkMode', () => ({
  default: () => ({ isDarkMode: false, toggle: vi.fn() })
}));

// Mock next/router with blog-specific properties
const mockRouter = {
  asPath: '/blog',
  query: {},
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn()
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

describe('Blog', () => {
  const mockPost = {
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

  const mockFallback = {
    '/api/posts//': {
      posts: [mockPost],
      pageInfo: {
        endCursor: 'cursor123',
        hasNextPage: false
      }
    }
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    mockRouter.push.mockReset();
    mockRouter.replace.mockReset();
    mockRouter.prefetch.mockReset();

    // Mock the fetchPostsList function to return the mockFallback data
    (fetchPostsList as MockedFunction<typeof fetchPostsList>).mockResolvedValue(
      mockFallback['/api/posts//'] as ResponseData
    );
  });

  const renderBlog = () => {
    return render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <Blog fallback={mockFallback} />
      </SWRConfig>
    );
  };

  it('renders the blog page title', async () => {
    renderBlog();
    await waitFor(() => {
      expect(screen.getByText('My Musings')).toBeDefined();
    });
  });

  it('renders the blog post card', async () => {
    renderBlog();
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeDefined();
      expect(screen.getByText('This is a test post')).toBeDefined();
    });
  });

  // Add more tests here as we confirm each one passes
});

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Blog from '@/pages/blog';
import { SWRConfig } from 'swr';
import { fetchPostsList } from '@/lib/posts-fetcher';

// Mock the fetchPostsList function
vi.mock('@/lib/posts-fetcher', () => ({
  fetchPostsList: vi.fn(),
  POSTS_PER_PAGE: 3
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

    // Mock the fetchPostsList function to return the mockFallback data
    (fetchPostsList as jest.Mock).mockResolvedValue(
      mockFallback['/api/posts//']
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

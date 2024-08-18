import { describe, it, expect, vi } from 'vitest';
import { request } from 'graphql-request';
import { postsFetcher, Post } from '@/lib/posts-fetcher';

vi.mock('graphql-request');

describe('postsFetcher', () => {
  const mockPosts: Post[] = [
    {
      title: 'Test Title 1',
      brief: 'Brief description 1',
      views: 100,
      slug: 'test-title-1',
      publishedAt: '2021-01-01',
      reactionCount: 10,
      replyCount: 2,
      readTimeInMinutes: 5,
      coverImage: { url: 'https://image-url-1' }
    },
    {
      title: 'Test Title 2',
      brief: 'Brief description 2',
      views: 200,
      slug: 'test-title-2',
      publishedAt: '2021-01-02',
      reactionCount: 20,
      replyCount: 4,
      readTimeInMinutes: 10,
      coverImage: { url: 'https://image-url-2' }
    }
  ];

  const mockResponse = {
    publication: {
      posts: {
        edges: mockPosts.map((post) => ({ node: post })),
        pageInfo: {
          endCursor: 'cursor123',
          hasNextPage: true
        }
      }
    }
  };

  it('should fetch posts data and return formatted result', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);
    const result = await postsFetcher('test_key', '');
    expect('posts' in result).toBe(true);
    if ('posts' in result) {
      expect(result.posts).toEqual(mockPosts.sort((a, b) => b.views - a.views));
      expect(result.pageInfo).toEqual({
        endCursor: 'cursor123',
        hasNextPage: true
      });
    }
  });

  it('should correctly handle UserArticlesResponse structure', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);
    const result = await postsFetcher('test_key', '');
    expect('posts' in result).toBe(true);
    if ('posts' in result) {
      expect(result.posts).toEqual(mockPosts.sort((a, b) => b.views - a.views));
      expect(result.pageInfo).toEqual({
        endCursor: 'cursor123',
        hasNextPage: true
      });
    }
  });

  it('should handle empty response gracefully', async () => {
    vi.mocked(request).mockResolvedValueOnce({
      publication: {
        posts: {
          edges: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: false
          }
        }
      }
    });
    const result = await postsFetcher('test_key', '');
    expect('posts' in result).toBe(true);
    if ('posts' in result) {
      expect(result).toEqual({
        posts: [],
        pageInfo: {
          endCursor: '',
          hasNextPage: false
        }
      });
    }
  });

  it('should return APIErrorResponse when request fails', async () => {
    vi.mocked(request).mockRejectedValueOnce(new Error('Network error'));
    const result = await postsFetcher('test_key', '');
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
  });

  it('should correctly map post fields', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);
    const result = await postsFetcher('test_key', '');
    expect('posts' in result).toBe(true);
    if ('posts' in result) {
      const sortedMockPosts = mockPosts.sort((a, b) => b.views - a.views);
      result.posts.forEach((post, index) => {
        expect(post).toEqual(sortedMockPosts[index]);
      });
    }
  });
});

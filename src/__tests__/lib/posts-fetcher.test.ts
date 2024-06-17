import { describe, it, expect, vi } from 'vitest';
import { request } from 'graphql-request';
import { postsFetcher } from '@/lib/posts-fetcher';

vi.mock('graphql-request');

describe('postsFetcher', () => {
  const mockPosts = [
    {
      title: 'Test Title 1',
      brief: 'Brief description 1',
      slug: 'test-title-1',
      publishedAt: '2021-01-01',
      reactionCount: 10,
      replyCount: 2,
      readTimeInMinutes: 5,
      coverImage: 'https://image-url-1'
    },
    {
      title: 'Test Title 2',
      brief: 'Brief description 2',
      slug: 'test-title-2',
      publishedAt: '2021-01-02',
      reactionCount: 20,
      replyCount: 4,
      readTimeInMinutes: 10,
      coverImage: 'https://image-url-2'
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
    const { posts, pageInfo } = await postsFetcher('test_key', '');
    expect(posts).toEqual(mockPosts);
    expect(pageInfo).toEqual({
      endCursor: 'cursor123',
      hasNextPage: true
    });
  });

  it('should correctly handle UserArticlesResponse structure', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);
    const result = await postsFetcher('test_key', '');
    expect(result.posts).toEqual(mockPosts);
    expect(result.pageInfo).toEqual({
      endCursor: 'cursor123',
      hasNextPage: true
    });
  });

  it('should handle empty response gracefully', async () => {
    vi.mocked(request).mockResolvedValueOnce({});
    await expect(postsFetcher('test_key', '')).resolves.toEqual({
      posts: [],
      pageInfo: {
        endCursor: '',
        hasNextPage: false
      }
    });
  });

  it('should throw an error when request fails', async () => {
    vi.mocked(request).mockRejectedValueOnce(new Error('Network error'));
    await expect(postsFetcher('test_key', '')).rejects.toThrow(
      'Error fetching posts'
    );
  });

  it('should correctly map post fields', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);

    const result = await postsFetcher('test_key', '');
    result.posts.forEach((post, index) => {
      expect(post).toHaveProperty('title', mockPosts[index]?.title);
      expect(post).toHaveProperty('brief', mockPosts[index]?.brief);
      expect(post).toHaveProperty('slug', mockPosts[index]?.slug);
      expect(post).toHaveProperty('publishedAt', mockPosts[index]?.publishedAt);
      expect(post).toHaveProperty(
        'reactionCount',
        mockPosts[index]?.reactionCount
      );
      expect(post).toHaveProperty(
        'readTimeInMinutes',
        mockPosts[index]?.readTimeInMinutes
      );
      expect(post).toHaveProperty('coverImage', mockPosts[index]?.coverImage);
      expect(post).toHaveProperty('replyCount', mockPosts[index]?.replyCount);
    });
  });
});

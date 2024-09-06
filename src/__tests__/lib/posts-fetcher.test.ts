import { describe, it, expect, vi } from 'vitest';
import { request } from 'graphql-request';
import {
  fetchPostsList,
  fetchPostDetails,
  Post,
  DetailedPost,
  SinglePostResponse,
  POSTS_PER_PAGE
} from '@/lib/posts-fetcher';

vi.mock('graphql-request');

describe('fetchPostsList', () => {
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
    const result = await fetchPostsList('test_key', '');
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
    const result = await fetchPostsList('test_key', '');
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
    const result = await fetchPostsList('test_key', '');
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error.code).toBe('NETWORK_ERROR');
      expect(result.error.message).toBe(
        'Unable to fetch posts due to a network error. Please check your connection and try again.'
      );
    }
  });

  it('should use POSTS_PER_PAGE constant in the query', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);
    await fetchPostsList('test_key', '');
    const callArguments = vi.mocked(request).mock.calls[0];

    // Check if POSTS_PER_PAGE is used anywhere in the arguments
    const argumentsString = JSON.stringify(callArguments);
    expect(argumentsString).toContain(`"first":${POSTS_PER_PAGE}`);
  });
});

describe('fetchPostDetails', () => {
  const mockDetailedPost: DetailedPost = {
    id: '1',
    slug: 'test-title-1',
    author: {
      id: 'author1',
      username: 'testauthor',
      name: 'Test Author',
      bio: {
        text: 'Author bio'
      },
      profilePicture: 'https://example.com/profile.jpg',
      socialMediaLinks: {
        website: 'https://example.com',
        twitter: 'https://twitter.com/testauthor',
        facebook: 'https://facebook.com/testauthor'
      },
      location: 'Test City'
    },
    title: 'Test Title 1',
    tags: [{ id: 'tag1', name: 'Test Tag', slug: 'test-tag' }],
    brief: 'This is a test post',
    readTimeInMinutes: 5,
    coverImage: {
      url: 'https://example.com/cover.jpg',
      attribution: 'Image by Test Artist'
    },
    content: {
      html: '<p>This is the full content of the post.</p>'
    },
    publishedAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  };

  const mockDetailedResponse: SinglePostResponse = {
    publication: {
      post: mockDetailedPost
    }
  };

  it('should fetch detailed post data and return formatted result', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockDetailedResponse);
    const result = await fetchPostDetails('test-title-1');
    expect('content' in result).toBe(true);
    if ('content' in result) {
      expect(result).toEqual(mockDetailedPost);
    }
  });

  it('should handle post not found', async () => {
    vi.mocked(request).mockResolvedValueOnce({ publication: { post: null } });
    const result = await fetchPostDetails('non-existent-post');
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error.code).toBe('NETWORK_ERROR');
      expect(result.error.message).toBe(
        'Unable to fetch post details due to a network error. Please check your connection and try again.'
      );
    }
  });

  it('should return APIErrorResponse when request fails', async () => {
    vi.mocked(request).mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchPostDetails('test-title-1');
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error.code).toBe('NETWORK_ERROR');
      expect(result.error.message).toBe(
        'Unable to fetch post details due to a network error. Please check your connection and try again.'
      );
    }
  });

  it('should use the correct variables in the query for fetching post details', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockDetailedResponse);
    await fetchPostDetails('test-title-1');
    const callArguments = vi.mocked(request).mock.calls[0];

    // Check if the correct host is used in the arguments
    const argumentsString = JSON.stringify(callArguments);
    expect(argumentsString).toContain('"host":"hn.mrugesh.dev"');

    // Check if the first parameter is set to 3
    expect(argumentsString).toContain('"first":3');

    // Check if after parameter is null
    expect(argumentsString).toContain('"after":null');
  });
});

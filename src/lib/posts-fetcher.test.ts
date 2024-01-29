import { postsFetcher } from './posts-fetcher';
import { request } from 'graphql-request';

jest.mock('graphql-request');

describe('postsFetcher', () => {
  const mockPosts = [
    {
      title: 'Test Title 1',
      brief: 'Brief description 1',
      slug: 'test-title-1',
      totalReactions: 10,
      dateAdded: '2021-01-01',
      popularity: 5,
      replyCount: 2
    },
    {
      title: 'Test Title 2',
      brief: 'Brief description 2',
      slug: 'test-title-2',
      totalReactions: 20,
      dateAdded: '2021-02-01',
      popularity: 10,
      replyCount: 4
    }
  ];

  it('should fetch posts data and return formatted result', async () => {
    (request as jest.Mock).mockResolvedValueOnce({
      user: { publication: { posts: mockPosts } }
    });

    const result = await postsFetcher('test_key', 1);
    expect(result).toEqual(mockPosts);
  });

  it('should throw an error when request fails', async () => {
    (request as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(postsFetcher('test_key', 1)).rejects.toThrow(
      'Error fetching posts'
    );
  });

  it('should return an empty array when no posts are available', async () => {
    (request as jest.Mock).mockResolvedValueOnce({
      user: { publication: { posts: [] } }
    });

    const result = await postsFetcher('test_key', 1);
    expect(result).toEqual([]);
  });

  it('should correctly map post fields', async () => {
    (request as jest.Mock).mockResolvedValueOnce({
      user: { publication: { posts: mockPosts } }
    });

    const result = await postsFetcher('test_key', 1);
    result.forEach((post, index) => {
      expect(post).toHaveProperty('title', mockPosts[index]?.title);
      expect(post).toHaveProperty('brief', mockPosts[index]?.brief);
      expect(post).toHaveProperty('slug', mockPosts[index]?.slug);
      expect(post).toHaveProperty(
        'totalReactions',
        mockPosts[index]?.totalReactions
      );
      expect(post).toHaveProperty('dateAdded', mockPosts[index]?.dateAdded);
      expect(post).toHaveProperty('popularity', mockPosts[index]?.popularity);
      expect(post).toHaveProperty('replyCount', mockPosts[index]?.replyCount);
    });
  });
});

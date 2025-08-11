import { describe, expect, it } from 'vitest';
import { isBlogError, isValidBlogPost, transformBlogPost } from '@/types/blog';
import type { BlogCollectionEntry, BlogPost, TransformedBlogPost } from '@/types/blog';

describe('Blog Type Utilities', () => {
  describe('isBlogError', () => {
    it('returns true for valid BlogError objects', () => {
      expect(isBlogError({ message: 'Error occurred' })).toBe(true);
      expect(isBlogError({ message: 'Error occurred', code: 'ERROR_CODE' })).toBe(true);
    });

    it('returns false for invalid objects', () => {
      expect(isBlogError(null)).toBe(false);
      expect(isBlogError(undefined)).toBe(false);
      expect(isBlogError({})).toBe(false);
      expect(isBlogError({ code: 'ERROR_CODE' })).toBe(false);
      expect(isBlogError({ message: 123 })).toBe(false);
      expect(isBlogError('error string')).toBe(false);
      expect(isBlogError(123)).toBe(false);
      expect(isBlogError([])).toBe(false);
    });
  });

  describe('isValidBlogPost', () => {
    const validPost: BlogPost = {
      id: '1',
      title: 'Test Post',
      slug: 'test-post',
      brief: 'Test brief',
      publishedAt: new Date('2024-01-15'),
      content: {
        html: '<p>Content</p>',
        markdown: '# Content'
      },
      author: {
        id: 'author1',
        username: 'testuser',
        name: 'Test User',
        bio: 'Bio',
        profilePicture: 'https://example.com/pic.jpg',
        socialMediaLinks: {
          website: 'https://example.com',
          twitter: 'https://twitter.com/test',
          facebook: 'https://facebook.com/test'
        },
        location: 'Test City'
      },
      coverImage: {
        url: 'https://example.com/cover.jpg'
      },
      updatedAt: new Date('2024-01-16'),
      readTimeInMinutes: 5,
      views: 100,
      reactionCount: 10,
      replyCount: 3,
      tags: [{ id: 'tag1', name: 'TypeScript', slug: 'typescript' }]
    };

    it('returns true for valid blog posts', () => {
      expect(isValidBlogPost(validPost)).toBe(true);
    });

    it('returns true for posts with minimal required fields', () => {
      const minimalPost: BlogPost = {
        id: '1',
        title: 'Test',
        slug: 'test',
        brief: 'Brief',
        publishedAt: new Date(),
        content: { html: '<p>Content</p>' },
        author: {
          id: 'author1',
          username: 'user',
          name: 'User'
        }
      };
      expect(isValidBlogPost(minimalPost)).toBe(true);
    });

    it('returns false for null or undefined', () => {
      expect(isValidBlogPost(null)).toBe(false);
      expect(isValidBlogPost(undefined)).toBe(false);
    });

    it('returns false for posts missing required fields', () => {
      expect(isValidBlogPost({})).toBe(false);
      expect(isValidBlogPost({ id: '1' })).toBe(false);
      expect(isValidBlogPost({ id: '1', title: 'Test' })).toBe(false);
      expect(
        isValidBlogPost({
          id: '1',
          title: 'Test',
          slug: 'test'
        })
      ).toBe(false);
      expect(
        isValidBlogPost({
          id: '1',
          title: 'Test',
          slug: 'test',
          brief: 'Brief'
        })
      ).toBe(false);
      expect(
        isValidBlogPost({
          id: '1',
          title: 'Test',
          slug: 'test',
          brief: 'Brief',
          publishedAt: new Date()
        })
      ).toBe(false);
      expect(
        isValidBlogPost({
          id: '1',
          title: 'Test',
          slug: 'test',
          brief: 'Brief',
          publishedAt: new Date(),
          content: {} as { html?: string }
        })
      ).toBe(false);
    });
  });

  describe('transformBlogPost', () => {
    it('transforms BlogCollectionEntry to TransformedBlogPost', () => {
      const publishedDate = new Date('2024-01-15T10:00:00Z');
      const mockEntry: BlogCollectionEntry = {
        id: 'post-1',
        collection: 'blog',
        data: {
          id: 'post-1',
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          brief: 'This is a test brief',
          publishedAt: publishedDate,
          readTimeInMinutes: 5,
          views: 150,
          reactionCount: 20,
          replyCount: 8,
          coverImage: {
            url: 'https://example.com/image.jpg'
          },
          author: {
            id: 'author1',
            username: 'testuser',
            name: 'Test User'
          },
          content: {
            html: '<p>Content</p>'
          }
        },
        body: '',
        rendered: {
          html: '<p>Rendered content</p>'
        }
      };

      const result: TransformedBlogPost = transformBlogPost(mockEntry);

      expect(result).toEqual({
        id: 'post-1',
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        brief: 'This is a test brief',
        publishedAt: publishedDate.toISOString(),
        readTimeInMinutes: 5,
        views: 150,
        reactionCount: 20,
        replyCount: 8,
        coverImage: {
          url: 'https://example.com/image.jpg'
        }
      });
    });

    it('handles entries without optional fields', () => {
      const publishedDate = new Date('2024-01-20T10:00:00Z');
      const minimalEntry: BlogCollectionEntry = {
        id: 'post-2',
        collection: 'blog',
        data: {
          id: 'post-2',
          title: 'Minimal Post',
          slug: 'minimal-post',
          brief: 'Minimal brief',
          publishedAt: publishedDate,
          author: {
            id: 'author2',
            username: 'user2',
            name: 'User 2'
          },
          content: {
            html: '<p>Content</p>'
          }
        },
        body: '',
        rendered: {
          html: '<p>Content</p>'
        }
      };

      const result: TransformedBlogPost = transformBlogPost(minimalEntry);

      expect(result).toEqual({
        id: 'post-2',
        title: 'Minimal Post',
        slug: 'minimal-post',
        brief: 'Minimal brief',
        publishedAt: publishedDate.toISOString(),
        readTimeInMinutes: undefined,
        views: undefined,
        reactionCount: undefined,
        replyCount: undefined,
        coverImage: undefined
      });
    });
  });
});

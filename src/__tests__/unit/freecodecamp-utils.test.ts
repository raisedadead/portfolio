import { describe, expect, it } from 'vitest';
import { normalizeFreeCodeCampPosts, normalizeHashnodePosts, mergeAndSortPosts } from '@/lib/freecodecamp-utils';

describe('freeCodeCamp Utils', () => {
  describe('normalizeFreeCodeCampPosts', () => {
    it('normalizes a basic freeCodeCamp post', () => {
      const mockPosts = [
        {
          id: 'test-post-1',
          data: {
            url: 'https://www.freecodecamp.org/news/test-article/',
            title: 'Test Article',
            description: 'This is a test article description',
            content: 'Full content here with many words to test reading time',
            published: new Date('2025-01-15'),
            categories: [
              { label: 'JavaScript', term: 'JavaScript' },
              { label: 'Web Development', term: 'Web Development' }
            ],
            media: [{ url: 'https://cdn.freecodecamp.org/image.jpg' }],
            image: null
          }
        }
      ];

      const result = normalizeFreeCodeCampPosts(mockPosts);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('fcc-test-post-1');
      expect(result[0].data.slug).toBe('test-article');
      expect(result[0].data.title).toBe('Test Article');
      expect(result[0].data.brief).toBe('This is a test article description');
      expect(result[0].data.source).toBe('freecodecamp');
      expect(result[0].data.externalUrl).toBe('https://www.freecodecamp.org/news/test-article/');
      expect(result[0].data.coverImage?.url).toBe('https://cdn.freecodecamp.org/image.jpg');
      expect(result[0].data.tags).toHaveLength(2);
      expect(result[0].data.tags[0]).toEqual({ name: 'JavaScript', slug: 'javascript' });
      expect(result[0].data.tags[1]).toEqual({ name: 'Web Development', slug: 'web-development' });
    });

    it('handles missing fields gracefully', () => {
      const mockPosts = [
        {
          id: 'minimal-post',
          data: {
            url: null,
            title: null,
            description: null,
            content: null,
            published: null,
            categories: null,
            media: null,
            image: null
          }
        }
      ];

      const result = normalizeFreeCodeCampPosts(mockPosts);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('fcc-minimal-post');
      expect(result[0].data.slug).toBe('minimal-post');
      expect(result[0].data.title).toBe('Untitled');
      expect(result[0].data.brief).toBe('');
      expect(result[0].data.source).toBe('freecodecamp');
      expect(result[0].data.externalUrl).toBeUndefined();
      expect(result[0].data.coverImage).toBeUndefined();
      expect(result[0].data.tags).toEqual([]);
      expect(result[0].data.readingTime).toBe(1);
    });

    it('extracts slug from URL correctly', () => {
      const mockPosts = [
        {
          id: 'url-post',
          data: {
            url: 'https://www.freecodecamp.org/news/my-awesome-article/',
            title: 'Title',
            description: 'Desc',
            content: null,
            published: null,
            categories: null,
            media: null,
            image: null
          }
        }
      ];

      const result = normalizeFreeCodeCampPosts(mockPosts);
      expect(result[0].data.slug).toBe('my-awesome-article');
    });

    it('calculates reading time based on word count', () => {
      const longContent = Array(400).fill('word').join(' '); // 400 words = 2 min
      const mockPosts = [
        {
          id: 'long-post',
          data: {
            url: null,
            title: null,
            description: null,
            content: longContent,
            published: null,
            categories: null,
            media: null,
            image: null
          }
        }
      ];

      const result = normalizeFreeCodeCampPosts(mockPosts);
      expect(result[0].data.readingTime).toBe(2);
    });

    it('uses image.url as fallback when media is empty', () => {
      const mockPosts = [
        {
          id: 'fallback-image',
          data: {
            url: null,
            title: null,
            description: null,
            content: null,
            published: null,
            categories: null,
            media: [],
            image: { url: 'https://example.com/fallback.jpg' }
          }
        }
      ];

      const result = normalizeFreeCodeCampPosts(mockPosts);
      expect(result[0].data.coverImage?.url).toBe('https://example.com/fallback.jpg');
    });
  });

  describe('normalizeHashnodePosts', () => {
    it('normalizes Hashnode posts correctly', () => {
      const mockPosts = [
        {
          id: 'hashnode-1',
          data: {
            slug: 'hashnode-article',
            title: 'Hashnode Article',
            brief: 'A brief description',
            coverImage: { url: 'https://cdn.hashnode.com/image.jpg', alt: 'Cover' },
            tags: [{ name: 'Tech', slug: 'tech' }],
            publishedAt: new Date('2025-01-10'),
            readingTime: 5
          }
        }
      ];

      const result = normalizeHashnodePosts(mockPosts);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('hashnode-1');
      expect(result[0].data.slug).toBe('hashnode-article');
      expect(result[0].data.source).toBe('hashnode');
      expect(result[0].data.externalUrl).toBeUndefined();
    });
  });

  describe('mergeAndSortPosts', () => {
    it('merges and sorts posts by date (newest first)', () => {
      const hashnodePosts = [
        {
          id: 'h1',
          data: {
            slug: 'h1',
            title: 'Old Hashnode',
            brief: '',
            tags: [],
            publishedAt: new Date('2025-01-01'),
            readingTime: 1,
            source: 'hashnode' as const
          }
        }
      ];

      const fccPosts = [
        {
          id: 'f1',
          data: {
            slug: 'f1',
            title: 'New FCC',
            brief: '',
            tags: [],
            publishedAt: new Date('2025-01-15'),
            readingTime: 1,
            source: 'freecodecamp' as const
          }
        }
      ];

      const result = mergeAndSortPosts(hashnodePosts, fccPosts);

      expect(result).toHaveLength(2);
      expect(result[0].data.title).toBe('New FCC');
      expect(result[1].data.title).toBe('Old Hashnode');
    });

    it('handles empty arrays', () => {
      const result = mergeAndSortPosts([], []);
      expect(result).toEqual([]);
    });

    it('handles single source', () => {
      const posts = [
        {
          id: '1',
          data: {
            slug: '1',
            title: 'Only Post',
            brief: '',
            tags: [],
            publishedAt: new Date('2025-01-01'),
            readingTime: 1,
            source: 'hashnode' as const
          }
        }
      ];

      const result = mergeAndSortPosts(posts);
      expect(result).toHaveLength(1);
    });
  });
});

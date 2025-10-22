import { describe, expect, it } from 'vitest';
import { getAllTags, filterPostsByTag, getTagBySlug, getBentoGridSpan } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';

describe('Blog Utils', () => {
  const mockPosts: BlogPost[] = [
    {
      id: 'post-1',
      data: {
        slug: 'first-blog-post',
        title: 'First Blog Post',
        brief: 'This is the first post',
        content: { html: '<p>Content 1</p>' },
        author: { name: 'Author 1' },
        tags: [
          { name: 'TypeScript', slug: 'typescript' },
          { name: 'Tutorial', slug: 'tutorial' }
        ],
        publishedAt: new Date('2025-03-01'),
        readingTime: 5
      }
    },
    {
      id: 'post-2',
      data: {
        slug: 'second-blog-post',
        title: 'Second Blog Post',
        brief: 'This is the second post',
        content: { html: '<p>Content 2</p>' },
        author: { name: 'Author 2' },
        tags: [
          { name: 'React', slug: 'react' },
          { name: 'Tutorial', slug: 'tutorial' }
        ],
        publishedAt: new Date('2025-02-15'),
        readingTime: 8
      }
    },
    {
      id: 'post-3',
      data: {
        slug: 'third-blog-post',
        title: 'Third Blog Post',
        brief: 'This is the third post',
        content: { html: '<p>Content 3</p>' },
        author: { name: 'Author 3' },
        tags: [
          { name: 'TypeScript', slug: 'typescript' },
          { name: 'Advanced', slug: 'advanced' }
        ],
        publishedAt: new Date('2025-01-20'),
        readingTime: 6
      }
    }
  ];

  describe('getBentoGridSpan', () => {
    it('returns correct span configuration for index 0', () => {
      const result = getBentoGridSpan(0);
      expect(result).toEqual({
        desktop: 'lg:col-span-3',
        aspectClass: 'aspect-16/9',
        aspectRatio: '16/9',
        height: 'h-64'
      });
    });

    it('returns correct span configuration for index 1', () => {
      const result = getBentoGridSpan(1);
      expect(result).toEqual({
        desktop: 'lg:col-span-2',
        aspectClass: 'aspect-4/3',
        aspectRatio: '4/3',
        height: 'h-48'
      });
    });

    it('cycles through patterns correctly', () => {
      const result0 = getBentoGridSpan(0);
      const result6 = getBentoGridSpan(6); // Should be same as index 0
      expect(result0).toEqual(result6);
    });

    it('returns valid CSS classes', () => {
      const result = getBentoGridSpan(0);
      expect(result.desktop).toMatch(/^lg:col-span-\d+$/);
      expect(result.aspectClass).toMatch(/^aspect-\d+\/\d+$/);
      expect(result.height).toMatch(/^h-\d+$/);
    });
  });

  describe('getAllTags', () => {
    it('extracts all unique tags from posts', () => {
      const tags = getAllTags(mockPosts);
      const tagNames = tags.map((tag) => tag.name).sort();

      expect(tagNames).toEqual(['Advanced', 'React', 'Tutorial', 'TypeScript']);
    });

    it('removes duplicate tags across posts', () => {
      const postsWithDuplicates = [
        ...mockPosts,
        {
          ...mockPosts[0],
          id: 'post-4',
          data: {
            ...mockPosts[0].data,
            slug: 'duplicate-post',
            tags: [{ name: 'TypeScript', slug: 'typescript' }] // Duplicate
          }
        }
      ];

      const tags = getAllTags(postsWithDuplicates);
      const typescriptTags = tags.filter((tag) => tag.slug === 'typescript');
      expect(typescriptTags).toHaveLength(1);
    });

    it('sorts tags alphabetically by name', () => {
      const tags = getAllTags(mockPosts);
      const tagNames = tags.map((tag) => tag.name);

      expect(tagNames).toEqual(['Advanced', 'React', 'Tutorial', 'TypeScript']);
    });

    it('returns empty array for posts with no tags', () => {
      const postsWithoutTags: BlogPost[] = [
        {
          ...mockPosts[0],
          data: { ...mockPosts[0].data, tags: [] }
        }
      ];

      const tags = getAllTags(postsWithoutTags);
      expect(tags).toEqual([]);
    });

    it('handles empty posts array', () => {
      const tags = getAllTags([]);
      expect(tags).toEqual([]);
    });

    it('preserves tag structure', () => {
      const tags = getAllTags(mockPosts);
      const typescriptTag = tags.find((tag) => tag.slug === 'typescript');

      expect(typescriptTag).toEqual({
        name: 'TypeScript',
        slug: 'typescript'
      });
    });
  });

  describe('filterPostsByTag', () => {
    it('filters posts by tag slug correctly', () => {
      const typescriptPosts = filterPostsByTag(mockPosts, 'typescript');
      expect(typescriptPosts).toHaveLength(2);
      expect(typescriptPosts.map((p) => p.id)).toEqual(['post-1', 'post-3']);
    });

    it('returns single post for unique tag', () => {
      const reactPosts = filterPostsByTag(mockPosts, 'react');
      expect(reactPosts).toHaveLength(1);
      expect(reactPosts[0].id).toBe('post-2');
    });

    it('returns empty array for non-existent tag', () => {
      const nonexistentPosts = filterPostsByTag(mockPosts, 'nonexistent');
      expect(nonexistentPosts).toEqual([]);
    });

    it('returns all matching posts for shared tag', () => {
      const tutorialPosts = filterPostsByTag(mockPosts, 'tutorial');
      expect(tutorialPosts).toHaveLength(2);
      expect(tutorialPosts.map((p) => p.id).sort()).toEqual(['post-1', 'post-2']);
    });

    it('handles empty posts array', () => {
      const result = filterPostsByTag([], 'typescript');
      expect(result).toEqual([]);
    });

    it('preserves original post objects', () => {
      const typescriptPosts = filterPostsByTag(mockPosts, 'typescript');
      const originalPost = mockPosts.find((p) => p.id === 'post-1');
      const filteredPost = typescriptPosts.find((p) => p.id === 'post-1');

      expect(filteredPost).toEqual(originalPost);
    });
  });

  describe('getTagBySlug', () => {
    it('finds tag by slug correctly', () => {
      const tag = getTagBySlug(mockPosts, 'typescript');
      expect(tag).toEqual({
        name: 'TypeScript',
        slug: 'typescript'
      });
    });

    it('returns undefined for non-existent tag slug', () => {
      const tag = getTagBySlug(mockPosts, 'nonexistent');
      expect(tag).toBeUndefined();
    });

    it('handles empty posts array', () => {
      const tag = getTagBySlug([], 'typescript');
      expect(tag).toBeUndefined();
    });

    it('finds tag from posts with no matching tags', () => {
      const postsWithoutTypeScript = mockPosts.filter((p) => !p.data.tags.some((t) => t.slug === 'typescript'));
      const tag = getTagBySlug(postsWithoutTypeScript, 'typescript');
      expect(tag).toBeUndefined();
    });
  });

  describe('Integration Tests', () => {
    it('getAllTags and filterPostsByTag work together correctly', () => {
      const allTags = getAllTags(mockPosts);

      allTags.forEach((tag) => {
        const filteredPosts = filterPostsByTag(mockPosts, tag.slug);
        expect(filteredPosts.length).toBeGreaterThan(0);

        // Verify all filtered posts contain the tag
        filteredPosts.forEach((post) => {
          expect(post.data.tags.some((t) => t.slug === tag.slug)).toBe(true);
        });
      });
    });

    it('getTagBySlug returns tags that can be used with filterPostsByTag', () => {
      const tag = getTagBySlug(mockPosts, 'tutorial');
      expect(tag).toBeDefined();

      if (tag) {
        const filteredPosts = filterPostsByTag(mockPosts, tag.slug);
        expect(filteredPosts.length).toBeGreaterThan(0);
      }
    });

    it('tag extraction preserves slug-to-name mapping', () => {
      const allTags = getAllTags(mockPosts);
      const slugMap = new Map(allTags.map((tag) => [tag.slug, tag.name]));

      expect(slugMap.get('typescript')).toBe('TypeScript');
      expect(slugMap.get('react')).toBe('React');
      expect(slugMap.get('tutorial')).toBe('Tutorial');
      expect(slugMap.get('advanced')).toBe('Advanced');
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { getTagsWithCount, getAllTags, filterPostsByTag, getTagBySlug } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';

describe('Tag utility functions - edge cases and performance', () => {
  let mockPosts: BlogPost[];

  beforeEach(() => {
    mockPosts = [
      {
        id: '1',
        data: {
          slug: 'post-1',
          title: 'First Post',
          brief: 'Brief 1',
          content: { html: '<p>Content 1</p>' },
          author: { name: 'Author 1' },
          tags: [
            { name: 'JavaScript', slug: 'javascript' },
            { name: 'React', slug: 'react' },
            { name: 'Node.js', slug: 'node-js' } // Special character in slug
          ],
          publishedAt: new Date('2024-01-01'),
          readingTime: 5
        }
      },
      {
        id: '2',
        data: {
          slug: 'post-2',
          title: 'Second Post',
          brief: 'Brief 2',
          content: { html: '<p>Content 2</p>' },
          author: { name: 'Author 2' },
          tags: [
            { name: 'JavaScript', slug: 'javascript' },
            { name: 'Vue.js', slug: 'vue.js' }, // Special character (dot) in slug
            { name: 'Next/Nuxt', slug: 'next-nuxt' } // Special character (slash) in name
          ],
          publishedAt: new Date('2024-01-02'),
          readingTime: 3
        }
      },
      {
        id: '3',
        data: {
          slug: 'post-3',
          title: 'Third Post',
          brief: 'Brief 3',
          content: { html: '<p>Content 3</p>' },
          author: { name: 'Author 3' },
          tags: [], // Post with no tags
          publishedAt: new Date('2024-01-03'),
          readingTime: 7
        }
      }
    ];
  });

  describe('getTagsWithCount', () => {
    it('handles tags with special characters in slugs', () => {
      const tagsWithCount = getTagsWithCount(mockPosts);

      const nodeTag = tagsWithCount.find((t) => t.slug === 'node-js');
      expect(nodeTag).toBeDefined();
      expect(nodeTag?.count).toBe(1);

      const vueTag = tagsWithCount.find((t) => t.slug === 'vue.js');
      expect(vueTag).toBeDefined();
      expect(vueTag?.count).toBe(1);
    });

    it('correctly counts tags across multiple posts', () => {
      const tagsWithCount = getTagsWithCount(mockPosts);

      const jsTag = tagsWithCount.find((t) => t.slug === 'javascript');
      expect(jsTag?.count).toBe(2);

      const reactTag = tagsWithCount.find((t) => t.slug === 'react');
      expect(reactTag?.count).toBe(1);
    });

    it('returns empty array when no posts have tags', () => {
      const postsWithoutTags: BlogPost[] = [
        {
          id: '1',
          data: {
            slug: 'no-tags',
            title: 'No Tags Post',
            brief: 'Brief',
            content: { html: '<p>Content</p>' },
            author: { name: 'Author' },
            tags: [],
            publishedAt: new Date(),
            readingTime: 5
          }
        }
      ];

      const result = getTagsWithCount(postsWithoutTags);
      expect(result).toEqual([]);
    });

    it('returns empty array for empty post array', () => {
      const result = getTagsWithCount([]);
      expect(result).toEqual([]);
    });

    it('sorts tags alphabetically by name', () => {
      const tagsWithCount = getTagsWithCount(mockPosts);
      const tagNames = tagsWithCount.map((t) => t.name);

      const sortedNames = [...tagNames].sort((a, b) => a.localeCompare(b));
      expect(tagNames).toEqual(sortedNames);
    });

    it('handles tags with special characters in names', () => {
      const tagsWithCount = getTagsWithCount(mockPosts);

      const nextNuxtTag = tagsWithCount.find((t) => t.name === 'Next/Nuxt');
      expect(nextNuxtTag).toBeDefined();
      expect(nextNuxtTag?.count).toBe(1);
    });
  });

  describe('filterPostsByTag', () => {
    it('filters posts with special character tags', () => {
      const nodePosts = filterPostsByTag(mockPosts, 'node-js');
      expect(nodePosts).toHaveLength(1);
      expect(nodePosts[0].id).toBe('1');

      const vuePosts = filterPostsByTag(mockPosts, 'vue.js');
      expect(vuePosts).toHaveLength(1);
      expect(vuePosts[0].id).toBe('2');
    });

    it('returns empty array for non-existent tag', () => {
      const result = filterPostsByTag(mockPosts, 'non-existent-tag');
      expect(result).toEqual([]);
    });

    it('handles empty slug gracefully', () => {
      const result = filterPostsByTag(mockPosts, '');
      expect(result).toEqual([]);
    });

    it('is case-sensitive for tag slugs', () => {
      const lowercase = filterPostsByTag(mockPosts, 'javascript');
      const uppercase = filterPostsByTag(mockPosts, 'JavaScript');

      expect(lowercase).toHaveLength(2);
      expect(uppercase).toHaveLength(0);
    });
  });

  describe('getTagBySlug', () => {
    it('finds tags with special characters', () => {
      const nodeTag = getTagBySlug(mockPosts, 'node-js');
      expect(nodeTag).toBeDefined();
      expect(nodeTag?.name).toBe('Node.js');

      const vueTag = getTagBySlug(mockPosts, 'vue.js');
      expect(vueTag).toBeDefined();
      expect(vueTag?.name).toBe('Vue.js');
    });

    it('returns undefined for non-existent tag', () => {
      const result = getTagBySlug(mockPosts, 'non-existent');
      expect(result).toBeUndefined();
    });

    it('returns first occurrence when multiple posts have the same tag', () => {
      const jsTag = getTagBySlug(mockPosts, 'javascript');
      expect(jsTag).toBeDefined();
      expect(jsTag?.name).toBe('JavaScript');
    });
  });

  describe('Performance tests', () => {
    it('handles large number of posts efficiently', () => {
      const largeMockPosts: BlogPost[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `post-${i}`,
        data: {
          slug: `post-${i}`,
          title: `Post ${i}`,
          brief: `Brief ${i}`,
          content: { html: `<p>Content ${i}</p>` },
          author: { name: `Author ${i}` },
          tags: [
            { name: `Tag ${i % 50}`, slug: `tag-${i % 50}` },
            { name: `Category ${i % 20}`, slug: `category-${i % 20}` }
          ],
          publishedAt: new Date(),
          readingTime: 5
        }
      }));

      const startTime = performance.now();
      const tagsWithCount = getTagsWithCount(largeMockPosts);
      const endTime = performance.now();

      // Should complete in less than 100ms for 1000 posts
      expect(endTime - startTime).toBeLessThan(100);

      // Should have deduplicated tags correctly
      expect(tagsWithCount.length).toBe(70); // 50 tags + 20 categories

      // Each tag should have correct count
      const tag0 = tagsWithCount.find((t) => t.slug === 'tag-0');
      expect(tag0?.count).toBe(20); // 1000 / 50 = 20
    });

    it('getTagsWithCount performs single pass through posts', () => {
      let iterationCount = 0;
      const instrumentedPosts = mockPosts.map((post) => ({
        ...post,
        data: {
          ...post.data,
          get tags() {
            iterationCount++;
            return post.data.tags;
          }
        }
      }));

      getTagsWithCount(instrumentedPosts as BlogPost[]);

      // Should only iterate through posts once
      expect(iterationCount).toBe(mockPosts.length);
    });
  });

  describe('Edge cases with malformed data', () => {
    it('handles posts with duplicate tags within a single post', () => {
      // Note: This is testing behavior with malformed data (duplicate tags in a single post)
      // The function doesn't deduplicate tags within a single post, which is reasonable
      // since this should be prevented at the data entry level
      const postsWithDuplicates: BlogPost[] = [
        {
          id: '1',
          data: {
            slug: 'duplicate-tags',
            title: 'Post with Duplicates',
            brief: 'Brief',
            content: { html: '<p>Content</p>' },
            author: { name: 'Author' },
            tags: [
              { name: 'JavaScript', slug: 'javascript' },
              { name: 'JavaScript', slug: 'javascript' }, // Duplicate
              { name: 'JavaScript', slug: 'javascript' } // Another duplicate
            ],
            publishedAt: new Date(),
            readingTime: 5
          }
        }
      ];

      const tagsWithCount = getTagsWithCount(postsWithDuplicates);
      const jsTag = tagsWithCount.find((t) => t.slug === 'javascript');

      // The function doesn't dedupe within a single post's tags array
      // It counts how many times the tag appears across the post's tags
      expect(jsTag).toBeDefined();
      expect(tagsWithCount).toHaveLength(1);
      // The actual behavior is that it increments for each occurrence
      expect(jsTag?.count).toBe(3);
    });

    it('handles tags with empty or whitespace names', () => {
      const postsWithEmptyTags: BlogPost[] = [
        {
          id: '1',
          data: {
            slug: 'empty-tags',
            title: 'Post with Empty Tags',
            brief: 'Brief',
            content: { html: '<p>Content</p>' },
            author: { name: 'Author' },
            tags: [
              { name: '', slug: 'empty' },
              { name: '   ', slug: 'whitespace' },
              { name: 'Valid', slug: 'valid' }
            ],
            publishedAt: new Date(),
            readingTime: 5
          }
        }
      ];

      const tags = getAllTags(postsWithEmptyTags);

      // Should include all tags, even empty ones
      expect(tags).toHaveLength(3);
    });
  });
});

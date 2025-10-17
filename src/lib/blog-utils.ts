import type { BlogPost, Tag } from '@/types/blog';

/**
 * Calculates grid span properties for bento-grid blog layout
 * Pattern repeats every 6 cards with alternating large/small spans
 */

interface GridSpanResult {
  desktop: string;
  aspectClass: string; // CSS class for styling the container
  aspectRatio: string; // Numeric ratio for calculating image dimensions
  height: string;
}

/**
 * Get grid span configuration for a card at given index
 * @param index - Zero-based card position
 * @returns Grid span classes for desktop, aspect ratio (both CSS and numeric), and height
 */
export function getBentoGridSpan(index: number): GridSpanResult {
  const patterns: GridSpanResult[] = [
    { desktop: 'lg:col-span-3', aspectClass: 'aspect-16/9', aspectRatio: '16/9', height: 'h-64' },
    { desktop: 'lg:col-span-2', aspectClass: 'aspect-4/3', aspectRatio: '4/3', height: 'h-48' },
    { desktop: 'lg:col-span-5', aspectClass: 'aspect-21/9', aspectRatio: '21/9', height: 'h-56' },
    { desktop: 'lg:col-span-2', aspectClass: 'aspect-3/2', aspectRatio: '3/2', height: 'h-48' },
    { desktop: 'lg:col-span-3', aspectClass: 'aspect-3/4', aspectRatio: '3/4', height: 'h-64' },
    { desktop: 'lg:col-span-5', aspectClass: 'aspect-2/1', aspectRatio: '2/1', height: 'h-40' }
  ];

  return patterns[index % 6];
}

/**
 * Extracts all unique tags from a collection of blog posts
 * @param posts - Array of blog posts
 * @returns Array of unique tags sorted by name
 */
export function getAllTags(posts: BlogPost[]): Tag[] {
  const tagMap = new Map<string, Tag>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      if (!tagMap.has(tag.slug)) {
        tagMap.set(tag.slug, tag);
      }
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Tag with post count for performance optimization
 */
export interface TagWithCount extends Tag {
  count: number;
}

/**
 * Gets all unique tags with their post counts in a single pass
 * @param posts - Array of blog posts
 * @returns Array of tags with counts, sorted by name
 */
export function getTagsWithCount(posts: BlogPost[]): TagWithCount[] {
  const tagCountMap = new Map<string, { tag: Tag; count: number }>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const existing = tagCountMap.get(tag.slug);
      if (existing) {
        existing.count++;
      } else {
        tagCountMap.set(tag.slug, { tag, count: 1 });
      }
    });
  });

  return Array.from(tagCountMap.values())
    .map(({ tag, count }) => ({ ...tag, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filters blog posts by a specific tag slug
 * @param posts - Array of blog posts
 * @param tagSlug - The tag slug to filter by
 * @returns Array of posts that contain the specified tag
 */
export function filterPostsByTag(posts: BlogPost[], tagSlug: string): BlogPost[] {
  return posts.filter((post) => post.data.tags.some((tag) => tag.slug === tagSlug));
}

/**
 * Gets the tag object by slug from a collection of posts
 * @param posts - Array of blog posts
 * @param tagSlug - The tag slug to find
 * @returns The tag object if found, undefined otherwise
 */
export function getTagBySlug(posts: BlogPost[], tagSlug: string): Tag | undefined {
  const allTags = getAllTags(posts);
  return allTags.find((tag) => tag.slug === tagSlug);
}

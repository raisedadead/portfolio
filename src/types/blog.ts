/**
 * Shared TypeScript types for blog functionality
 * Provides type safety across Astro content collections and React components
 */

import type { CollectionEntry } from 'astro:content';
import type { BlogPost } from '@/content.config';

// Astro content collection types
export type BlogCollectionEntry = CollectionEntry<'blog'>;
export type { BlogPost };

/**
 * Transformed blog post data for client-side components
 * Matches the structure expected by BlogPostCard and other UI components
 */
export interface TransformedBlogPost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  publishedAt: string; // ISO string for serialization
  readTimeInMinutes?: number;
  views?: number;
  reactionCount?: number;
  replyCount?: number;
  coverImage?: {
    url: string;
  };
}

/**
 * Error handling types for blog operations
 */
export interface BlogError {
  message: string;
  code?: string;
}

/**
 * Props for Astro page components
 */
export interface BlogSlugPageProps {
  post: BlogCollectionEntry;
}

/**
 * Type guard to check if a value is a BlogError
 */
export function isBlogError(value: unknown): value is BlogError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as BlogError).message === 'string'
  );
}

/**
 * Validates that a blog post has all required fields for display
 */
export function isValidBlogPost(post: Partial<BlogPost> | null | undefined): post is BlogPost {
  return !!(post && post.id && post.title && post.slug && post.brief && post.publishedAt && post.content?.html);
}

/**
 * Transform a BlogCollectionEntry to TransformedBlogPost
 * Safely converts Astro collection data to client-safe format
 */
export function transformBlogPost(entry: BlogCollectionEntry): TransformedBlogPost {
  return {
    id: entry.id,
    title: entry.data.title,
    slug: entry.data.slug,
    brief: entry.data.brief,
    publishedAt: entry.data.publishedAt.toISOString(),
    readTimeInMinutes: entry.data.readTimeInMinutes,
    views: entry.data.views,
    reactionCount: entry.data.reactionCount,
    replyCount: entry.data.replyCount,
    coverImage: entry.data.coverImage
  };
}

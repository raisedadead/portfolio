import type { LightweightPost } from '@/types/blog';

interface FreeCodeCampPostData {
  id: string;
  data: {
    url?: string | null;
    title?: string | null;
    description?: string | null;
    content?: string | null;
    published?: Date | null;
    media?: Array<{ url?: string | null }> | null;
    image?: { url?: string | null } | null;
    categories?: Array<{ label: string; term: string }> | null;
  };
}

/**
 * Normalizes freeCodeCamp RSS feed posts to LightweightPost format
 * @param posts - Raw freeCodeCamp posts from the content collection
 * @returns Array of normalized LightweightPost objects
 */
export function normalizeFreeCodeCampPosts(posts: FreeCodeCampPostData[]): LightweightPost[] {
  return posts.map((post) => {
    // Extract slug from URL (last part of the path)
    const urlPath = post.data.url || '';
    const slug = urlPath.split('/').filter(Boolean).pop() || post.id;

    // Get cover image from media array (freeCodeCamp uses media:content)
    const mediaImage = post.data.media?.[0]?.url;
    const imageData = post.data.image;
    const coverImageUrl = mediaImage || imageData?.url;

    // Convert categories to tags format
    const tags =
      post.data.categories?.map((cat: { label: string; term: string }) => ({
        name: cat.label,
        slug: cat.term.toLowerCase().replace(/\s+/g, '-')
      })) || [];

    // Estimate reading time (average 200 words per minute)
    const content = post.data.content || post.data.description || '';
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: `fcc-${post.id}`,
      data: {
        slug: slug,
        title: post.data.title || 'Untitled',
        brief: post.data.description || '',
        coverImage: coverImageUrl ? { url: coverImageUrl } : undefined,
        tags,
        publishedAt: post.data.published || new Date(),
        readingTime,
        source: 'freecodecamp' as const,
        externalUrl: post.data.url || undefined
      }
    };
  });
}

/**
 * Merges and sorts posts from multiple sources by date (newest first)
 * @param postArrays - Arrays of LightweightPost to merge
 * @returns Sorted array of all posts
 */
export function mergeAndSortPosts(...postArrays: LightweightPost[][]): LightweightPost[] {
  return postArrays
    .flat()
    .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());
}

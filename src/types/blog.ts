export interface CoverImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Author {
  name: string;
  profilePicture?: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export type PostSource = 'local' | 'freecodecamp';

/**
 * Common interface for posts with tags - used by utility functions
 * Both BlogPost and LightweightPost satisfy this interface
 */
export interface PostWithTags {
  id: string;
  data: {
    tags: Array<Tag>;
  };
}

export interface BlogPost {
  id: string;
  data: {
    slug: string;
    title: string;
    brief: string;
    content: {
      html: string;
    };
    coverImage?: CoverImage;
    author: Author;
    tags: Array<Tag>;
    publishedAt: Date;
    readingTime: number;
    externalUrl?: string;
    seo?: {
      title?: string;
      description?: string;
    };
  };
}

/**
 * Lightweight version of BlogPost for blog listing pages
 * Omits heavy fields like content.html to reduce serialization overhead
 */
export interface LightweightPost {
  id: string;
  data: {
    slug: string;
    title: string;
    brief: string;
    coverImage?: CoverImage;
    tags: Array<Tag>;
    publishedAt: Date;
    readingTime: number;
    source: PostSource;
    externalUrl?: string;
  };
}

export interface CoverImage {
  url: string;
  alt?: string;
  optimizedUrl?: string;
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

export interface ImageDimensions {
  mobile: { width: number; height: number };
  tablet: { width: number; height: number };
  desktop: { width: number; height: number };
  aspectRatio: string;
}

export interface OptimizationMetadata {
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
  transformedAt?: Date;
  fallbackUsed: boolean;
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
    tags: Tag[];
    publishedAt: Date;
    readingTime: number;
    hashnodeUrl?: string;
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
    tags: Tag[];
    publishedAt: Date;
    readingTime: number;
  };
}

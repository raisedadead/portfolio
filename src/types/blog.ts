export interface CoverImage {
  url: string;
  alt?: string;
}

export interface Author {
  name: string;
  profilePicture?: string;
}

export interface Tag {
  name: string;
  slug: string;
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

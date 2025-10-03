import type { BlogPost } from '@/types/blog';

/**
 * Creates a mock blog post for testing
 */
export function createMockPost(overrides: Partial<BlogPost> = {}): BlogPost {
  const id = overrides.id || `post-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    data: {
      slug: 'test-blog-post',
      title: 'Test Blog Post',
      brief: 'This is a test blog post description',
      content: {
        html: '<p>Test content</p>'
      },
      coverImage: {
        url: 'https://example.com/image.jpg',
        alt: 'Test image'
      },
      author: {
        name: 'Test Author',
        profilePicture: 'https://example.com/author.jpg'
      },
      tags: [
        { name: 'Test', slug: 'test' },
        { name: 'TypeScript', slug: 'typescript' }
      ],
      publishedAt: new Date('2025-01-01'),
      readingTime: 5,
      hashnodeUrl: 'https://example.com/post',
      seo: {
        title: 'Test Post - SEO Title',
        description: 'Test post SEO description'
      }
    },
    ...overrides
  };
}

/**
 * Creates an array of mock blog posts
 */
export function createMockPosts(count: number): BlogPost[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPost({
      id: `post-${i}`,
      data: {
        slug: `test-post-${i + 1}`,
        title: `Test Post ${i + 1}`,
        brief: `This is test post number ${i + 1}`,
        content: {
          html: `<p>Content for post ${i + 1}</p>`
        },
        coverImage: {
          url: `https://example.com/image-${i}.jpg`,
          alt: `Test image ${i}`
        },
        author: {
          name: 'Test Author',
          profilePicture: 'https://example.com/author.jpg'
        },
        tags: [{ name: 'Test', slug: 'test' }],
        publishedAt: new Date(`2025-01-${String(i + 1).padStart(2, '0')}`),
        readingTime: 5,
        hashnodeUrl: `https://example.com/post-${i}`,
        seo: {
          title: `Test Post ${i + 1} - SEO`,
          description: `SEO description for post ${i + 1}`
        }
      }
    })
  );
}

/**
 * Creates a mock post without a cover image
 */
export function createMockPostWithoutImage(): BlogPost {
  const post = createMockPost();
  return {
    ...post,
    data: {
      ...post.data,
      coverImage: undefined
    }
  };
}

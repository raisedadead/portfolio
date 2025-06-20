import type { LoaderResult } from 'astro';

interface HashnodePost {
  title: string;
  brief: string;
  content: {
    html: string;
  };
  publishedAt: string;
  updatedAt?: string;
  coverImage?: {
    url: string;
    alt?: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
  author: {
    name: string;
    username: string;
    profilePicture?: string;
  };
  readingTime: number;
  slug: string;
}

interface HashnodeLoaderOptions {
  publicationHost: string;
  token?: string;
  maxPosts?: number;
}

interface GraphQLResponse {
  data?: {
    publication?: {
      posts?: {
        edges?: Array<{
          node: HashnodePost;
        }>;
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export function hashnodeLoader(options: HashnodeLoaderOptions) {
  return async function load(): Promise<LoaderResult> {
    const { publicationHost, token } = options;

    if (!publicationHost) {
      throw new Error('publicationHost is required');
    }

    // Basic GraphQL query for posts
    const query = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: $maxPosts) {
            edges {
              node {
                title
                brief
                content {
                  html
                }
                publishedAt
                updatedAt
                coverImage {
                  url
                  alt
                }
                tags {
                  name
                  slug
                }
                author {
                  name
                  username
                  profilePicture
                }
                readingTime
                slug
              }
            }
          }
        }
      }
    `;

    try {
      // Fetch posts from Hashnode API
      const response = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify({
          query,
          variables: {
            host: publicationHost
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as GraphQLResponse;

      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors.map((e) => e.message).join(', ')}`);
      }

      const posts = result.data?.publication?.posts?.edges?.map((edge) => edge.node) || [];

      // Transform posts into the expected format
      return {
        data: posts.map((post: HashnodePost) => ({
          ...post,
          id: post.slug
        }))
      };
    } catch (error) {
      console.error('Error fetching Hashnode posts:', error);
      // Return empty data array on error
      return {
        data: []
      };
    }
  };
}

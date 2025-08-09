export const POSTS_PER_PAGE = 3;

export interface Post {
  title: string;
  brief: string;
  views: number;
  slug: string;
  publishedAt: string;
  reactionCount: number;
  replyCount: number;
  readTimeInMinutes: number;
  coverImage: {
    url: string;
  };
}

export interface DetailedPost {
  id: string;
  slug: string;
  author: {
    id: string;
    username: string;
    name: string;
    bio: {
      text: string;
    };
    profilePicture: string;
    socialMediaLinks: {
      website?: string;
      twitter?: string;
      facebook?: string;
    };
    location?: string;
  };
  title: string;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  brief: string;
  readTimeInMinutes: number;
  coverImage: {
    url: string;
    attribution?: string;
  };
  content: {
    html: string;
  };
  publishedAt: string;
  updatedAt: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface ResponseData {
  posts: Post[];
  pageInfo: PageInfo;
}

export interface APIErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

const HASHNODE_API_URL = 'https://gql.hashnode.com';
const HASHNODE_HOST = 'hn.mrugesh.dev';

const postFieldsFragment = `
  fragment PostFields on Post {
    title
    brief
    views
    slug
    publishedAt
    reactionCount
    readTimeInMinutes
    replyCount
    coverImage {
      url
    }
  }
`;

const getUserArticlesQuery = `
  ${postFieldsFragment}
  query PostsByPublication($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      id
      posts(first: $first, after: $after) {
        edges {
          node {
            ...PostFields
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const getDetailedPostQuery = `
  query GetDetailedPost($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id
        slug
        author {
          id
          username
          name
          bio {
            text
          }
          profilePicture
          socialMediaLinks {
            website
            twitter
            facebook
          }
          location
        }
        title
        tags {
          id
          name
          slug
        }
        brief
        readTimeInMinutes
        coverImage {
          url
          attribution
        }
        content {
          html
        }
        publishedAt
        updatedAt
      }
    }
  }
`;

interface UserArticlesResponse {
  publication: {
    posts: {
      edges: Array<{
        node: Post;
      }>;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}

interface SinglePostResponse {
  publication: {
    post: DetailedPost;
  };
}

export async function fetchPostsList(
  _key: string,
  pageCursor = '',
  first: number = POSTS_PER_PAGE
): Promise<ResponseData | APIErrorResponse> {
  try {
    const response = await fetch(HASHNODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: getUserArticlesQuery,
        variables: {
          host: HASHNODE_HOST,
          first,
          after: pageCursor || null
        }
      })
    });

    const result = (await response.json()) as {
      data?: UserArticlesResponse;
      errors?: Array<{ message: string }>;
    };

    if (result.errors) {
      return {
        error: {
          message: 'Unable to fetch posts due to a GraphQL error. Please try again later.',
          code: 'GRAPHQL_ERROR'
        }
      };
    }

    const posts = result.data?.publication?.posts?.edges.map(({ node }) => node) || [];

    // Sort posts by views in descending order
    posts.sort((a, b) => b.views - a.views);

    const pageInfo = {
      endCursor: result.data?.publication?.posts?.pageInfo?.endCursor || '',
      hasNextPage: result.data?.publication?.posts?.pageInfo?.hasNextPage || false
    };

    return {
      posts,
      pageInfo
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('fetch')) {
      return {
        error: {
          message: 'Unable to fetch posts due to a network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR'
        }
      };
    }

    return {
      error: {
        message: 'An unexpected error occurred while fetching posts. Please try again later.',
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}

export async function fetchPostDetails(slug: string): Promise<DetailedPost | APIErrorResponse> {
  try {
    const response = await fetch(HASHNODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: getDetailedPostQuery,
        variables: {
          slug,
          host: HASHNODE_HOST
        }
      })
    });

    const result = (await response.json()) as {
      data?: SinglePostResponse;
      errors?: Array<{ message: string }>;
    };

    if (result.errors) {
      return {
        error: {
          message: 'Unable to fetch post details due to a GraphQL error. Please try again later.',
          code: 'GRAPHQL_ERROR'
        }
      };
    }

    const post = result.data?.publication?.post;

    if (!post) {
      return {
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      };
    }

    return post;
  } catch (error) {
    if (error instanceof Error && error.message.includes('fetch')) {
      return {
        error: {
          message: 'Unable to fetch post details due to a network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR'
        }
      };
    }

    return {
      error: {
        message: 'An unexpected error occurred while fetching post details. Please try again later.',
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}

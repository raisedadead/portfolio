import { gql, request, ClientError } from 'graphql-request';
export const POSTS_PER_PAGE = 3;

export type Post = {
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
};

export type ResponseData = {
  posts: Post[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
};

export type APIErrorResponse = {
  error: {
    message: string;
    code: string;
  };
};
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

const postFieldsFragment = gql`
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

const getUserArticlesQuery = gql`
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

export const fetchPostsList = async (
  _key: string,
  pageCursor = '',
  first: number = POSTS_PER_PAGE
): Promise<ResponseData | APIErrorResponse> => {
  try {
    // DEBUG: Simulate error
    // throw new Error('Simulated fetch failure');

    const data = await request<UserArticlesResponse>(
      'https://gql.hashnode.com',
      getUserArticlesQuery,
      {
        host: 'hn.mrugesh.dev',
        first,
        after: pageCursor || null
      }
    );

    const posts = data?.publication?.posts?.edges.map(({ node }) => node) || [];

    // Sort posts by views in descending order
    posts.sort((a, b) => b.views - a.views);

    const pageInfo = {
      endCursor: data?.publication?.posts?.pageInfo?.endCursor || '',
      hasNextPage: data?.publication?.posts?.pageInfo?.hasNextPage || false
    };

    // DEBUG: Simulate slow network
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      posts,
      pageInfo
    };
  } catch (error) {
    // DEBUG: Log error
    // console.log('Error fetching posts:', error);

    if (error instanceof ClientError) {
      // GraphQL error
      return {
        error: {
          message:
            'Unable to fetch posts due to a GraphQL error. Please try again later.',
          code: 'GRAPHQL_ERROR'
        }
      };
    } else if (error instanceof Error) {
      // Network or other errors
      return {
        error: {
          message:
            'Unable to fetch posts due to a network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR'
        }
      };
    } else {
      // Unknown errors
      return {
        error: {
          message:
            'An unexpected error occurred while fetching posts. Please try again later.',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }
};

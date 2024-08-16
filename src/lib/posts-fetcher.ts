import { gql, request } from 'graphql-request';

export type Post = {
  title: string;
  brief: string;
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

export const postsFetcher = async (
  _key: string,
  pageCursor = '',
  first: number = 5
): Promise<ResponseData> => {
  let posts: Post[] = [];
  let pageInfo = {
    endCursor: '',
    hasNextPage: false
  };

  try {
    const data = await request<UserArticlesResponse>(
      'https://gql.hashnode.com',
      getUserArticlesQuery,
      {
        host: 'hn.mrugesh.dev',
        first,
        after: pageCursor || null
      }
    );

    posts = data?.publication?.posts?.edges.map(({ node }) => node) || [];

    pageInfo = data?.publication?.posts?.pageInfo || {
      endCursor: '',
      hasNextPage: false
    };
  } catch (error) {
    // console.error('Error fetching posts:', error);
    throw new Error('Error fetching posts. Errors logged to console.');
  }

  // DEBUG: Simulate slow network
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    posts,
    pageInfo
  };
};

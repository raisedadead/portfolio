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
  content: {
    markdown: string;
  };
};

export type GetPaginatedPostsResponseData = {
  posts: Post[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
};

interface GetPaginatedPostsResponse {
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

interface GetSinglePostResponse {
  publication: {
    post: Post;
  };
}

const GQLFragmentPostFieldsBasic = gql`
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

const GQLQueryGetPaginatedPosts = gql`
  ${GQLFragmentPostFieldsBasic}
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
): Promise<GetPaginatedPostsResponseData> => {
  let posts: Post[] = [];
  let pageInfo = {
    endCursor: '',
    hasNextPage: false
  };

  try {
    const data = await request<GetPaginatedPostsResponse>(
      'https://gql.hashnode.com',
      GQLQueryGetPaginatedPosts,
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
    console.error('Error fetching posts:', JSON.stringify(error, null, 2));
    throw new Error('Error fetching posts. Errors logged to console.');
  }

  // DEBUG: Simulate slow network
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    posts,
    pageInfo
  };
};

const GQLFragmentPostFieldsFull = gql`
  fragment PostFieldsFull on Post {
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
    content {
      markdown
    }
  }
`;
const GQLQueryGetSinglePost = gql`
  ${GQLFragmentPostFieldsFull}
  query PostBySlug($host: String!, $slug: String!) {
    publication(host: $host) {
      id
      post(slug: $slug) {
        ...PostFieldsFull
      }
    }
  }
`;

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const data = await request<GetSinglePostResponse>(
      'https://gql.hashnode.com',
      GQLQueryGetSinglePost,
      {
        host: 'hn.mrugesh.dev',
        slug
      }
    );
    // DEBUG: Simulate slow network
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return data?.publication?.post || null;
  } catch (error) {
    console.error('Error fetching post:', JSON.stringify(error, null, 2));
    throw new Error('Error fetching post. Errors logged to console.');
  }
};

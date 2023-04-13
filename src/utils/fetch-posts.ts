import { gql, GraphQLClient } from 'graphql-request';

const GET_USER_ARTICLES = gql`
  query GetUserArticles($page: Int!) {
    user(username: "mrugesh") {
      publication {
        posts(page: $page) {
          title
          brief
          slug
          totalReactions
          dateAdded
        }
      }
    }
  }
`;

interface UserArticlesResponse {
  user: {
    publication: {
      posts: Array<{
        title: string;
        brief: string;
        slug: string;
        totalReactions: number;
        dateAdded: string;
      }>;
    };
  };
}

type Post = {
  title: string;
  brief: string;
  slug: string;
  totalReactions: number;
  dateAdded: string;
};

export async function fetchUserArticles(page: number): Promise<Post[]> {
  const endpoint = 'https://api.hashnode.com';

  const graphQLClient = new GraphQLClient(endpoint, { fetch });
  const data = await graphQLClient.request<UserArticlesResponse>(
    GET_USER_ARTICLES,
    { page }
  );

  const postsArray = data.user.publication.posts.map((post) => {
    return {
      title: post.title,
      brief: post.brief,
      slug: post.slug,
      totalReactions: post.totalReactions,
      dateAdded: post.dateAdded
    };
  });
  return postsArray;
}

import { gql, GraphQLClient } from 'graphql-request';

export const config = {
  runtime: 'edge'
};

const GET_USER_ARTICLES = gql`
  query GetUserArticles {
    user(username: "mrugesh") {
      publication {
        posts {
          title
          brief
          slug
          totalReactions
          dateAdded
          popularity
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

export type Post = {
  title: string;
  brief: string;
  link: string;
  totalReactions: number;
  dateAdded: string;
};

export const hashnodeHandler = async () => {
  const endpoint = 'https://api.hashnode.com';

  const graphQLClient = new GraphQLClient(endpoint, { fetch });
  const data = await graphQLClient.request<UserArticlesResponse>(
    GET_USER_ARTICLES
  );

  let postsArray: Post[] = [];
  try {
    postsArray = data.user.publication.posts.map((post) => {
      return {
        title: post.title,
        brief: post.brief,
        link: 'https://hn.mrugesh.dev/' + post.slug + '?source=website',
        totalReactions: post.totalReactions,
        dateAdded: post.dateAdded
      };
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(
    JSON.stringify({
      posts: postsArray,
      message: null
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          'max-age=604800, s-maxage=604800, stale-while-revalidate'
      }
    }
  );
};

export default hashnodeHandler;

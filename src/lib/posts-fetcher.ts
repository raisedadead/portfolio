import { gql, request } from 'graphql-request';

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

export const postsFetcher = async (url: string) => {
  let posts: Post[] = [];
  try {
    const data = await request<UserArticlesResponse>(url, GET_USER_ARTICLES);
    posts = data.user.publication.posts.map((post) => {
      return {
        title: post.title,
        brief: post.brief,
        link: 'https://hn.mrugesh.dev/' + post.slug + '?source=website',
        totalReactions: post.totalReactions,
        dateAdded: post.dateAdded
      };
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching posts');
  }
  return posts;
};

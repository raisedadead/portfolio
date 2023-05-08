import { gql, request } from 'graphql-request';

export type Post = {
  title: string;
  brief: string;
  slug: string;
  totalReactions: number;
  dateAdded: string;
  popularity: number;
  replyCount: number;
};

interface UserArticlesResponse {
  user: {
    publication: {
      posts: Array<Post>;
    };
  };
}

const getUserArticlesQuery = (page: number) => {
  return gql`
    query GetUserArticles {
      user(username: "mrugesh") {
        publication {
          posts(page: ${page}) {
            title
            brief
            slug
            totalReactions
            dateAdded
            popularity
            replyCount
          }
        }
      }
    }
  `;
};

export const postsFetcher = async (_key: string, pageIndex = 0) => {
  let posts: Post[] = [];

  try {
    const data = await request<UserArticlesResponse>(
      'https://api.hashnode.com',
      getUserArticlesQuery(pageIndex)
    );
    posts = data.user.publication.posts.map(
      ({
        title,
        brief,
        slug,
        totalReactions,
        dateAdded,
        popularity,
        replyCount
      }) => {
        return {
          title,
          brief,
          slug,
          totalReactions,
          dateAdded,
          popularity,
          replyCount
        };
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching posts');
  }

  return posts;
};

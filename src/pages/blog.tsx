import React from 'react';
import Layout from '../components/layouts';
import { CustomLink as Link } from '../components/custom-link';
import { fetchUserArticles } from '../utils/fetch-posts';

export const config = {
  runtime: 'experimental-edge'
};

type Post = {
  title: string;
  link: string;
  content: string;
  publishedDate: string;
  cover?: string;
  creator?: string;
  totalReactions?: number;
};

type Props = {
  posts: Post[];
};

const Blog = ({ posts }: Props) => {
  return (
    <Layout>
      <section>
        <div className='px-20 pb-20 pt-5'>
          <h1 className='text-2xl font-bold text-slate-600'>
            Recent articles from my blog:
          </h1>
          <ul role='list' className='list-none divide-y divide-gray-200'>
            {posts.map((post, index) =>
              post.title && post.link ? (
                <li className='py-4' key={index}>
                  <Link href={post.link} className=''>
                    <div className='flex space-y-1'>
                      <div className='flex flex-col justify-between'>
                        <p className='text-sm text-gray-500'>
                          {new Date(post.publishedDate).toDateString()} •{' '}
                          {post.totalReactions} reactions
                        </p>
                        <h3 className="my-1 text-sm font-medium after:content-['_↗']">
                          {post.title}
                        </h3>
                        <p className='text-sm text-gray-500'>{post.content}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps(): Promise<{ props: Props }> {
  const posts: Post[] = [];

  const data = await fetchUserArticles(0);
  data.forEach((item) => {
    const {
      title = '',
      slug = '',
      brief = '',
      dateAdded = '',
      totalReactions = 0
    } = item;
    posts.push({
      title,
      link: `https://hn.mrugesh.dev/${slug}`,
      publishedDate: dateAdded,
      totalReactions,
      content: brief
    });
  });

  return {
    props: {
      posts
    }
  };
}

export default Blog;

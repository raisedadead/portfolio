import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import {
  fetchPostDetails,
  DetailedPost,
  APIErrorResponse
} from '@/lib/posts-fetcher';
import Layout from '@/components/layouts';
import { MetaHead } from '@/components/head';
import { cn } from '@/lib/utils';

const SkeletonBlock = () => (
  <div className={cn('animate-pulse')} data-testid='skeleton-block'>
    <div className={cn('relative aspect-video w-full bg-gray-200')}></div>
    <div className={cn('p-6 sm:p-10')}>
      <div className={cn('mb-6 h-8 w-3/4 bg-gray-200')}></div>
      <div className={cn('space-y-4')}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={cn('space-y-2')}>
            <div className={cn('h-4 w-full bg-gray-200')}></div>
            <div className={cn('h-4 w-5/6 bg-gray-200')}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: post, error } = useSWR<DetailedPost | APIErrorResponse>(
    slug ? `/api/post/${slug}` : null,
    () => fetchPostDetails(slug as string)
  );

  if (error) {
    return <div>Error loading post</div>;
  }

  if (!post) {
    return (
      <Layout variant='prose'>
        <article
          className={cn(
            'mx-auto max-w-4xl overflow-hidden',
            'bg-white dark:bg-gray-800',
            'no-underline',
            'shadow-[6px_8px_0px_theme(colors.gray.300)]',
            'dark:shadow-[6px_8px_0px_theme(colors.gray.700)]',
            'transition-colors duration-300'
          )}
        >
          <SkeletonBlock />
        </article>
      </Layout>
    );
  }

  if ('error' in post) {
    return <div>Error: {post.error.message}</div>;
  }

  return (
    <>
      <MetaHead pageTitle={post.title} />
      <Layout variant='prose'>
        <article
          className={cn(
            'mx-auto max-w-4xl overflow-hidden',
            'bg-white dark:bg-gray-800',
            'no-underline',
            'shadow-[6px_8px_0px_theme(colors.black)]',
            'transition-colors duration-300'
          )}
        >
          <div className='relative aspect-video w-full'>
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover'
            />
          </div>
          <div className='p-6 sm:p-10'>
            <h1 className='mb-10 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl'>
              {post.title}
            </h1>
            <div
              className={cn(
                // Base styles
                'prose prose-lg max-w-none dark:prose-invert',

                // Text styles
                'prose-p:text-gray-700 dark:prose-p:text-gray-300',
                'prose-p:my-2 prose-p:leading-relaxed',
                'prose-strong:text-gray-800 dark:prose-strong:text-gray-200',

                // Heading styles
                'prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-gray-100',
                'prose-h2:mb-2 prose-h2:mt-8',
                'prose-h3:mb-2 prose-h3:mt-6',
                'prose-h4:mb-2 prose-h4:mt-4',

                // Link styles
                'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400',

                // List styles
                'marker:bg-gray-300 marker:text-gray-700 prose-ol:list-outside prose-ul:list-disc dark:marker:text-gray-300',
                'prose-li:text-gray-700 dark:prose-li:text-gray-300',

                // Image styles
                'prose-img:my-4 prose-img:rounded-md prose-img:shadow-md',

                // Horizontal rule styles
                'prose-hr:border-gray-200 dark:prose-hr:border-gray-700',

                // Blockquote styles
                'prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300',

                // Code styles
                'prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-gray-700 dark:prose-code:text-gray-200',
                'prose-pre:rounded-lg prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:shadow-inner dark:prose-pre:bg-gray-700'
              )}
              dangerouslySetInnerHTML={{ __html: post.content.html }}
            />
          </div>
        </article>
      </Layout>
    </>
  );
};

export default BlogPost;

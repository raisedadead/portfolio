import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import parse from 'html-react-parser';
import type { DOMNode, Element } from 'html-react-parser';

import Layout from '@/components/layouts';
import { MetaHead } from '@/components/head';
import CodeBlock from '@/components/code-block';
import SkeletonBlock from '@/components/skeleton-block';
import { extractTextContent, cn } from '@/lib/utils';
import {
  fetchPostDetails,
  DetailedPost,
  APIErrorResponse
} from '@/lib/posts-fetcher';
import { useDarkMode } from '@/contexts/dark-mode-context';

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { darkMode } = useDarkMode();

  const { data: post, error } = useSWR<DetailedPost | APIErrorResponse>(
    slug ? `/api/post/${slug}` : null,
    () => fetchPostDetails(slug as string)
  );

  const renderContent = (htmlContent: string) =>
    parse(htmlContent, {
      replace: (domNode: DOMNode, index: number) => {
        if ((domNode as Element).name === 'pre') {
          const codeNode = (domNode as Element).children.find(
            (child) => (child as Element).name === 'code'
          ) as Element | undefined;
          if (codeNode) {
            const language = codeNode.attribs.class?.replace('lang-', '') || '';
            const code = extractTextContent(codeNode);
            return (
              <CodeBlock
                key={`${darkMode ? 'dark' : 'light'}-${index}`}
                language={language}
                code={code}
              />
            );
          }
        }
      }
    });

  if (error) return <div>Error loading post</div>;
  if (!post)
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
  if ('error' in post) return <div>Error: {post.error.message}</div>;

  return (
    <>
      <MetaHead
        pageTitle={post.title}
        setCanonicalBlogBaseURL={true}
        blogSlug={post.slug}
      />
      <Layout variant='prose'>
        <article
          className={cn(
            'mx-auto max-w-4xl overflow-hidden',
            'bg-white dark:bg-gray-800',
            'no-underline',
            'shadow-[6px_8px_0px_theme(colors.black)]',
            'dark:shadow-[6px_8px_0px_theme(colors.white)]',
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
              priority={true}
            />
          </div>
          <div className='p-6 sm:p-10'>
            <h1 className='mb-10 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl'>
              {post.title}
            </h1>
            <div
              className={cn(
                'prose prose-lg max-w-none dark:prose-invert',
                'prose-p:text-gray-700 dark:prose-p:text-gray-300',
                'prose-p:my-2 prose-p:leading-relaxed',
                'prose-strong:text-gray-800 dark:prose-strong:text-gray-200',
                'prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-gray-100',
                'prose-h2:mb-2 prose-h2:mt-8',
                'prose-h3:mb-2 prose-h3:mt-6',
                'prose-h4:mb-2 prose-h4:mt-4',
                'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400',
                'marker:bg-gray-300 marker:text-gray-700 prose-ol:list-outside prose-ul:list-disc dark:marker:text-gray-300',
                'prose-li:text-gray-700 dark:prose-li:text-gray-300',
                'prose-img:my-4 prose-img:rounded-md prose-img:shadow-md',
                'prose-hr:border-gray-200 dark:prose-hr:border-gray-700',
                'prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300'
              )}
            >
              {renderContent(post.content.html)}
            </div>
          </div>
        </article>
      </Layout>
    </>
  );
};

export default BlogPost;

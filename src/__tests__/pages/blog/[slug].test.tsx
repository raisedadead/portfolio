import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import type { BlogPost } from '@/types/blog';

const mockPost: BlogPost = {
  id: 'test-post-1',
  data: {
    slug: 'test-blog-post',
    title: 'Test Blog Post',
    brief: 'This is a test blog post',
    content: { html: '<p>Test content</p>' },
    author: { name: 'Test Author' },
    tags: [
      { name: 'Test', slug: 'test' },
      { name: 'Blog', slug: 'blog' }
    ],
    publishedAt: new Date('2025-01-15'),
    readingTime: 5
  }
};

// Mock the MainLayout component
vi.mock('@/layouts/main-layout.astro', () => ({
  default: ({ children, pageTitle }: { children: ReactNode; pageTitle: string }) => (
    <div data-testid='main-layout' data-page-title={pageTitle}>
      {children}
    </div>
  )
}));

// Mock the formatDate function
vi.mock('@/lib/formatDate', () => ({
  formatDate: vi.fn((date: Date) => date.toDateString())
}));

// Mock the syntax highlighter
vi.mock('@/lib/syntax-highlighter', () => ({
  highlightCode: vi.fn((code: string) => `<code>${code}</code>`)
}));

// Mock image optimization
vi.mock('@/lib/image-optimizer', () => ({
  transformImageUrl: vi.fn((url: string) => url)
}));

vi.mock('@/lib/image-dimensions', () => ({
  calculateImageDimensions: vi.fn(() => ({
    mobile: { width: 640, height: 360 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 },
    aspectRatio: '16/9'
  }))
}));

describe('Blog Post Slug Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderBlogPostPage = (post: BlogPost) => {
    return render(
      <div data-testid='blog-post-page'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <section className='mb-2'>
            <div className='prose prose-lg prose-slate max-w-none'>
              <h1 className='py-4 text-center text-3xl font-bold text-slate-800'>{post.data.title}</h1>
            </div>
          </section>

          <section className='mb-12'>
            <article className='duration-100[6px_8px_0px_var(--color-white)] overflow-hidden bg-white no-underline shadow-[6px_8px_0px_var(--color-black)] transition-colors'>
              <div className='relative aspect-video w-full'>
                <div className='absolute inset-0 animate-pulse bg-gray-200' />
                <img
                  src='https://example.com/cover.jpg'
                  alt={post.data.title}
                  width={1920}
                  height={1080}
                  className='h-full w-full object-cover transition-all duration-500'
                  loading='eager'
                  fetchPriority='high'
                />
              </div>

              <div className='p-6 sm:p-10'>
                <div className='mb-8 flex items-center gap-2 text-sm text-gray-600'>
                  <time dateTime={post.data.publishedAt.toISOString()}>{post.data.publishedAt.toDateString()}</time>
                  <span>•</span>
                  <span>{post.data.readingTime} min read</span>
                </div>

                <div className='prose prose-lg prose-p:text-gray-700 prose-p:my-2 prose-p:leading-relaxed prose-strong:text-gray-800 prose-headings:font-semibold prose-headings:text-gray-800 prose-h2:mb-2 prose-h2:mt-8 prose-h3:mb-2 prose-h3:mt-6 prose-h4:mb-2 prose-h4:mt-4 prose-a:text-blue-600 prose-a:no-underline prose-a:hover:underline prose-ul:list-disc prose-li:text-gray-700 prose-img:my-4 prose-img:rounded-md prose-img:shadow-md prose-hr:border-gray-200 prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 max-w-none'>
                  <p>Test content</p>
                </div>
              </div>
            </article>

            <section className='py-8'>
              <div className='flex flex-wrap justify-center gap-4'>
                <a
                  href='/blog'
                  className='border-2 border-black bg-orange-200 px-6 py-3 text-lg font-medium text-black no-underline shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-100 hover:bg-gray-700 hover:text-white hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:bg-black active:shadow-none'
                  data-testid='back-to-blog-button'
                >
                  ← Back to blog
                </a>

                {mockPost.data.tags.map((tag) => (
                  <a
                    key={tag.slug}
                    href={`/blog/tags/${tag.slug}`}
                    className='border-2 border-black bg-orange-200 px-4 py-2 text-sm font-medium text-black no-underline shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-100 hover:bg-gray-700 hover:text-white hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:bg-black active:shadow-none'
                    data-testid={`tag-button-${tag.slug}`}
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            </section>
          </section>
        </div>
      </div>
    );
  };

  describe('Page Structure', () => {
    it('renders the blog post content structure', () => {
      renderBlogPostPage(mockPost);

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders the blog post content', () => {
      renderBlogPostPage(mockPost);

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders the article with proper styling', () => {
      renderBlogPostPage(mockPost);

      const article = screen.getByRole('article');
      expect(article).toHaveClass('overflow-hidden', 'bg-white', 'shadow-[6px_8px_0px_var(--color-black)]');
    });

    it('displays reading time and publication date', () => {
      renderBlogPostPage(mockPost);

      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText(mockPost.data.publishedAt.toDateString())).toBeInTheDocument();
    });
  });

  describe('Back to Blog Button', () => {
    it('renders the back to blog button', () => {
      renderBlogPostPage(mockPost);

      const button = screen.getByTestId('back-to-blog-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('← Back to blog');
    });

    it('links to the blog index page', () => {
      renderBlogPostPage(mockPost);

      const button = screen.getByTestId('back-to-blog-button');
      expect(button).toHaveAttribute('href', '/blog');
    });

    it('has proper button styling', () => {
      renderBlogPostPage(mockPost);

      const button = screen.getByTestId('back-to-blog-button');
      expect(button).toHaveClass(
        'border-2',
        'border-black',
        'bg-orange-200',
        'px-6',
        'py-3',
        'text-lg',
        'font-medium',
        'text-black',
        'no-underline',
        'shadow-[4px_4px_0px_rgba(0,0,0,1)]',
        'transition-all',
        'duration-100'
      );
    });

    it('has hover state styling', () => {
      renderBlogPostPage(mockPost);

      const button = screen.getByTestId('back-to-blog-button');
      expect(button).toHaveClass('hover:bg-gray-700', 'hover:text-white', 'hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]');
    });
  });

  describe('Layout and Accessibility', () => {
    it('has proper container structure', () => {
      const { container } = renderBlogPostPage(mockPost);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('has responsive padding', () => {
      const { container } = renderBlogPostPage(mockPost);

      const mainContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(mainContainer).toHaveClass('px-4', 'py-12', 'sm:px-6', 'lg:px-8');
    });

    it('maintains semantic HTML structure', () => {
      renderBlogPostPage(mockPost);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderBlogPostPage(mockPost);

      // Should have one h1 for the page title
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('Test Blog Post');
    });
  });
});

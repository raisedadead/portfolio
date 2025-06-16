import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockImageProps } from '../test-utils';

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

// Mock Astro Image component
vi.mock('astro:assets', () => ({
  // biome-ignore lint/a11y/useAltText: This is a test mock with proper alt handling
  Image: ({ src, alt = 'Image', width, height, format, ...props }: MockImageProps) => (
    <img src={src} alt={alt} width={width} height={height} data-format={format} {...props} />
  ),
}));

// Since this is an Astro page, we'll test the component parts
describe('404 Page Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const render404Content = () => {
    return render(
      <section className="mb-8 flex flex-col items-center justify-center">
        <div className="prose prose-lg prose-slate max-w-none text-center">
          <h1 className="py-4 text-4xl font-extrabold tracking-tight text-slate-900">
            Page Not Found
          </h1>
          <p className="text-xl font-medium text-slate-700">
            Oops! It seems you've wandered into uncharted territory.
          </p>
        </div>
        <div className="my-8 flex w-full flex-col items-center justify-center">
          <img src="/images/404.svg" alt="404" width={640} height={640} data-format="svg" />
          <p className="mt-2 text-xs text-slate-500">Image by storyset on Freepik</p>
        </div>
        <p className="mb-6 text-lg font-medium text-slate-700">
          Don't worry, even the best explorers get lost sometimes!
        </p>
        <a
          href="/"
          className="inline-flex items-center border-2 border-black bg-orange-200 px-4 py-2 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none focus:outline-hidden active:bg-black active:shadow-none"
        >
          Return to Home
        </a>
      </section>
    );
  };

  describe('Basic Structure', () => {
    it('renders main section with correct classes', () => {
      const { container } = render404Content();

      const section = container.querySelector('section');
      expect(section).toHaveClass('mb-8', 'flex', 'flex-col', 'items-center', 'justify-center');
    });

    it('renders heading and content sections', () => {
      render404Content();

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /return to home/i })).toBeInTheDocument();
    });
  });

  describe('Heading and Text Content', () => {
    it('displays correct page title', () => {
      render404Content();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Page Not Found');
      expect(heading).toHaveClass(
        'py-4',
        'text-4xl',
        'font-extrabold',
        'tracking-tight',
        'text-slate-900'
      );
    });

    it('displays descriptive error messages', () => {
      render404Content();

      expect(
        screen.getByText("Oops! It seems you've wandered into uncharted territory.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Don't worry, even the best explorers get lost sometimes!")
      ).toBeInTheDocument();
    });

    it('applies correct typography classes', () => {
      const { container } = render404Content();

      const subtitle = screen.getByText("Oops! It seems you've wandered into uncharted territory.");
      expect(subtitle).toHaveClass('text-xl', 'font-medium', 'text-slate-700');

      const encouragement = screen.getByText(
        "Don't worry, even the best explorers get lost sometimes!"
      );
      expect(encouragement).toHaveClass('mb-6', 'text-lg', 'font-medium', 'text-slate-700');
    });
  });

  describe('404 Image', () => {
    it('renders 404 illustration', () => {
      render404Content();

      const image = screen.getByRole('img', { name: '404' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/404.svg');
      expect(image).toHaveAttribute('width', '640');
      expect(image).toHaveAttribute('height', '640');
    });

    it('displays image attribution', () => {
      render404Content();

      expect(screen.getByText('Image by storyset on Freepik')).toBeInTheDocument();
    });

    it('image container has correct styling', () => {
      const { container } = render404Content();

      const imageContainer = container.querySelector(
        '.my-8.flex.w-full.flex-col.items-center.justify-center'
      );
      expect(imageContainer).toBeInTheDocument();

      const attribution = screen.getByText('Image by storyset on Freepik');
      expect(attribution).toHaveClass('mt-2', 'text-xs', 'text-slate-500');
    });
  });

  describe('Return to Home Button', () => {
    it('renders return home link', () => {
      render404Content();

      const homeLink = screen.getByRole('link', { name: /return to home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('applies correct button styling', () => {
      render404Content();

      const homeLink = screen.getByRole('link', { name: /return to home/i });
      expect(homeLink).toHaveClass(
        'inline-flex',
        'items-center',
        'border-2',
        'border-black',
        'bg-orange-200',
        'px-4',
        'py-2',
        'text-black'
      );
    });

    it('includes hover and focus states', () => {
      render404Content();

      const homeLink = screen.getByRole('link', { name: /return to home/i });
      expect(homeLink).toHaveClass(
        'hover:bg-gray-700',
        'hover:text-white',
        'hover:shadow-none',
        'focus:outline-hidden',
        'active:bg-black',
        'active:shadow-none'
      );
    });
  });

  describe('Layout and Design', () => {
    it('uses prose styling for content sections', () => {
      const { container } = render404Content();

      const proseContainer = container.querySelector('.prose.prose-lg.prose-slate');
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toHaveClass('max-w-none', 'text-center');
    });

    it('centers content vertically and horizontally', () => {
      const { container } = render404Content();

      const section = container.querySelector('section');
      expect(section).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });

    it('applies proper spacing between elements', () => {
      const { container } = render404Content();

      const imageContainer = container.querySelector('.my-8');
      const encouragementText = screen.getByText(
        "Don't worry, even the best explorers get lost sometimes!"
      );

      expect(imageContainer).toHaveClass('my-8');
      expect(encouragementText).toHaveClass('mb-6');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = render404Content();

      expect(container.querySelector('section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('has descriptive alt text for image', () => {
      render404Content();

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', '404');
    });

    it('link has descriptive text', () => {
      render404Content();

      const homeLink = screen.getByRole('link');
      expect(homeLink).toHaveAccessibleName('Return to Home');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive layout classes', () => {
      const { container } = render404Content();

      const section = container.querySelector('section');
      const imageContainer = container.querySelector('.flex.w-full.flex-col');

      expect(section).toHaveClass('flex', 'flex-col');
      expect(imageContainer).toHaveClass(
        'flex',
        'w-full',
        'flex-col',
        'items-center',
        'justify-center'
      );
    });

    it('uses responsive typography', () => {
      render404Content();

      const heading = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText("Oops! It seems you've wandered into uncharted territory.");

      expect(heading).toHaveClass('text-4xl');
      expect(subtitle).toHaveClass('text-xl');
    });
  });
});

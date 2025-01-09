import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MetaHead } from '../../components/head';

vi.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  }
}));

const mockRouter = {
  asPath: '/'
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

describe('MetaHead', () => {
  const defaultProps = {
    pageTitle: undefined,
    pageDescription: undefined,
    pageUrl: undefined,
    pageImage: undefined
  };

  function renderMetaHead(props = {}) {
    return render(<MetaHead {...{ ...defaultProps, ...props }} />);
  }

  beforeEach(() => {
    // Clear any previous head elements
    document.head.innerHTML = '';
    // Reset router mock to default state
    mockRouter.asPath = '/';
  });

  it('renders default meta tags', () => {
    renderMetaHead();

    expect(document.title).toBe(
      'Mrugesh Mohapatra — Portfolio of a nocturnal developer.'
    );
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')
    ).toContain('Namaste! I am a technologist based out of Bengaluru, India.');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe('https://mrugesh.dev');
    expect(
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content')
    ).toBe('http://mrugesh.dev/images/og-image.webp');
  });

  it('renders custom meta tags', () => {
    const customProps = {
      pageTitle: 'Custom Title',
      pageDescription: 'Custom description',
      pageUrl: 'https://example.com',
      pageImage: 'https://example.com/image.jpg'
    };
    renderMetaHead(customProps);

    expect(document.title).toBe('Custom Title • Mrugesh Mohapatra');
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')
    ).toBe('Custom description');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe('https://example.com');
    expect(
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content')
    ).toBe('https://example.com/image.jpg');
  });

  it('renders correct Open Graph and Twitter tags', () => {
    renderMetaHead();

    expect(
      document
        .querySelector('meta[property="og:type"]')
        ?.getAttribute('content')
    ).toBe('website');
    expect(
      document
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute('content')
    ).toBe('Mrugesh Mohapatra');
    expect(
      document
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute('content')
    ).toBe('summary_large_image');
    expect(
      document
        .querySelector('meta[name="twitter:creator"]')
        ?.getAttribute('content')
    ).toBe('@raisedadead');
  });

  it('renders favicon and theme color', () => {
    renderMetaHead();

    expect(
      document.querySelector('link[rel="icon"]')?.getAttribute('href')
    ).toBe('/favicon.ico');
    expect(
      document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute('content')
    ).toBe('#32ded4');
  });

  it('renders blog canonical URLs correctly', () => {
    const props = {
      setCanonicalBlogBaseURL: true,
      blogSlug: 'test-post'
    };
    renderMetaHead(props);

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe('https://hn.mrugesh.dev/test-post');
  });

  it('renders blog base URL when no slug is provided', () => {
    const props = {
      setCanonicalBlogBaseURL: true
    };
    renderMetaHead(props);

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe('https://hn.mrugesh.dev');
  });

  it('renders clean URLs without query strings', () => {
    mockRouter.asPath = '/about?ref=twitter';
    renderMetaHead();

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe('https://mrugesh.dev/about');
  });
});

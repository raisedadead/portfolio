import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MetaHead } from '../../components/head';

vi.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
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

  it('renders default meta tags', () => {
    const { container } = renderMetaHead();

    expect(container.querySelector('title')?.textContent).toBe(
      'Mrugesh Mohapatra — Portfolio of a nocturnal developer.'
    );
    expect(
      container
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')
    ).toContain(
      'Namaste! I am a software engineer based out of Bengaluru, India.'
    );
    expect(
      container.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe('https://mrugesh.dev');
    expect(
      container
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
    const { container } = renderMetaHead(customProps);

    expect(container.querySelector('title')?.textContent).toBe(
      'Custom Title • Mrugesh Mohapatra'
    );
    expect(
      container
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')
    ).toBe('Custom description');
    expect(
      container.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe('https://example.com');
    expect(
      container
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content')
    ).toBe('https://example.com/image.jpg');
  });

  it('renders correct Open Graph and Twitter tags', () => {
    const { container } = renderMetaHead();

    expect(
      container
        .querySelector('meta[property="og:type"]')
        ?.getAttribute('content')
    ).toBe('website');
    expect(
      container
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute('content')
    ).toBe('Mrugesh Mohapatra');
    expect(
      container
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute('content')
    ).toBe('summary_large_image');
    expect(
      container
        .querySelector('meta[name="twitter:creator"]')
        ?.getAttribute('content')
    ).toBe('@raisedadead');
  });

  it('renders favicon and theme color', () => {
    const { container } = renderMetaHead();

    expect(
      container.querySelector('link[rel="icon"]')?.getAttribute('href')
    ).toBe('/favicon.ico');
    expect(
      container
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute('content')
    ).toBe('#32ded4');
  });
});

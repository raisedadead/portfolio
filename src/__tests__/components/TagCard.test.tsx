import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TagCard from '@/components/blog/TagCard';

describe('TagCard Component', () => {
  it('renders tag card with correct information', () => {
    render(<TagCard name='JavaScript' slug='javascript' count={5} />);

    // Check tag name is displayed
    expect(screen.getByText('javascript')).toBeInTheDocument();

    // Check count is displayed (appears in both the badge and the description)
    const countElements = screen.getAllByText('5', { exact: false });
    expect(countElements.length).toBeGreaterThan(0);
    expect(screen.getByText('5 posts')).toBeInTheDocument();
  });

  it('renders singular form for single post', () => {
    render(<TagCard name='TypeScript' slug='typescript' count={1} />);

    expect(screen.getByText('1 post')).toBeInTheDocument();
  });

  it('renders plural form for multiple posts', () => {
    render(<TagCard name='React' slug='react' count={10} />);

    expect(screen.getByText('10 posts')).toBeInTheDocument();
  });

  it('generates correct href for tag link', () => {
    render(<TagCard name='Vue' slug='vue-js' count={3} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/tags/vue-js');
  });

  it('includes proper accessibility attributes', () => {
    render(<TagCard name='Node.js' slug='node-js' count={7} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'View 7 posts tagged with Node.js');

    const countSpan = screen.getByLabelText('7 posts');
    expect(countSpan).toBeInTheDocument();
  });

  it('handles special characters in tag names', () => {
    render(<TagCard name='C++' slug='cpp' count={2} />);

    expect(screen.getByText('cpp')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'View 2 posts tagged with C++');
  });

  it('handles tags with dots in slugs', () => {
    render(<TagCard name='Vue.js' slug='vue.js' count={4} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/tags/vue.js');
  });

  it('handles tags with dashes in slugs', () => {
    render(<TagCard name='Node.js' slug='node-js' count={8} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/tags/node-js');
  });

  it('renders with zero posts correctly', () => {
    render(<TagCard name='Rust' slug='rust' count={0} />);

    expect(screen.getByText('0 posts')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'View 0 posts tagged with Rust');
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<TagCard name='Python' slug='python' count={15} />);

    const link = container.querySelector('a');
    expect(link?.className).toContain('border-2');
    expect(link?.className).toContain('border-black');
    expect(link?.className).toContain('shadow-[4px_4px_0px_var(--color-black)]');
    expect(link?.className).toContain('hover:bg-orange-100');

    const heading = container.querySelector('h2');
    expect(heading?.className).toContain('text-xl');
    expect(heading?.className).toContain('font-bold');

    const badge = container.querySelector('span[aria-label]');
    expect(badge?.className).toContain('rounded-full');
    expect(badge?.className).toContain('bg-slate-200');
  });

  it('handles long tag names gracefully', () => {
    const longTagName = 'Very Long Tag Name That Could Potentially Break Layout';
    render(<TagCard name={longTagName} slug='very-long-tag' count={99} />);

    expect(screen.getByText('very-long-tag')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', `View 99 posts tagged with ${longTagName}`);
  });

  it('handles large post counts', () => {
    render(<TagCard name='Popular' slug='popular' count={999} />);

    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('999 posts')).toBeInTheDocument();
  });
});

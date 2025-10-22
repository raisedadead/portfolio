import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/card';

describe('Card', () => {
  it('renders children content', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('uses default variant "default" when no variant prop is provided', () => {
    const { container } = render(
      <Card>
        <p>Content</p>
      </Card>
    );

    const card = container.firstChild as HTMLElement;

    // Test semantic behavior
    expect(card).toHaveAttribute('data-variant', 'default');

    // Test that content is rendered
    expect(card).toHaveTextContent('Content');
  });

  it('applies "default" variant correctly', () => {
    const { container } = render(<Card variant='default'>Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Test semantic behavior
    expect(card).toHaveAttribute('data-variant', 'default');

    // Test that it renders correctly
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Content');
  });

  it('applies "featured" variant correctly', () => {
    const { container } = render(<Card variant='featured'>Featured Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Test semantic behavior
    expect(card).toHaveAttribute('data-variant', 'featured');

    // Test that it renders correctly
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Featured Content');
  });

  it('applies "minimal" variant correctly', () => {
    const { container } = render(<Card variant='minimal'>Minimal Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Test semantic behavior
    expect(card).toHaveAttribute('data-variant', 'minimal');

    // Test that it renders correctly
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Minimal Content');
  });

  it('merges custom className with base styles', () => {
    const { container } = render(
      <Card variant='default' className='custom-class mt-4'>
        Content
      </Card>
    );

    const card = container.firstChild as HTMLElement;

    // Test that custom classes are applied
    expect(card).toHaveClass('custom-class', 'mt-4');

    // Test that variant is still applied
    expect(card).toHaveAttribute('data-variant', 'default');

    // Test that content is still rendered
    expect(card).toHaveTextContent('Content');
  });

  it('handles empty className prop', () => {
    const { container } = render(
      <Card variant='default' className=''>
        Content
      </Card>
    );

    const card = container.firstChild as HTMLElement;

    // Test that it still renders correctly
    expect(card).toHaveAttribute('data-variant', 'default');
    expect(card).toHaveTextContent('Content');
  });

  it('renders with proper semantic structure for default variant', () => {
    const { container } = render(<Card variant='default'>Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Test semantic structure
    expect(card).toHaveAttribute('data-variant', 'default');
    expect(card?.tagName).toBe('DIV');
    expect(card).toHaveTextContent('Content');
  });

  it('renders with proper semantic structure for featured variant', () => {
    const { container } = render(<Card variant='featured'>Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Test semantic structure
    expect(card).toHaveAttribute('data-variant', 'featured');
    expect(card?.tagName).toBe('DIV');
    expect(card).toHaveTextContent('Content');
  });

  it('renders with proper semantic structure for minimal variant', () => {
    const { container } = render(<Card variant='minimal'>Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Test semantic structure
    expect(card).toHaveAttribute('data-variant', 'minimal');
    expect(card?.tagName).toBe('DIV');
    expect(card).toHaveTextContent('Content');
  });
});

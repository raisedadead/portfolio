import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/card';

describe('Card', () => {
  it('renders children content', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>,
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('uses default variant "default" when no variant prop is provided', () => {
    const { container } = render(
      <Card>
        <p>Content</p>
      </Card>,
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-2');
  });

  it('applies "default" variant classes correctly', () => {
    const { container } = render(<Card variant="default">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card.className).toContain('border-2');
    expect(card.className).toContain('border-black');
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('p-6');
  });

  it('applies "featured" variant classes correctly', () => {
    const { container } = render(<Card variant="featured">Featured Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card.className).toContain('border-4');
    expect(card.className).toContain('border-black');
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('p-8');
  });

  it('applies "minimal" variant classes correctly', () => {
    const { container } = render(<Card variant="minimal">Minimal Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card.className).toContain('border-2');
    expect(card.className).toContain('border-black');
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('p-4');
  });

  it('merges custom className with base styles', () => {
    const { container } = render(
      <Card variant="default" className="custom-class mt-4">
        Content
      </Card>,
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-2');
    expect(card.className).toContain('border-black');
    expect(card.className).toContain('custom-class');
    expect(card.className).toContain('mt-4');
  });

  it('handles empty className prop', () => {
    const { container } = render(
      <Card variant="default" className="">
        Content
      </Card>,
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-2');
    expect(card.className).not.toContain('  '); // No double spaces
  });

  it('applies correct shadow for default variant', () => {
    const { container } = render(<Card variant="default">Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Check for shadow class
    expect(card.className).toMatch(/shadow/);
  });

  it('applies correct shadow for featured variant', () => {
    const { container } = render(<Card variant="featured">Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Check for shadow class
    expect(card.className).toMatch(/shadow/);
  });

  it('applies correct shadow for minimal variant', () => {
    const { container } = render(<Card variant="minimal">Content</Card>);
    const card = container.firstChild as HTMLElement;

    // Check for shadow class
    expect(card.className).toMatch(/shadow/);
  });
});

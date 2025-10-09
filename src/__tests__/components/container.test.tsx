import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Container from '@/components/ui/container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <p>Test content</p>
      </Container>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('uses default size "md" when no size prop is provided', () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-4xl');
    expect(div.className).toContain('mx-auto');
  });

  it('applies "sm" size classes correctly', () => {
    const { container } = render(
      <Container size="sm">
        <p>Content</p>
      </Container>,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-3xl');
    expect(div.className).toContain('mx-auto');
  });

  it('applies "md" size classes correctly', () => {
    const { container } = render(
      <Container size="md">
        <p>Content</p>
      </Container>,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-4xl');
    expect(div.className).toContain('mx-auto');
  });

  it('applies "lg" size classes correctly', () => {
    const { container } = render(
      <Container size="lg">
        <p>Content</p>
      </Container>,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-7xl');
    expect(div.className).toContain('mx-auto');
  });

  it('applies "full" size classes correctly', () => {
    const { container } = render(
      <Container size="full">
        <p>Content</p>
      </Container>,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('w-[90%]');
    expect(div.className).toContain('lg:w-[75%]');
    expect(div.className).toContain('xl:w-[80%]');
    expect(div.className).toContain('mx-auto');
  });

  it('merges custom className with base styles', () => {
    const { container } = render(
      <Container size="md" className="custom-class p-4">
        <p>Content</p>
      </Container>,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-4xl');
    expect(div.className).toContain('mx-auto');
    expect(div.className).toContain('custom-class');
    expect(div.className).toContain('p-4');
  });

  it('handles empty className prop', () => {
    const { container } = render(
      <Container size="md" className="">
        <p>Content</p>
      </Container>,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-4xl');
    expect(div.className).toContain('mx-auto');
    expect(div.className).not.toContain('  '); // No double spaces
  });
});

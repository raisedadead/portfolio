import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('uses default variant "primary" when no variant prop is provided', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('button');

    // Test semantic behavior: default variant should be primary
    expect(button).toHaveAttribute('data-variant', 'primary');

    // Test that it renders with expected styling behavior
    expect(button).toBeInTheDocument();
    expect(button?.tagName).toBe('BUTTON');
  });

  it('applies "primary" variant correctly', () => {
    render(<Button variant='primary'>Primary</Button>);
    const button = screen.getByRole('button', { name: /primary/i });

    // Test semantic behavior
    expect(button).toHaveAttribute('data-variant', 'primary');

    // Test that it renders correctly
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Primary');
  });

  it('applies "secondary" variant correctly', () => {
    render(<Button variant='secondary'>Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });

    // Test semantic behavior
    expect(button).toHaveAttribute('data-variant', 'secondary');

    // Test that it renders correctly
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Secondary');
  });

  it('applies "ghost" variant correctly', () => {
    render(<Button variant='ghost'>Ghost</Button>);
    const button = screen.getByRole('button', { name: /ghost/i });

    // Test semantic behavior
    expect(button).toHaveAttribute('data-variant', 'ghost');

    // Test that it renders correctly
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Ghost');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button', { name: /disabled/i });

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is focusable for keyboard navigation', () => {
    render(<Button>Focusable Button</Button>);
    const button = screen.getByRole('button', { name: /focusable button/i });

    // Button elements are focusable by default
    expect(button.tagName).toBe('BUTTON');
    expect(button).not.toHaveAttribute('tabindex', '-1');
  });

  it('supports ARIA attributes', () => {
    render(
      <Button aria-label='Custom label' aria-describedby='description'>
        Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /custom label/i });
    expect(button).toHaveAttribute('aria-label', 'Custom label');
    expect(button).toHaveAttribute('aria-describedby', 'description');
  });

  it('supports type attribute', () => {
    render(<Button type='submit'>Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('passes through additional HTML button attributes', () => {
    render(
      <Button name='action' value='save' form='myForm'>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toHaveAttribute('name', 'action');
    expect(button).toHaveAttribute('value', 'save');
    expect(button).toHaveAttribute('form', 'myForm');
  });
});

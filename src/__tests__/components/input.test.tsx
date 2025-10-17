import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders without errors', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder='Enter text...' />);
    const input = screen.getByPlaceholderText('Enter text...');
    expect(input).toBeInTheDocument();
  });

  it('handles controlled input changes', () => {
    const handleChange = vi.fn();

    render(<Input value='' onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies brutalist border classes', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');

    expect(input?.className).toContain('border-2');
    expect(input?.className).toContain('border-black');
  });

  it('applies brutalist shadow class', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');

    expect(input?.className).toMatch(/shadow/);
  });

  it('handles disabled state', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type='email' />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type='password' />);
    input = document.querySelector('input[type="password"]') as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type='number' />);
    input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('supports ARIA attributes', () => {
    render(<Input aria-label='Search field' aria-describedby='search-help' />);
    const input = screen.getByRole('textbox', { name: /search field/i });

    expect(input).toHaveAttribute('aria-label', 'Search field');
    expect(input).toHaveAttribute('aria-describedby', 'search-help');
  });

  it('supports required attribute', () => {
    render(<Input required />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('supports name attribute', () => {
    render(<Input name='username' />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('is focusable for keyboard input', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');

    // Input elements are focusable by default
    expect(input?.tagName).toBe('INPUT');
    expect(input).not.toHaveAttribute('tabindex', '-1');
  });

  it('accepts className prop for additional styling', () => {
    const { container } = render(<Input className='custom-class w-full' />);
    const input = container.querySelector('input');

    expect(input?.className).toContain('w-full');
    expect(input?.className).toContain('custom-class');
    expect(input?.className).toContain('border-2'); // Base classes still applied
  });
});

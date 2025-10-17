import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CodeBlock from '@/components/code-block';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

describe('CodeBlock Component', () => {
  const mockCode = 'console.log("Hello, World!");';
  const mockHtml = '<pre class="shiki"><code><span class="line">console.log("Hello, World!");</span></code></pre>';

  beforeEach(() => {
    vi.clearAllMocks();
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('renders code block with HTML', () => {
      const { container } = render(<CodeBlock code={mockCode} html={mockHtml} />);

      expect(container.querySelector('pre.shiki')).toBeInTheDocument();
    });

    it('renders copy button', () => {
      render(<CodeBlock code={mockCode} html={mockHtml} />);

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('renders provided HTML content', () => {
      const customHtml = '<pre class="custom"><code>test code</code></pre>';
      const { container } = render(<CodeBlock code='test code' html={customHtml} />);

      expect(container.querySelector('pre.custom')).toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('copies code to clipboard when button is clicked', async () => {
      render(<CodeBlock code={mockCode} html={mockHtml} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });

      await act(async () => {
        fireEvent.click(copyButton);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
    });

    it('shows and hides copy success state', async () => {
      render(<CodeBlock code={mockCode} html={mockHtml} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });

      // Initially, no "Copied!" text should be visible
      expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();

      // Click to copy
      await act(async () => {
        fireEvent.click(copyButton);
      });

      // Verify copied state appears
      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });

      // Verify clipboard was called
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
    });

    it('handles clipboard API failure gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Clipboard API not available')
      );

      render(<CodeBlock code={mockCode} html={mockHtml} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });

      await act(async () => {
        fireEvent.click(copyButton);
      });

      // Wait a bit for error handling
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // "Copied!" should not appear on failure
      expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Styling and Layout', () => {
    it('has proper container styling', () => {
      const { container } = render(<CodeBlock code={mockCode} html={mockHtml} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('group', 'relative');
    });

    it('positions copy button correctly', () => {
      render(<CodeBlock code={mockCode} html={mockHtml} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveClass('rounded-md', 'p-2', 'transition-all', 'duration-100');
    });

    it('applies proper button styling', () => {
      render(<CodeBlock code={mockCode} html={mockHtml} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveClass(
        'bg-gray-800',
        'hover:bg-orange-100',
        'opacity-20',
        'group-hover:opacity-100',
        'focus-visible:opacity-100'
      );
    });

    it('has wrapper div structure', () => {
      const { container } = render(<CodeBlock code={mockCode} html={mockHtml} />);

      const wrapperDiv = container.querySelector('.group.relative');
      expect(wrapperDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for copy button', () => {
      render(<CodeBlock code={mockCode} html={mockHtml} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveAttribute('aria-label', expect.stringContaining('Copy'));
    });

    it('provides keyboard accessibility', () => {
      render(<CodeBlock code={mockCode} html={mockHtml} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      copyButton.focus();

      expect(copyButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty code gracefully', () => {
      const emptyHtml = '<pre class="shiki"><code></code></pre>';
      const { container } = render(<CodeBlock code='' html={emptyHtml} />);

      expect(container.querySelector('pre.shiki')).toBeInTheDocument();
    });

    it('handles very long code strings', () => {
      const longCode = 'console.log("test");'.repeat(100);
      const longHtml = `<pre class="shiki"><code>${longCode}</code></pre>`;

      render(<CodeBlock code={longCode} html={longHtml} />);

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('handles special characters in code', () => {
      const specialCode = 'const str = "Hello \\"World\\"!";';
      const specialHtml = `<pre class="shiki"><code>${specialCode}</code></pre>`;

      const { container } = render(<CodeBlock code={specialCode} html={specialHtml} />);

      expect(container.querySelector('pre.shiki')).toBeInTheDocument();
    });

    it('handles HTML with line numbers', () => {
      const htmlWithLineNumbers =
        '<pre class="shiki shiki-line-numbers"><code><span class="line" data-line="1">console.log("test");</span></code></pre>';

      const { container } = render(<CodeBlock code={mockCode} html={htmlWithLineNumbers} />);

      expect(container.querySelector('pre.shiki-line-numbers')).toBeInTheDocument();
    });
  });

  describe('Mounting Behavior', () => {
    it('renders HTML before mounting', () => {
      const { container } = render(<CodeBlock code={mockCode} html={mockHtml} />);

      // Should render HTML even before React hydration
      expect(container.querySelector('pre.shiki')).toBeInTheDocument();
    });
  });
});

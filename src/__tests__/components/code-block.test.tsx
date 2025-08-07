import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CodeBlock from '../../components/code-block';

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: vi.fn(({ children, language, showLineNumbers, wrapLongLines, customStyle, ...props }) => (
    <pre
      data-testid='syntax-highlighter'
      data-language={language}
      data-show-line-numbers={showLineNumbers}
      data-wrap-long-lines={wrapLongLines}
      style={customStyle}
      {...props}
    >
      <code>{children}</code>
    </pre>
  ))
}));

// Mock styles import
vi.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  coldarkCold: {},
  coldarkDark: {}
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

describe('CodeBlock Component', () => {
  const mockCode = 'console.log("Hello, World!");';
  const mockLanguage = 'javascript';

  beforeEach(() => {
    vi.clearAllMocks();
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  // Get the mocked SyntaxHighlighter
  const mockSyntaxHighlighter = vi.mocked(SyntaxHighlighter);

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('renders code block with syntax highlighter', () => {
      render(<CodeBlock code={mockCode} language={mockLanguage} />);

      expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
      expect(screen.getByText(mockCode)).toBeInTheDocument();
    });

    it('renders copy button', () => {
      render(<CodeBlock code={mockCode} language={mockLanguage} />);

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('passes correct props to syntax highlighter', () => {
      render(<CodeBlock code={mockCode} language={mockLanguage} />);

      expect(mockSyntaxHighlighter).toHaveBeenCalledWith(
        {
          language: mockLanguage,
          children: mockCode,
          showLineNumbers: true,
          wrapLongLines: true,
          style: {},
          customStyle: {
            padding: '1rem 0rem',
            fontSize: '1rem',
            lineHeight: '1.5'
          }
        },
        undefined
      );
    });
  });

  describe('Language Detection', () => {
    it('handles different programming languages', () => {
      const languages = ['typescript', 'python', 'css', 'html'];

      for (const lang of languages) {
        vi.clearAllMocks();
        render(<CodeBlock code={mockCode} language={lang} />);
        expect(mockSyntaxHighlighter).toHaveBeenCalledWith(
          {
            language: lang,
            children: mockCode,
            showLineNumbers: true,
            wrapLongLines: true,
            style: {},
            customStyle: {
              padding: '1rem 0rem',
              fontSize: '1rem',
              lineHeight: '1.5'
            }
          },
          undefined
        );
      }
    });

    it('handles empty language gracefully', () => {
      render(<CodeBlock code={mockCode} language='' />);

      expect(mockSyntaxHighlighter).toHaveBeenCalledWith(
        {
          language: '',
          children: mockCode,
          showLineNumbers: false,
          wrapLongLines: true,
          style: {},
          customStyle: {
            padding: '1rem 1rem',
            fontSize: '1rem',
            lineHeight: '1.5'
          }
        },
        undefined
      );
    });
  });

  describe('Copy Functionality', () => {
    it('shows and hides copy success state', async () => {
      render(<CodeBlock code={mockCode} language={mockLanguage} />);

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
  });

  describe('Line Numbers', () => {
    it('shows line numbers for supported languages', () => {
      render(<CodeBlock code={mockCode} language='javascript' />);

      expect(mockSyntaxHighlighter).toHaveBeenCalledWith(
        {
          showLineNumbers: true,
          language: 'javascript',
          children: mockCode,
          wrapLongLines: true,
          style: {},
          customStyle: {
            padding: '1rem 0rem',
            fontSize: '1rem',
            lineHeight: '1.5'
          }
        },
        undefined
      );
    });

    it('hides line numbers for bash and console languages', () => {
      render(<CodeBlock code={mockCode} language='bash' />);

      expect(mockSyntaxHighlighter).toHaveBeenCalledWith(
        {
          showLineNumbers: false,
          language: 'bash',
          children: mockCode,
          wrapLongLines: true,
          style: {},
          customStyle: {
            padding: '1rem 1rem',
            fontSize: '1rem',
            lineHeight: '1.5'
          }
        },
        undefined
      );
    });
  });

  describe('Styling and Layout', () => {
    it('has proper container styling', () => {
      render(<CodeBlock code={mockCode} language={mockLanguage} />);

      const container = screen.getByTestId('syntax-highlighter').parentElement;
      expect(container).toHaveClass('relative');
    });

    it('positions copy button correctly', () => {
      render(<CodeBlock code={mockCode} language='javascript' />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveClass('rounded-md', 'p-2', 'transition-opacity', 'duration-200');
    });

    it('applies proper button styling', () => {
      render(<CodeBlock code={mockCode} language='javascript' />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveClass(
        'bg-gray-800',
        'hover:bg-gray-700',
        'dark:bg-gray-100',
        'dark:hover:bg-gray-200',
        'opacity-20',
        'group-hover:opacity-100',
        'focus:opacity-100'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for copy button', () => {
      render(<CodeBlock code={mockCode} language={mockLanguage} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveAttribute('aria-label', expect.stringContaining('Copy'));
    });

    it('provides keyboard accessibility', () => {
      render(<CodeBlock code={mockCode} language={mockLanguage} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      copyButton.focus();

      expect(copyButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty code gracefully', () => {
      render(<CodeBlock code='' language='javascript' />);

      expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
      expect(mockSyntaxHighlighter).toHaveBeenCalledWith(
        {
          children: '',
          language: 'javascript',
          showLineNumbers: true,
          wrapLongLines: true,
          style: {},
          customStyle: {
            padding: '1rem 0rem',
            fontSize: '1rem',
            lineHeight: '1.5'
          }
        },
        undefined
      );
    });

    it('handles very long code strings', () => {
      const longCode = 'console.log("test");'.repeat(100);

      render(<CodeBlock code={longCode} language={mockLanguage} />);

      expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('handles special characters in code', () => {
      const specialCode = 'const str = "Hello \\"World\\"!";';

      render(<CodeBlock code={specialCode} language={mockLanguage} />);

      expect(screen.getByText(specialCode)).toBeInTheDocument();
    });
  });
});

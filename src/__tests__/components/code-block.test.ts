import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
});

describe('Code Block Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  interface CodeBlockProps {
    language?: string;
    code: string;
    showLineNumbers?: boolean;
  }

  const createCodeBlock = (props: CodeBlockProps) => {
    const { language = '', code, showLineNumbers = true } = props;

    // Format language for display
    const formattedLanguage = language.replace(/^lang-/, '');
    const shouldShowLineNumbers =
      showLineNumbers && !['', 'bash', 'console', 'plaintext', 'text', 'txt'].includes(formattedLanguage);

    // Generate line numbers if needed
    const lines = code.split('\n');
    const lineNumbers = shouldShowLineNumbers ? Array.from({ length: lines.length }, (_, i) => i + 1) : [];

    // Simple syntax highlighting simulation
    const highlightedCode = enhanceSyntaxHighlighting(code, formattedLanguage);

    const container = document.createElement('div');
    container.className = 'group relative';

    // Controls section
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'absolute top-2 right-2 z-10 flex items-center gap-2';

    // Language label
    if (formattedLanguage) {
      const langSpan = document.createElement('span');
      langSpan.className =
        'rounded bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 opacity-60 group-hover:opacity-100';
      langSpan.textContent = formattedLanguage;
      controlsDiv.appendChild(langSpan);
    }

    // Copy button
    const copyButton = document.createElement('button');
    copyButton.className =
      'rounded-md bg-gray-800 p-2 opacity-20 transition-opacity duration-200 group-hover:opacity-100 hover:bg-gray-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.setAttribute('data-copy-code', '');

    const copySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    copySvg.setAttribute('class', 'h-5 w-5 text-white');
    copySvg.setAttribute('fill', 'none');
    copySvg.setAttribute('stroke', 'currentColor');
    copySvg.setAttribute('viewBox', '0 0 24 24');

    const copyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    copyPath.setAttribute('stroke-linecap', 'round');
    copyPath.setAttribute('stroke-linejoin', 'round');
    copyPath.setAttribute('stroke-width', '2');
    copyPath.setAttribute(
      'd',
      'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
    );

    copySvg.appendChild(copyPath);
    copyButton.appendChild(copySvg);
    controlsDiv.appendChild(copyButton);

    // Code container
    const codeContainer = document.createElement('div');
    codeContainer.className = 'flex overflow-hidden rounded-lg bg-gray-900';

    // Line numbers
    if (shouldShowLineNumbers) {
      const lineNumbersDiv = document.createElement('div');
      lineNumbersDiv.className = 'select-none bg-gray-800 px-4 py-4 text-right text-sm text-gray-400';

      lineNumbers.forEach((num) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'leading-6';
        lineDiv.textContent = num.toString();
        lineNumbersDiv.appendChild(lineDiv);
      });

      codeContainer.appendChild(lineNumbersDiv);
    }

    // Code content
    const pre = document.createElement('pre');
    pre.className = 'flex-1 overflow-x-auto p-4 text-gray-100';

    const codeElement = document.createElement('code');
    codeElement.className = `language-${formattedLanguage}`;
    codeElement.innerHTML = highlightedCode;

    pre.appendChild(codeElement);
    codeContainer.appendChild(pre);

    container.appendChild(controlsDiv);
    container.appendChild(codeContainer);

    // Add copy functionality
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);

        // Visual feedback
        const originalIcon = copyButton.innerHTML;
        copyButton.innerHTML = `
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        `;

        setTimeout(() => {
          copyButton.innerHTML = originalIcon;
        }, 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    });

    document.body.appendChild(container);
    return container;
  };

  function enhanceSyntaxHighlighting(code: string, lang: string): string {
    if (!lang || ['text', 'txt', 'plaintext'].includes(lang)) {
      return code;
    }

    let highlightedCode = code;

    // JavaScript/TypeScript highlighting
    if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(lang)) {
      // Keywords
      highlightedCode = highlightedCode.replace(
        /\b(const|let|var|function|async|await|if|else|for|while|return|import|export|from|default|class|extends|interface|type|enum|public|private|protected|static|readonly)\b/g,
        '<span class="token keyword">$1</span>'
      );

      // Strings (simplified)
      highlightedCode = highlightedCode.replace(/"[^"]*"/g, '<span class="token string">$&</span>');
      highlightedCode = highlightedCode.replace(/'[^']*'/g, '<span class="token string">$&</span>');

      // Comments
      highlightedCode = highlightedCode.replace(
        /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
        '<span class="token comment">$1</span>'
      );

      // Functions
      highlightedCode = highlightedCode.replace(/\b(\w+)(?=\s*\()/g, '<span class="token function">$1</span>');

      // Numbers
      highlightedCode = highlightedCode.replace(/\b(\d+\.?\d*)\b/g, '<span class="token number">$1</span>');
    }

    return highlightedCode;
  }

  describe('Structure and Layout', () => {
    it('renders code block with correct structure', () => {
      createCodeBlock({ code: 'console.log("test");', language: 'javascript' });

      const container = document.querySelector('.group.relative');
      expect(container).toBeTruthy();
    });

    it('renders controls section', () => {
      createCodeBlock({ code: 'test', language: 'js' });

      const controls = document.querySelector('.absolute.top-2.right-2');
      expect(controls).toBeTruthy();
      expect(controls?.classList.contains('z-10')).toBe(true);
    });

    it('renders code container with proper styling', () => {
      createCodeBlock({ code: 'test' });

      const codeContainer = document.querySelector('.flex.overflow-hidden.rounded-lg.bg-gray-900');
      expect(codeContainer).toBeTruthy();
    });

    it('renders pre and code elements', () => {
      createCodeBlock({ code: 'test', language: 'javascript' });

      const pre = document.querySelector('pre');
      const code = document.querySelector('code');

      expect(pre).toBeTruthy();
      expect(code).toBeTruthy();
      expect(pre?.classList.contains('flex-1')).toBe(true);
      expect(pre?.classList.contains('overflow-x-auto')).toBe(true);
    });
  });

  describe('Language Display', () => {
    it('displays language label when language is provided', () => {
      createCodeBlock({ code: 'test', language: 'javascript' });

      const langLabel = document.querySelector('.rounded.bg-gray-700');
      expect(langLabel?.textContent).toBe('javascript');
    });

    it('formats language by removing lang- prefix', () => {
      createCodeBlock({ code: 'test', language: 'lang-python' });

      const langLabel = document.querySelector('.rounded.bg-gray-700');
      expect(langLabel?.textContent).toBe('python');
    });

    it('does not display language label when no language provided', () => {
      createCodeBlock({ code: 'test' });

      const langLabel = document.querySelector('.rounded.bg-gray-700');
      expect(langLabel).toBeNull();
    });

    it('applies correct CSS class to code element', () => {
      createCodeBlock({ code: 'test', language: 'typescript' });

      const code = document.querySelector('code');
      expect(code?.classList.contains('language-typescript')).toBe(true);
    });
  });

  describe('Line Numbers', () => {
    it('shows line numbers by default for most languages', () => {
      createCodeBlock({ code: 'line 1\nline 2\nline 3', language: 'javascript' });

      const lineNumbers = document.querySelector('.select-none.bg-gray-800');
      const numberDivs = lineNumbers?.querySelectorAll('.leading-6');

      expect(lineNumbers).toBeTruthy();
      expect(numberDivs).toHaveLength(3);
      expect(numberDivs?.[0].textContent).toBe('1');
      expect(numberDivs?.[1].textContent).toBe('2');
      expect(numberDivs?.[2].textContent).toBe('3');
    });

    it('hides line numbers for bash/console languages', () => {
      createCodeBlock({ code: 'echo "test"', language: 'bash' });

      const lineNumbers = document.querySelector('.select-none.bg-gray-800');
      expect(lineNumbers).toBeNull();
    });

    it('hides line numbers when showLineNumbers is false', () => {
      createCodeBlock({ code: 'test', language: 'javascript', showLineNumbers: false });

      const lineNumbers = document.querySelector('.select-none.bg-gray-800');
      expect(lineNumbers).toBeNull();
    });

    it('hides line numbers for plaintext', () => {
      createCodeBlock({ code: 'plain text', language: 'plaintext' });

      const lineNumbers = document.querySelector('.select-none.bg-gray-800');
      expect(lineNumbers).toBeNull();
    });

    it('applies correct styling to line numbers', () => {
      createCodeBlock({ code: 'test', language: 'js' });

      const lineNumbers = document.querySelector('.select-none.bg-gray-800');
      expect(lineNumbers?.classList.contains('px-4')).toBe(true);
      expect(lineNumbers?.classList.contains('py-4')).toBe(true);
      expect(lineNumbers?.classList.contains('text-right')).toBe(true);
      expect(lineNumbers?.classList.contains('text-sm')).toBe(true);
      expect(lineNumbers?.classList.contains('text-gray-400')).toBe(true);
    });
  });

  describe('Copy Functionality', () => {
    it('renders copy button with correct attributes', () => {
      createCodeBlock({ code: 'test' });

      const copyButton = document.querySelector('[data-copy-code]');
      expect(copyButton?.tagName.toLowerCase()).toBe('button');
      expect(copyButton?.getAttribute('aria-label')).toBe('Copy code to clipboard');
    });

    it('copies code to clipboard when button is clicked', async () => {
      const code = 'console.log("test");';
      createCodeBlock({ code });

      const copyButton = document.querySelector('[data-copy-code]') as HTMLButtonElement;
      await copyButton.click();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code);
    });

    it('shows visual feedback after copying', async () => {
      vi.useFakeTimers();
      createCodeBlock({ code: 'test' });

      const copyButton = document.querySelector('[data-copy-code]') as HTMLButtonElement;
      const originalHTML = copyButton.innerHTML;

      await copyButton.click();

      // Should show checkmark
      expect(copyButton.innerHTML).toContain('text-green-400');
      expect(copyButton.innerHTML).toContain('M5 13l4 4L19 7');

      // Fast-forward timers
      vi.advanceTimersByTime(2000);

      // Should revert to original
      expect(copyButton.innerHTML).toBe(originalHTML);

      vi.useRealTimers();
    });

    it('handles clipboard API failures gracefully', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard API failed'));
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });

      // Mock execCommand
      document.execCommand = vi.fn().mockReturnValue(true);

      createCodeBlock({ code: 'test code' });

      const copyButton = document.querySelector('[data-copy-code]') as HTMLButtonElement;

      // Should not throw error
      expect(() => copyButton.click()).not.toThrow();

      // Wait a bit for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('Syntax Highlighting', () => {
    it('highlights JavaScript keywords', () => {
      createCodeBlock({ code: 'const x = function() { return true; }', language: 'javascript' });

      const code = document.querySelector('code');
      expect(code?.innerHTML).toContain('token keyword');
      expect(code?.innerHTML).toContain('const');
      expect(code?.innerHTML).toContain('function');
      expect(code?.innerHTML).toContain('return');
    });

    it('highlights JavaScript strings', () => {
      createCodeBlock({ code: 'const msg = "hello world";', language: 'javascript' });

      const code = document.querySelector('code');
      expect(code?.innerHTML).toContain('token string');
      expect(code?.innerHTML).toContain('hello world');
    });

    it('highlights JavaScript comments', () => {
      createCodeBlock({ code: '// This is a comment\n/* Block comment */', language: 'javascript' });

      const code = document.querySelector('code');
      expect(code?.innerHTML).toContain('token comment');
      expect(code?.innerHTML).toContain('This is a comment');
    });

    it('highlights function names', () => {
      createCodeBlock({ code: 'myFunction()', language: 'javascript' });

      const code = document.querySelector('code');
      expect(code?.innerHTML).toContain('token function');
      expect(code?.innerHTML).toContain('myFunction');
    });

    it('highlights numbers', () => {
      createCodeBlock({ code: 'const num = 42.5;', language: 'javascript' });

      const code = document.querySelector('code');
      expect(code?.innerHTML).toContain('token number');
      expect(code?.innerHTML).toContain('42.5');
    });

    it('does not highlight plain text', () => {
      createCodeBlock({ code: 'plain text content', language: 'text' });

      const code = document.querySelector('code');
      expect(code?.innerHTML).toBe('plain text content');
    });

    it('works with TypeScript language', () => {
      createCodeBlock({ code: 'interface User { name: string; }', language: 'typescript' });

      const code = document.querySelector('code');
      expect(code?.innerHTML).toContain('token keyword');
      expect(code?.innerHTML).toContain('interface');
    });
  });

  describe('Hover and Focus States', () => {
    it('applies group hover effects to language label', () => {
      createCodeBlock({ code: 'test', language: 'js' });

      const langLabel = document.querySelector('.rounded.bg-gray-700');
      expect(langLabel?.classList.contains('opacity-60')).toBe(true);
      expect(langLabel?.classList.contains('group-hover:opacity-100')).toBe(true);
    });

    it('applies group hover effects to copy button', () => {
      createCodeBlock({ code: 'test' });

      const copyButton = document.querySelector('[data-copy-code]');
      expect(copyButton?.classList.contains('opacity-20')).toBe(true);
      expect(copyButton?.classList.contains('group-hover:opacity-100')).toBe(true);
    });

    it('applies focus styles to copy button', () => {
      createCodeBlock({ code: 'test' });

      const copyButton = document.querySelector('[data-copy-code]');
      expect(copyButton?.classList.contains('focus:opacity-100')).toBe(true);
      expect(copyButton?.classList.contains('focus:outline-none')).toBe(true);
      expect(copyButton?.classList.contains('focus:ring-2')).toBe(true);
      expect(copyButton?.classList.contains('focus:ring-gray-400')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('provides proper aria-label for copy button', () => {
      createCodeBlock({ code: 'test' });

      const copyButton = document.querySelector('[data-copy-code]');
      expect(copyButton?.getAttribute('aria-label')).toBe('Copy code to clipboard');
    });

    it('uses semantic HTML elements', () => {
      createCodeBlock({ code: 'test' });

      expect(document.querySelector('pre')).toBeTruthy();
      expect(document.querySelector('code')).toBeTruthy();
      expect(document.querySelector('button')).toBeTruthy();
    });

    it('maintains proper heading structure in language display', () => {
      createCodeBlock({ code: 'test', language: 'javascript' });

      // Language label should not interfere with heading hierarchy
      const langLabel = document.querySelector('.rounded.bg-gray-700');
      expect(langLabel?.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('Code Content Display', () => {
    it('preserves whitespace and formatting', () => {
      const code = 'function test() {\n  return true;\n}';
      createCodeBlock({ code, language: 'text' }); // Use text to avoid highlighting

      const codeElement = document.querySelector('code');
      expect(codeElement?.textContent).toBe(code);
    });

    it('handles empty code gracefully', () => {
      createCodeBlock({ code: '' });

      const codeElement = document.querySelector('code');
      expect(codeElement?.textContent).toBe('');
    });

    it('handles multi-line code correctly', () => {
      const code = 'line 1\nline 2\nline 3';
      createCodeBlock({ code, language: 'javascript' });

      const lines = code.split('\n');
      const lineNumberDivs = document.querySelectorAll('.leading-6');

      expect(lineNumberDivs).toHaveLength(lines.length);
    });
  });

  describe('Performance and Optimization', () => {
    it('uses efficient DOM structure', () => {
      createCodeBlock({ code: 'test' });

      // Should not create excessive elements
      const allElements = document.querySelectorAll('*');
      expect(allElements.length).toBeLessThan(20);
    });

    it('applies appropriate overflow handling', () => {
      createCodeBlock({ code: 'very long line of code that might overflow horizontally' });

      const pre = document.querySelector('pre');
      expect(pre?.classList.contains('overflow-x-auto')).toBe(true);
    });
  });
});

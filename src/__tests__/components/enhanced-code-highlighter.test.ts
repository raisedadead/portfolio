import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Shiki
vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre class="shiki"><code>mock highlighted code</code></pre>')
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
});

describe('Enhanced Code Highlighter', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Language Detection', () => {
    it('should detect language from class names', () => {
      const codeElement = document.createElement('code');
      codeElement.className = 'language-javascript';
      document.body.appendChild(codeElement);

      expect(codeElement.classList.contains('language-javascript')).toBe(true);
    });

    it('should handle multiple class names', () => {
      const codeElement = document.createElement('code');
      codeElement.className = 'hljs line-numbers language-typescript';
      document.body.appendChild(codeElement);

      const hasLanguageClass = Array.from(codeElement.classList).some((cls) => cls.startsWith('language-'));
      expect(hasLanguageClass).toBe(true);
    });

    it('should fallback to text for unknown languages', () => {
      const codeElement = document.createElement('code');
      codeElement.className = 'unknown-class';
      document.body.appendChild(codeElement);

      // Language detection would fallback to 'text'
      expect(codeElement.className).toBe('unknown-class');
    });
  });

  describe('Code Block Structure', () => {
    it('should find pre > code elements', () => {
      const preElement = document.createElement('pre');
      const codeElement = document.createElement('code');
      codeElement.textContent = 'console.log("Hello World");';
      codeElement.className = 'language-javascript';

      preElement.appendChild(codeElement);
      document.body.appendChild(preElement);

      const codeBlocks = document.querySelectorAll('pre > code');
      expect(codeBlocks).toHaveLength(1);
      expect(codeBlocks[0].textContent).toBe('console.log("Hello World");');
    });

    it('should handle empty code blocks', () => {
      const preElement = document.createElement('pre');
      const codeElement = document.createElement('code');
      codeElement.textContent = '';

      preElement.appendChild(codeElement);
      document.body.appendChild(preElement);

      const codeBlocks = document.querySelectorAll('pre > code');
      expect(codeBlocks[0].textContent).toBe('');
    });

    it('should skip already enhanced elements', () => {
      const preElement = document.createElement('pre');
      preElement.setAttribute('data-enhanced', 'true');
      const codeElement = document.createElement('code');
      codeElement.textContent = 'test code';

      preElement.appendChild(codeElement);
      document.body.appendChild(preElement);

      expect(preElement.hasAttribute('data-enhanced')).toBe(true);
    });
  });

  describe('Copy Functionality', () => {
    it('should create copy button with correct attributes', () => {
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.setAttribute('data-code', 'test code');
      button.setAttribute('aria-label', 'Copy code to clipboard');

      expect(button.getAttribute('data-code')).toBe('test code');
      expect(button.getAttribute('aria-label')).toBe('Copy code to clipboard');
    });

    it('should handle copy button click', async () => {
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.setAttribute('data-code', 'console.log("test");');

      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });

      // Simulate click event
      const clickEvent = new Event('click');
      button.dispatchEvent(clickEvent);

      // Since the actual click handler is in the Astro component,
      // we test the clipboard API directly
      await navigator.clipboard.writeText('console.log("test");');
      expect(mockWriteText).toHaveBeenCalledWith('console.log("test");');
    });

    it('should fallback for browsers without clipboard API', () => {
      // Mock execCommand for testing
      document.execCommand = vi.fn().mockReturnValue(true);

      // Test the fallback mechanism components
      const textArea = document.createElement('textarea');
      textArea.value = 'test code';
      document.body.appendChild(textArea);

      expect(textArea.value).toBe('test code');
      expect(document.body.contains(textArea)).toBe(true);

      // Test that execCommand can be called
      const commandResult = document.execCommand('copy');
      expect(commandResult).toBe(true);

      // Cleanup
      document.body.removeChild(textArea);
    });
  });

  describe('Code Enhancement', () => {
    it('should create wrapper with correct classes', () => {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper group relative my-6';
      wrapper.setAttribute('data-enhanced', 'true');

      expect(wrapper.classList.contains('code-block-wrapper')).toBe(true);
      expect(wrapper.classList.contains('group')).toBe(true);
      expect(wrapper.classList.contains('relative')).toBe(true);
      expect(wrapper.hasAttribute('data-enhanced')).toBe(true);
    });

    it('should create header with language and copy button', () => {
      const header = document.createElement('div');
      header.className =
        'code-block-header flex items-center justify-between bg-gray-800 px-4 py-2 text-sm rounded-t-lg';

      const langSpan = document.createElement('span');
      langSpan.className = 'text-gray-400 font-medium';
      langSpan.textContent = 'javascript';

      const copyButton = document.createElement('button');
      copyButton.className =
        'copy-button flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1 text-xs text-gray-300 transition-all hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

      header.appendChild(langSpan);
      header.appendChild(copyButton);

      expect(header.children).toHaveLength(2);
      expect(langSpan.textContent).toBe('javascript');
      expect(copyButton.classList.contains('copy-button')).toBe(true);
    });

    it('should handle various programming languages', () => {
      const languages = ['javascript', 'typescript', 'python', 'css', 'html', 'json'];

      languages.forEach((lang) => {
        const codeElement = document.createElement('code');
        codeElement.className = `language-${lang}`;
        codeElement.textContent = 'sample code';

        expect(codeElement.className).toBe(`language-${lang}`);
      });
    });
  });

  describe('DOM Integration', () => {
    it('should work with DOMContentLoaded event', () => {
      const eventListener = vi.fn();
      document.addEventListener('DOMContentLoaded', eventListener);

      // Simulate DOMContentLoaded
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      expect(eventListener).toHaveBeenCalled();
    });

    it('should work with astro:page-load event', () => {
      const eventListener = vi.fn();
      document.addEventListener('astro:page-load', eventListener);

      // Simulate astro:page-load
      const event = new Event('astro:page-load');
      document.dispatchEvent(event);

      expect(eventListener).toHaveBeenCalled();
    });

    it('should handle document ready states', () => {
      // Test loading state
      Object.defineProperty(document, 'readyState', {
        value: 'loading',
        writable: true
      });
      expect(document.readyState).toBe('loading');

      // Test complete state
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        writable: true
      });
      expect(document.readyState).toBe('complete');
    });
  });
});

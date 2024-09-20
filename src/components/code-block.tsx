import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  coldarkCold,
  coldarkDark
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useDarkMode } from '@/contexts/dark-mode-context';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [mounted, setMounted] = useState(false);
  const { darkMode } = useDarkMode();
  const [key, setKey] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [darkMode]);

  if (!mounted) {
    return null;
  }

  const formattedLanguage = language.replace(/^lang-/, '');
  const showLineNumbers = ![
    '',
    'bash',
    'console',
    'plaintext',
    'text',
    'txt'
  ].includes(formattedLanguage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div key={key} className='group relative'>
      <div className='absolute right-2 top-2'>
        <button
          onClick={handleCopy}
          className={cn(
            'rounded-md p-2 transition-opacity duration-200',
            'bg-gray-800 hover:bg-gray-700 dark:bg-gray-100 dark:hover:bg-gray-200',
            'opacity-20 focus:opacity-100 group-hover:opacity-100'
          )}
          aria-label='Copy code'
        >
          <DocumentDuplicateIcon className='h-5 w-5 text-white dark:text-black' />
        </button>
        {isCopied && (
          <span
            className={cn(
              'absolute -right-3 bottom-10 rounded-sm bg-green-800 px-2 py-1 text-sm text-white dark:bg-green-500 dark:text-black',
              'mb-1 -translate-y-full transform',
              'animate-slide-in-fade'
            )}
          >
            Copied!
          </span>
        )}
      </div>
      <SyntaxHighlighter
        language={formattedLanguage}
        style={darkMode ? coldarkDark : coldarkCold}
        showLineNumbers={showLineNumbers}
        wrapLongLines
        customStyle={{
          padding: `1rem ${showLineNumbers ? '0rem' : '1rem'}`,
          fontSize: '1rem',
          lineHeight: '1.5'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
export default CodeBlock;

import { cn } from '@/lib/utils';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  html: string;
}

export default function CodeBlock({ code, html }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

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
    <div className='group relative'>
      <div className='absolute top-2 right-2 z-10 flex gap-2'>
        <button
          type='button'
          onClick={handleCopy}
          className={cn(
            'rounded-md p-2 transition-opacity duration-200',
            'bg-gray-800 hover:bg-gray-700',
            'opacity-20 group-hover:opacity-100 focus:opacity-100'
          )}
          aria-label='Copy code'
        >
          <DocumentDuplicateIcon className='h-5 w-5 text-white' />
        </button>
        {isCopied && (
          <span
            className={cn(
              'absolute right-0 -bottom-1 translate-y-full rounded-sm bg-green-600 px-2 py-1 text-sm text-white',
              'animate-slide-in-fade'
            )}
          >
            Copied!
          </span>
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

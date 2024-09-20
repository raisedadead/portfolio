import React from 'react';
import { cn } from '@/lib/utils';

const SkeletonBlock = () => (
  <div className={cn('animate-pulse')} data-testid='skeleton-block'>
    <div className={cn('relative aspect-video w-full bg-gray-200')}></div>
    <div className={cn('p-6 sm:p-10')}>
      <div className={cn('mb-6 h-8 w-3/4 bg-gray-200')}></div>
      <div className={cn('space-y-4')}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={cn('space-y-2')}>
            <div className={cn('h-4 w-full bg-gray-200')}></div>
            <div className={cn('h-4 w-5/6 bg-gray-200')}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonBlock;

import React from 'react';

const SkeletonBlock = () => (
  <div className={'animate-pulse'} data-testid='skeleton-block'>
    <div className={'relative aspect-video w-full bg-gray-200'} />
    <div className={'p-6 sm:p-10'}>
      <div className={'mb-6 h-8 w-3/4 bg-gray-200'} />
      <div className={'space-y-4'}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`skeleton-paragraph-${i + 1}`} className={'space-y-2'}>
            <div className={'h-4 w-full bg-gray-200'} />
            <div className={'h-4 w-5/6 bg-gray-200'} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonBlock;

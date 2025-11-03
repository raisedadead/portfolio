import React from 'react';

export const GradientLayer: React.FC = () => {
  return (
    // Gradient background layer (z-1, bottom-most layer)
    <div className='absolute inset-0 z-1 bg-linear-to-b from-emerald-300 via-orange-200 to-teal-200' />
  );
};

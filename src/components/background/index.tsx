import React from 'react';
import { cn } from '@/lib/utils';
import { GradientLayer } from './gradient';
import { CanvasLayer } from './canvas';
import type { BackgroundProps } from './types';

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className={cn('relative h-screen w-screen overflow-hidden')}>
      {/* Layer 1: Gradient background (z-1) */}
      <GradientLayer />
      {/* Layer 2: Canvas with waves, birds, and grain (z-2) */}
      <CanvasLayer />
      {/* Layer 3: Page content (default z-index, above canvas) */}
      {children}
    </div>
  );
};

export default Background;

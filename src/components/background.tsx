import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const WaveBackground = () => {
  const waveVariants: Variants = {
    animate: (custom: { yValues: number[]; duration: number }) => ({
      y: custom.yValues,
      transition: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: custom.duration,
        ease: 'easeInOut'
      }
    })
  };

  const createWave = (index: number, totalWaves: number) => {
    const baseHeight = 50;
    const heightMultiplier = (totalWaves - index) / totalWaves;
    const waveHeight = baseHeight * heightMultiplier;
    const yOffset = index * 5;

    return (
      <motion.path
        key={index}
        d={`M0 ${800 - yOffset} C 200 ${800 - waveHeight - yOffset}, 300 ${800 + waveHeight - yOffset}, 500 ${800 - yOffset} S 700 ${800 - waveHeight - yOffset}, 1000 ${800 - yOffset} V 800 H 0 Z`}
        fill={`rgba(50, 222, 212, ${0.1 + index * 0.05})`}
        variants={waveVariants}
        animate='animate'
        custom={{
          yValues: [0, waveHeight / 2, 0, -waveHeight / 2, 0],
          duration: 5 + index * 0.5
        }}
      />
    );
  };

  return (
    <div
      className={cn(
        'relative h-screen w-screen overflow-hidden',
        'bg-gradient-to-b from-teal-300 via-orange-200 via-50% to-orange-100'
      )}
    >
      <svg
        className='absolute bottom-0 left-0 w-full'
        viewBox='0 0 1000 800'
        preserveAspectRatio='none'
      >
        {Array.from({ length: 8 }, (_, i) => createWave(i, 10))}
      </svg>
      <div className='absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-teal-300 to-transparent opacity-30' />
    </div>
  );
};

export default WaveBackground;

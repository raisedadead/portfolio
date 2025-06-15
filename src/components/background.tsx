import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

const WaveBackground = () => {
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
        animate={{
          y: [0, waveHeight / 2, 0, -waveHeight / 2, 0],
          transition: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse' as const,
            duration: 5 + index * 0.5,
            ease: 'easeInOut',
          },
        }}
      />
    );
  };

  return (
    <div
      className={cn(
        'relative h-screen w-screen overflow-hidden',
        'bg-linear-to-b from-emerald-300 via-orange-200 to-teal-200'
      )}
    >
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
        role="img"
        aria-label="Animated wave background decoration"
      >
        {Array.from({ length: 8 }, (_, i) => createWave(i, 10))}
      </svg>
      <div className="absolute bottom-0 left-0 h-32 w-full bg-linear-to-t from-teal-600 to-transparent opacity-30" />
    </div>
  );
};

export { WaveBackground };

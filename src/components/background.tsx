import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface Bird {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  wingPhase: number;
}

const WaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const birds: Bird[] = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.3),
      speedX: Math.random() * 2 + 1,
      speedY: 0,
      wingPhase: Math.random() * Math.PI * 2
    }));

    const updateBird = (bird: Bird) => {
      bird.x += bird.speedX;
      bird.wingPhase += 0.15;
      bird.speedY = Math.sin(bird.wingPhase) * 0.8;
      bird.y += bird.speedY;

      if (bird.x > canvas.width + 50) {
        bird.x = -50;
        bird.y = Math.random() * (canvas.height * 0.3);
      }
    };

    const drawBird = (bird: Bird) => {
      ctx.strokeStyle = '#2d5f4f';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      const wingFlap = Math.sin(bird.wingPhase) * 8;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(bird.x, bird.y);
      ctx.quadraticCurveTo(bird.x - 8, bird.y - 5 + wingFlap, bird.x - 12, bird.y + wingFlap);
      ctx.stroke();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(bird.x, bird.y);
      ctx.quadraticCurveTo(bird.x + 8, bird.y - 5 + wingFlap, bird.x + 12, bird.y + wingFlap);
      ctx.stroke();
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      birds.forEach((bird) => {
        updateBird(bird);
        drawBird(bird);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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
            ease: 'easeInOut'
          }
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
      <canvas
        ref={canvasRef}
        className='pointer-events-none absolute inset-0 h-full w-full'
        aria-label='Animated birds decoration'
      />
      <svg
        className='absolute bottom-0 left-0 w-full'
        viewBox='0 0 1000 800'
        preserveAspectRatio='none'
        role='img'
        aria-label='Animated wave background decoration'
      >
        {Array.from({ length: 8 }, (_, i) => createWave(i, 10))}
      </svg>
      <div className='absolute bottom-0 left-0 h-32 w-full bg-linear-to-t from-teal-600 to-transparent opacity-30' />
    </div>
  );
};

export { WaveBackground };

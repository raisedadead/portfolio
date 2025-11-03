import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Bird, Wave } from './types';
import { createBirds, updateBird, drawBird } from './birds';
import { createWaves, updateWave, drawWave } from './waves';

export const CanvasLayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let animationId: number;

    // Generate fine grain texture
    const grainCanvas = document.createElement('canvas');
    const grainCtx = grainCanvas.getContext('2d');

    const generateGrainTexture = () => {
      if (!grainCtx) return;

      grainCanvas.width = canvas.width;
      grainCanvas.height = canvas.height;

      // Create transparent base
      grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);

      // Generate uniform fine grain texture across entire canvas
      const imageData = grainCtx.getImageData(0, 0, grainCanvas.width, grainCanvas.height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        // Simple uniform noise - matches reference image style
        const noise = (Math.random() - 0.5) * 80;
        pixels[i] = 128 + noise; // R
        pixels[i + 1] = 128 + noise; // G
        pixels[i + 2] = 128 + noise; // B
        pixels[i + 3] = 255; // A
      }

      grainCtx.putImageData(imageData, 0, 0);

      // Add subtle radial vignette
      const vignetteGradient = grainCtx.createRadialGradient(
        grainCanvas.width / 2,
        grainCanvas.height / 2,
        0,
        grainCanvas.width / 2,
        grainCanvas.height / 2,
        Math.max(grainCanvas.width, grainCanvas.height) * 0.7
      );
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      grainCtx.globalCompositeOperation = 'source-atop';
      grainCtx.fillStyle = vignetteGradient;
      grainCtx.fillRect(0, 0, grainCanvas.width, grainCanvas.height);
      grainCtx.globalCompositeOperation = 'source-over';
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateGrainTexture();
    };

    resizeCanvas();

    // Initialize birds and waves
    const birds: Bird[] = createBirds(canvas.width, canvas.height);
    const waves: Wave[] = createWaves();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      waves.forEach((wave) => {
        updateWave(wave, deltaTime);
        drawWave(ctx, wave, canvas.width, canvas.height);
      });

      // Draw gradient overlay at bottom 16% of canvas
      const gradient = ctx.createLinearGradient(0, canvas.height - canvas.height * 0.16, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
      gradient.addColorStop(1, 'rgba(20, 184, 166, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - canvas.height * 0.16, canvas.width, canvas.height * 0.16);

      // Draw birds
      birds.forEach((bird) => {
        updateBird(bird, canvas.width, canvas.height);
        drawBird(ctx, bird);
      });

      // Draw fine grain texture overlay (subtle, like reference image)
      if (grainCanvas) {
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 0.35;
        ctx.drawImage(grainCanvas, 0, 0);
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
      }

      animationId = requestAnimationFrame(animate);
    };

    animate(performance.now());

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className='absolute inset-0 z-2' // Canvas layer with waves, birds, and grain
    >
      <canvas
        ref={canvasRef}
        className='pointer-events-none absolute inset-0 h-full w-full'
        aria-label='Animated wave and birds background decoration'
      />
    </motion.div>
  );
};

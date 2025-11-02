import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import React, { useEffect, useRef } from 'react';

interface Bird {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  wingPhase: number;
  opacity: number;
}

interface Wave {
  amplitude: number;
  wavelength: number;
  opacity: number;
  speed: number;
  time: number;
  color: { r: number; g: number; b: number };
}

const WaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateBird = (bird: Bird) => {
      bird.x += bird.speedX;
      bird.wingPhase += 0.15;
      bird.speedY = Math.sin(bird.wingPhase) * 0.8;
      bird.y += bird.speedY;

      if (bird.x > canvas.width + 50) {
        bird.x = -50;
        bird.y = Math.random() * (canvas.height * 0.25) + canvas.height * 0.15;
      }
    };

    const drawBird = (bird: Bird) => {
      ctx.strokeStyle = `rgba(0, 0, 0, ${bird.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      const wingFlap = Math.sin(bird.wingPhase) * 6;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(bird.x, bird.y);
      ctx.quadraticCurveTo(bird.x - 6, bird.y - 4 + wingFlap, bird.x - 9, bird.y + wingFlap);
      ctx.stroke();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(bird.x, bird.y);
      ctx.quadraticCurveTo(bird.x + 6, bird.y - 4 + wingFlap, bird.x + 9, bird.y + wingFlap);
      ctx.stroke();
    };

    const updateWave = (wave: Wave, deltaTime: number) => {
      wave.time += (deltaTime / 1000) * wave.speed;
    };

    const drawWave = (wave: Wave) => {
      const baseY = canvas.height * 0.88;
      const points: Array<{ x: number; y: number }> = [];
      const segments = Math.max(80, Math.ceil(canvas.width / 12));

      // Generate wave points using Gerstner wave physics with subtle noise
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * canvas.width;
        const k = (Math.PI * 2) / wave.wavelength;
        const phase = k * x - wave.time / Math.sqrt(wave.wavelength);

        // Add subtle natural variation using secondary sine wave
        const noise = Math.sin(x * 0.01 + wave.time * 0.3) * 2;
        const amplitudeVariation = wave.amplitude * (1 + Math.sin(wave.time * 0.2 + x * 0.005) * 0.15);

        // Gerstner wave: circular rolling motion with variation
        const xDisplacement = amplitudeVariation * Math.sin(phase) * 0.3;
        const yDisplacement = amplitudeVariation * Math.cos(phase) + noise;

        points.push({
          x: x - xDisplacement,
          y: baseY - yDisplacement
        });
      }

      // Find the highest point (minimum Y) of the wave
      const minY = Math.min(...points.map((p) => p.y));

      // Create gradient from white at wave top to wave color
      const gradient = ctx.createLinearGradient(0, minY, 0, canvas.height);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${wave.opacity})`);
      gradient.addColorStop(
        0.15,
        `rgba(${wave.color.r + 100}, ${wave.color.g + 20}, ${wave.color.b + 20}, ${wave.opacity})`
      );
      gradient.addColorStop(0.5, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.opacity})`);

      // Draw the wave shape
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // Use smooth curves between points
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      // Close the shape to bottom
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    };

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

    // Birds setup
    const birds: Bird[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.25) + canvas.height * 0.15,
      speedX: Math.random() * 1.5 + 0.8,
      speedY: 0,
      wingPhase: Math.random() * Math.PI * 2,
      opacity: 0.5 + Math.random() * 0.25
    }));

    // Waves setup using Gerstner/Trochoidal wave physics with natural variance
    const waves: Wave[] = Array.from({ length: 6 }, (_, index) => {
      const baseWavelength = 250 + index * 60;
      const wavelength = baseWavelength + (Math.random() - 0.5) * 50;
      const baseAmplitude = 12 + index * 3;
      return {
        amplitude: baseAmplitude + (Math.random() - 0.5) * 6,
        wavelength: wavelength,
        opacity: 0.08 + index * 0.04 + Math.random() * 0.02,
        speed: Math.sqrt(wavelength) * (0.3 + Math.random() * 0.2),
        time: Math.random() * 100,
        color: {
          r: 50 + Math.random() * 30,
          g: 222 + Math.random() * 20 - 10,
          b: 212 + Math.random() * 20 - 10
        }
      };
    });

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      waves.forEach((wave) => {
        updateWave(wave, deltaTime);
        drawWave(wave);
      });

      // Draw gradient overlay
      const gradient = ctx.createLinearGradient(0, canvas.height - canvas.height * 0.16, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
      gradient.addColorStop(1, 'rgba(20, 184, 166, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - canvas.height * 0.16, canvas.width, canvas.height * 0.16);

      // Draw birds
      birds.forEach((bird) => {
        updateBird(bird);
        drawBird(bird);
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
    <div
      className={cn(
        'relative h-screen w-screen overflow-hidden',
        'bg-linear-to-b from-emerald-300 via-orange-200 to-teal-200'
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <canvas
          ref={canvasRef}
          className='pointer-events-none absolute inset-0 h-full w-full'
          aria-label='Animated wave and birds background decoration'
        />
      </motion.div>
    </div>
  );
};

export { WaveBackground };

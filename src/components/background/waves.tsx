import type { Wave } from './types';

export const createWaves = (): Wave[] => {
  return Array.from({ length: 6 }, (_, index) => {
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
};

export const updateWave = (wave: Wave, deltaTime: number) => {
  wave.time += (deltaTime / 1000) * wave.speed;
};

export const drawWave = (ctx: CanvasRenderingContext2D, wave: Wave, canvasWidth: number, canvasHeight: number) => {
  const baseY = canvasHeight * 0.88;
  const points: Array<{ x: number; y: number }> = [];
  const segments = Math.max(80, Math.ceil(canvasWidth / 12));

  // Generate wave points using Gerstner wave physics with subtle noise
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * canvasWidth;
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
  const gradient = ctx.createLinearGradient(0, minY, 0, canvasHeight);
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
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(0, canvasHeight);
  ctx.closePath();
  ctx.fill();
};

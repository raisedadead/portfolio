import type { Bird } from './types';

export const createBirds = (canvasWidth: number, canvasHeight: number): Bird[] => {
  return Array.from({ length: 12 }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * (canvasHeight * 0.25) + canvasHeight * 0.15,
    speedX: Math.random() * 1.5 + 0.8,
    speedY: 0,
    wingPhase: Math.random() * Math.PI * 2,
    opacity: 0.5 + Math.random() * 0.25
  }));
};

export const updateBird = (bird: Bird, canvasWidth: number, canvasHeight: number) => {
  bird.x += bird.speedX;
  bird.wingPhase += 0.15;
  bird.speedY = Math.sin(bird.wingPhase) * 0.8;
  bird.y += bird.speedY;

  if (bird.x > canvasWidth + 50) {
    bird.x = -50;
    bird.y = Math.random() * (canvasHeight * 0.25) + canvasHeight * 0.15;
  }
};

export const drawBird = (ctx: CanvasRenderingContext2D, bird: Bird) => {
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

export interface Bird {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  wingPhase: number;
  opacity: number;
}

export interface Wave {
  amplitude: number;
  wavelength: number;
  opacity: number;
  speed: number;
  time: number;
  color: { r: number; g: number; b: number };
}

export interface BackgroundProps {
  children?: React.ReactNode;
}

import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import 'jest-axe/extend-expect';

// Type definitions for mocks
interface ImageProps {
  src: string;
  alt: string;
  [key: string]: unknown;
}

// Mock Astro components for testing
vi.mock('astro:assets', () => ({
  Image: ({ src, alt, ...props }: ImageProps) => {
    return `<img src="${src}" alt="${alt}" {...props} />`;
  }
}));

// Mock client directives (they don't run in test environment)
vi.mock('astro:client', () => ({}));

// Mock global fetch for API testing
global.fetch = vi.fn();

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined)
  },
  writable: true
});

// Mock document.body.style
Object.defineProperty(document.body, 'style', {
  value: {
    paddingRight: ''
  },
  writable: true
});

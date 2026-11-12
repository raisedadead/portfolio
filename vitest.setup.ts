import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import 'jest-axe/extend-expect';

// Mock global fetch for API testing
global.fetch = vi.fn();

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

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

const cancelAnimation = window.Animation.prototype.cancel;
window.Animation.prototype.cancel = function cancelWithHandledFinished(this: Animation) {
  this.finished.catch(() => {});
  cancelAnimation.call(this);
};

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined)
  },
  writable: true
});

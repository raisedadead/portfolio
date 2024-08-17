import { vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Space_Mono: () => ({
    style: {
      fontFamily: 'mocked'
    }
  }),
  Bricolage_Grotesque: () => ({
    style: {
      fontFamily: 'mocked'
    }
  })
}));

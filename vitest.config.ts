import path from 'node:path';
import react from '@vitejs/plugin-react';
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';

// For Astro component testing
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.config.*',
        '**/*.setup.*',
        'src/__tests__/**',
        'src/__mocks__/**'
      ]
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/.astro/**', '**/coverage/**']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
} satisfies UserConfig);

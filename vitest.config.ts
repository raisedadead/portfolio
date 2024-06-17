import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8'
    },
    alias: {
      '@/components': `${__dirname}/src/components`,
      '@/lib': `${__dirname}/src/lib`,
      '@/pages': `${__dirname}/src/pages`
    }
  }
});

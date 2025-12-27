import path from 'path';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    test: {
      include: ['tests/vitest/**/*.test.{ts,tsx}', 'tests/vitest/**/*.spec.{ts,tsx}'],
    },
  };
});

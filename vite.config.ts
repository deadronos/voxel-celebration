import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { loadEnv, defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', '');
  return {
    base: mode === 'production' ? '/voxel-celebration/' : '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    test: {
      include: ['tests/vitest/**/*.test.{ts,tsx}', 'tests/vitest/**/*.spec.{ts,tsx}'],
      environment: 'jsdom',
      setupFiles: ['./tests/vitest/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['tests/**', 'src/**/*.d.ts'],
        all: true,
      },
    },
  };
});

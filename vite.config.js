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
    // The Codex sandbox blocks Node child-process pipes, which breaks esbuild's
    // long-lived service mode. Disabling esbuild + dep optimization keeps Vitest
    // runnable in this environment while preserving normal app behavior.
    esbuild: false,
    optimizeDeps: {
      disabled: true,
    },
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
    test: {
      include: ['tests/vitest/**/*.test.{ts,tsx}', 'tests/vitest/**/*.spec.{ts,tsx}'],
      environment: 'jsdom',
      setupFiles: ['./tests/vitest/setup.ts'],
      deps: {
        optimizer: {
          client: { enabled: false },
          ssr: { enabled: false },
        },
      },
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

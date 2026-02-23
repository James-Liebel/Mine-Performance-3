import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['lib/**/*.test.ts', 'packages/core/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@mine-performance/core': path.resolve(__dirname, './packages/core/src'),
      '@mine-performance/core/hooks': path.resolve(__dirname, './packages/core/src/hooks'),
    },
  },
});

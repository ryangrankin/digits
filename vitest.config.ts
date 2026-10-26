import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[jt]sx?$/,
    jsx: 'automatic',
  },
  test: {
    include: [
      'tests/unit/**/*.test.ts',
      'tests/unit/**/*.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/lib/**/*.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        'src/app/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/layout.tsx',
      ],
    },
  },
});

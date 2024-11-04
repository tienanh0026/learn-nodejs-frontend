import { defineConfig } from 'vitest/config'
import { resolve } from 'path';

export default defineConfig({
    plugins: [],
    resolve: {
        alias: {
          '@modules': resolve(__dirname, 'src/modules'),
        },
      },
    test: {
      environment: 'jsdom'
    },
  });
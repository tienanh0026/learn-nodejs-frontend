import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
import path from 'path'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: path.resolve(__dirname, './src/mocks/setupFiles.ts'),
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/dev-dist/**',
        '**/e2e/**',
        '**/src/stories/**',
        '**/*.stories.ts',
      ],
      coverage: {
        provider: 'istanbul',
        thresholds: {
          functions: 90,
        },
        include: [
          '**/src/components/**',
          '**/src/features/**',
          '**src/pages/**',
        ],
        exclude: [
          '**/dist**',
          '**/src/stories/**',
          '**/*.stories.ts',
          '**/src/App.tsx',
          '**/src/main.tsx',
          '**/src/service-worker.ts',
        ],
      },
    },
  })
)

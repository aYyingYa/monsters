import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vitest/config'
import singleFileCompression from 'vite-plugin-singlefile-compression'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    singleFileCompression(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    // keep the CRA-style REACT_APP_* variables from .env (read via import.meta.env)
    envPrefix: 'REACT_APP_',
    build: {
      outDir: 'build',
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.js',
    },
  }
})

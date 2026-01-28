import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },
    define: {
      // Ensure these are available at build time
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || (mode === 'production' ? 'https://k23dx.onrender.com/api' : 'http://localhost:4000/api')
      ),
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        env.VITE_BACKEND_URL || (mode === 'production' ? 'https://k23dx.onrender.com' : 'http://localhost:4000')
      ),
      'import.meta.env.VITE_BACKEND': JSON.stringify(
        env.VITE_BACKEND || (mode === 'production' ? 'render' : 'nodejs')
      ),
    },
  }
})

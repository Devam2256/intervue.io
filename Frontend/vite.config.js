// vite.config.js: Configuration file for Vite build tool
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Plugins to use during build
  plugins: [
    react(),        // React plugin for JSX support
    tailwindcss(),  // Tailwind CSS plugin
  ],
  
  // Development server configuration
  server: {
    // Proxy configuration - forward API requests to backend
    proxy: {
      '/api': 'http://localhost:3000', // Send all /api requests to backend server
    },
  },
})
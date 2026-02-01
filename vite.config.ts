import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {} // Fix for some libs relying on process.env
  },
  build: {
    lib: {
      entry: 'src/web-component.tsx',
      name: 'WishlistDock',
      fileName: (format) => `wishlist-dock.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'wishlist-dock.css';
          return assetInfo.name as string;
        }
      }
    }
  }
})

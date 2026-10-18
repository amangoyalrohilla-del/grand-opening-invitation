import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `base: './'` makes the build work from any folder or host
// (Netlify drop, Vercel, GitHub Pages, cPanel sub-folder, etc.).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 900,
  },
});

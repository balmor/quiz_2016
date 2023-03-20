import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../dist',
  },
});
import { defineConfig, mergeConfig } from 'vite';
import base from './vite.config';

export default mergeConfig(base, defineConfig({
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    outDir: 'dist',
    emptyOutDir: true,
  },
}));

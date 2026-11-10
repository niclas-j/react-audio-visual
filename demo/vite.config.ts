import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  resolve: { alias: [{ find: /^@\//, replacement: fileURLToPath(new URL('../src/', import.meta.url)) }] },
});

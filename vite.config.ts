import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const stubAssets = {
  name: 'stub-assets',
  resolveId(id) { return /\.(svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|eot)(\?.*)?$/.test(id) ? '\0asset:' + id : null; },
  load(id) { return id.startsWith('\0asset:') ? 'export default "";' : null; },
};

export default defineConfig({
  plugins: [react(), stubAssets],
  resolve: {
    alias: [
      { find: new RegExp("^@/"), replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
      { find: new RegExp("^~/"), replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
      { find: new RegExp("^src/"), replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
      { find: /^src\//, replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
    ],
    extensions: ['.mjs','.js','.mts','.ts','.jsx','.tsx','.json'],
  },
  test: { environment: 'jsdom', globals: true, setupFiles: ["./src/test-setup/jest-shim.ts","./src/test-setup/jest-dom-setup.ts","./src/test-setup/setup/tests.setup.ts"], exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'], css: { modules: { classNameStrategy: 'non-scoped' } } },
});

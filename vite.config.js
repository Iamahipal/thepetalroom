import { defineConfig } from 'vite';

// The site is served from the GitHub Pages project subpath:
//   https://iamahipal.github.io/thepetalroom/
// so every built asset URL must be prefixed with /thepetalroom/.
export default defineConfig({
  base: '/thepetalroom/',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split the heavy, lazy-loaded WebGL lib into its own chunk
          ogl: ['ogl'],
        },
      },
    },
  },
});

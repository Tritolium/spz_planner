import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        filename: 'service-worker.js',
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: 'SPZ/TCD Planer',
          short_name: 'Planer',
          theme_color: '#282c34',
          background_color: '#243b26',
          icons: [
            {
              src: "favicon.ico",
              sizes: "any",
              type: "image/ico"
            },
            {
              src: "favicon.png",
              sizes: "any",
              type: "image/png"
            }
          ],
        },
      })
    ],
    define: {
      'process.env': process.env,
    },
    base:'./',
  };
});

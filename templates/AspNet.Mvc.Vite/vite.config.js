import { viteConfig } from 'aspnet-buildtools';
import { defineConfig } from 'vite'

export default defineConfig({
  ...viteConfig,
  build: {
    assetsDir: '',
    manifest: 'assets-manifest.json',
    outDir: 'wwwroot/dist',
    rollupOptions: {
      ...viteConfig.build.rollupOptions,
    },
  },
  server: {
    cors: true,
  },
});

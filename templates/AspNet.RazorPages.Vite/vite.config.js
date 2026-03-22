import { viteConfig } from 'aspnet-buildtools';
import { defineConfig } from 'vite'

export default defineConfig({
  ...viteConfig,
  build: {
    assetsDir: '',
    manifest: 'assets-manifest.json',
    outDir: 'wwwroot/dist',
    rolldownOptions: {
      ...viteConfig.build.rolldownOptions,
    },
  },
  server: {
    cors: true,
  },
});

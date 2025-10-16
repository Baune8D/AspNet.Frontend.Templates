import type { UserConfig } from 'vite'
import { viteConfig } from 'aspnet-buildtools';

export default {
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
} satisfies UserConfig;

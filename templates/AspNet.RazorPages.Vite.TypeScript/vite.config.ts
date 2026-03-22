import type { UserConfig } from 'vite'
import { viteConfig } from 'aspnet-buildtools';

export default {
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
} satisfies UserConfig;

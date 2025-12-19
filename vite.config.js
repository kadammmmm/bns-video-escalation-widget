import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'VideoEscalationWidget',
      fileName: 'video-escalation-widget',
      formats: ['es']  // ES module – perfect for WxCC desktop
    },
    rollupOptions: {
      // Externalize SDK (loaded at runtime in desktop)
      external: ['@wxcc-desktop/sdk'],
      output: {
        globals: { '@wxcc-desktop/sdk': 'Desktop' }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
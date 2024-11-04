import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      srcDir: "src",
      scope: "/",
      filename: "service-worker.ts",
      strategies: "injectManifest",
      manifest: {
        name: "My App",
        short_name: "App",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/icon.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
    
  ],
  server: {
    fs: {
      strict: false, // Allow serving files from the src directory
    },
  },
  
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    server: {
      host: "::",
      port: 8080,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "production" && compression(),
      mode === "production" && visualizer()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-icons', '@radix-ui/react-slot', '@radix-ui/react-toast'],
            components: ['./src/components/ui/**/*.tsx']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      minify: mode === "production",
      target: 'esnext'
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    },
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  };
});

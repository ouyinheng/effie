import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import commonjsExternals from "vite-plugin-commonjs-externals";

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
const externals = ["path", /^electron(\/.+)?$/];
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    commonjsExternals({
      externals
    })
  ],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@elec": fileURLToPath(new URL("./electron", import.meta.url))
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    // 不压缩，用于调试
    minify: false
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        additionalData: ["@import './src/assets/style/index.less';"],
        globalVars: {
          mainColor: "red"
        }
      }
    }
  }
});

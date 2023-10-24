import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// https://vitejs.dev/config/
// https://blog.egmond.dev/vue-component-to-npm-package
export default defineConfig({
  plugins: [
    vue(), 
    libInjectCss()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'InfiniTimeline',
      fileName: 'InfiniTimeline'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})

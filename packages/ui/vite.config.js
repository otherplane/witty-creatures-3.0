import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { radar } from 'svg-radar-chart'
import { stringify } from 'virtual-dom-stringify'

export default defineConfig({
  build: {
    emptyOutDir: true
  },
  plugins: [vue(), Components(), radar, stringify],
  css: {
    preprocessorOptions: {
      scss: {
        // and local and vuetify variables globally
        additionalData: `
              @import '@/assets/style/main.scss';
            `
      },
      sass: {
        // override vuetify variables by local variables
        additionalData: `
              @import '@/assets/style/main.scss';
            `
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  define: {
    'process.env': {}
  }
})

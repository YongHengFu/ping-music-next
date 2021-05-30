import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { svgBuilder } from './src/plugins/svgBuilder'
import styleImport from 'vite-plugin-style-import'
// https://vitejs.dev/config/

export default defineConfig({
  base: './',
  server: {
    port: 6868
    // open: true,
  },
  plugins: [
    vue(),
    svgBuilder('./src/assets/icons/svg/'),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          }
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})

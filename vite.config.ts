import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { svgBuilder } from './src/plugins/svgBuilder';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgBuilder('./src/assets/icons/svg/')],
    resolve: {
        alias: {
            '@':resolve(__dirname,'./src')
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    }
})

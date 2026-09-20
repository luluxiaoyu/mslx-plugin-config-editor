import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import createExternal from 'vite-plugin-external';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [
    createExternal({
      externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        pinia: 'Pinia',
        'tdesign-vue-next': 'TDesign',
        'mslx-request': 'mslxRequest'
      }
    }),

    vue({
      template: { compilerOptions: { hoistStatic: false } }
    }),
    UnoCSS({
      mode: 'vue-scoped'
    }),
    cssInjectedByJsPlugin(),
  ],

  server: {
    port: 5001,
    cors: true,
  },
  preview: {
    port: 5001,
    cors: true,
  },


  build: {
    // 使用 terser 获得比默认 esbuild 更高的压缩率（嵌入式单文件插件，体积小优先于构建速度）
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
        passes: 2,            // 多轮压缩，进一步减小体积
        // 仅删除 log/info/debug，保留 console.warn / console.error 便于排查线上问题
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: true,
      format: {
        comments: false,      // 移除所有注释
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/pluginEntry.ts'),
      name: 'MslxPlugin',
      formats: ['es'],
      fileName: () => 'mslx-plugin-entry.js'
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia', 'tdesign-vue-next', 'mslx-request'],
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
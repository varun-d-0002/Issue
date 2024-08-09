/// <reference types="vitest" />
import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  /**
   * Replace env variables in index.html
   * @see https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
   * @example `%VITE_MY_ENV%`
   * @see https://vitejs.dev/guide/api-plugin.html#transformindexhtml
   */
  function htmlPlugin(env) {
    return {
      name: 'html-transform',
      transformIndexHtml: {
        enforce: 'pre',
        transform: (html) => html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
      },
    }
  }

  return {
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
    },
    resolve: {
      alias: [
        {
          find: 'common',
          replacement: resolve(__dirname, 'src/common'),
        },
        {
          find: 'components',
          replacement: resolve(__dirname, 'src/components'),
        },
        {
          find: 'layouts',
          replacement: resolve(__dirname, 'src/layouts'),
        },
        {
          find: 'views',
          replacement: resolve(__dirname, 'src/views'),
        },
      ],
    },
    plugins: [react(), htmlPlugin(loadEnv(mode, '.'))],
  }
})

//@ts-nocheck
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default () => {
  // Load app-level env vars to node-level env vars.

  return defineConfig({
    main: { plugins: [externalizeDepsPlugin()] },
    preload: { plugins: [externalizeDepsPlugin()] },
    renderer: {
      resolve: { alias: { '@renderer': resolve('src/renderer/src') } },
      plugins: [
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => tag.startsWith('Overlay')
            }
          }
        })
      ]
    }
  })
}
